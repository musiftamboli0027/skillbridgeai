const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { protect } = require('../middleware/authMiddleware');
const { yearAccess } = require('../middleware/yearMiddleware');


// ─────────────────────────────────────────────────────────────────
//  LYZR AI CONFIGURATION
// ─────────────────────────────────────────────────────────────────
const LYZR_API_KEY    = process.env.LYZR_API_KEY;
const LYZR_AGENT_ID   = process.env.LYZR_AGENT_ID;
// Confirmed correct Lyzr v3 production endpoint
const LYZR_API_URL    = 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/';
const LYZR_TIMEOUT_MS = 20000; // 20s — LLM calls can be slow

if (!LYZR_API_KEY)  console.warn('[Lyzr] WARNING: LYZR_API_KEY is not set in .env');
if (!LYZR_AGENT_ID) console.warn('[Lyzr] WARNING: LYZR_AGENT_ID is not set in .env');

/**
 * Calls the Lyzr agent using native Node 18+ fetch with AbortController timeout.
 * @param {string} message    - The student's message
 * @param {string} sessionId  - Unique session ID (for conversation memory)
 * @param {string} userId     - User identifier
 * @returns {Promise<{success: boolean, reply?: string, error?: string, statusCode?: number}>}
 */
async function callLyzrAgent(message, sessionId = 'default-session', userId = 'skillbridge-user') {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), LYZR_TIMEOUT_MS);

    try {
        const response = await fetch(LYZR_API_URL, {
            method: 'POST',
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': LYZR_API_KEY,
            },
            body: JSON.stringify({
                agent_id: LYZR_AGENT_ID,
                session_id: sessionId,
                user_id: userId,
                message,
            }),
        });

        clearTimeout(timer);
        const raw = await response.text();

        if (!response.ok) {
            console.error(`[Lyzr] HTTP ${response.status}:`, raw);
            return { success: false, error: `Lyzr API error: HTTP ${response.status}`, statusCode: response.status };
        }

        let json;
        try {
            json = JSON.parse(raw);
        } catch (e) {
            console.error('[Lyzr] Failed to parse response JSON:', raw);
            return { success: false, error: 'Failed to parse Lyzr response.' };
        }

        // Lyzr v3 returns { response: '...' }
        // Fallback chain covers any minor field variations
        const reply =
            json?.response ??
            json?.message ??
            json?.output ??
            json?.data?.response ??
            null;

        if (reply !== null && reply !== undefined) {
            return { success: true, reply: String(reply) };
        }

        console.error('[Lyzr] Unexpected response shape:', JSON.stringify(json));
        return { success: false, error: 'Unexpected Lyzr response format.' };

    } catch (err) {
        clearTimeout(timer);
        if (err.name === 'AbortError') {
            console.error('[Lyzr] Request timed out after', LYZR_TIMEOUT_MS, 'ms');
            return { success: false, error: 'Lyzr API request timed out.' };
        }
        console.error('[Lyzr] Fetch error:', err.message);
        return { success: false, error: err.message };
    }
}


// Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const AI_TIMEOUT_MS = 10000;
const MODELS = [
    "gemini-2.0-flash-lite",   // Very fast, highest free-tier quota, confirmed available
    "gemini-flash-latest",     // Always-updated alias - points to the best flash available  
    "gemini-2.5-flash",        // Most capable fallback (May have lower free quota)
];

if (!GEMINI_API_KEY) {
    console.error("CRITICAL: GEMINI_API_KEY is not defined in environment variables.");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/**
 * Enterprise-grade AI response generator with multi-model fallback and timeout protection.
 * @param {string} prompt - The student context and task prompt.
 * @returns {Promise<{success: boolean, data?: any, isQuotaExceeded?: boolean}>}
 */
async function generateAIResponse(prompt) {
    let lastError = null;

    for (const modelName of MODELS) {
        try {
            console.log(`[AI Tutor] Attempting generation with model: ${modelName}`);

            const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: { responseMimeType: "application/json" }
            });

            // Timeout protection: 10 second limit per model attempt
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("AI_TIMEOUT")), AI_TIMEOUT_MS)
            );

            const result = await Promise.race([
                model.generateContent(prompt),
                timeoutPromise
            ]);

            const responseText = result.response.text();

            // Safe JSON Parsing with fallback cleaning
            let feedback;
            try {
                feedback = JSON.parse(responseText);
            } catch (e) {
                const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
                feedback = JSON.parse(cleanJson);
            }

            return { success: true, data: feedback };

        } catch (err) {
            lastError = err;
            const errorMsg = (err.message || "").toLowerCase();
            const status = err.status || 0;

            console.warn(`[AI Tutor] Model ${modelName} failed: ${errorMsg}`);

            // Detect Quota/Rate Limit (429) - specifically handle to inform strategy
            if (status === 429 || errorMsg.includes("429") || errorMsg.includes("quota")) {
                console.warn(`[AI Tutor] Quota exceeded for ${modelName}.`);
                continue; // Try next model
            }

            // Detect Model Not Found (404) or Overloaded (503)
            if (status === 404 || status === 503 || errorMsg.includes("not found") || errorMsg.includes("overloaded")) {
                continue; // Try next model
            }

            // If it's a timeout, log and move to next model
            if (errorMsg.includes("timeout")) {
                console.warn(`[AI Tutor] Request timed out for ${modelName}.`);
                continue;
            }

            // For other critical errors (e.g., 400 Bad Request), we might want to stop early
            if (status === 400) break;
        }
    }

    // Comprehensive failure analysis
    const isQuota = lastError?.status === 429 || lastError?.message?.includes("quota") || lastError?.message?.includes("429");

    return {
        success: false,
        isQuotaExceeded: isQuota,
        error: lastError?.message || "All AI models exhausted"
    };
}

// ─────────────────────────────────────────────────────────────────
//  LYZR AI TUTOR ROUTES
// ─────────────────────────────────────────────────────────────────

/**
 * @route   POST /api/ai/tutor
 * @desc    Conversational AI Tutor powered by Lyzr Agent (Knowledge-Base backed)
 * @access  Public
 * @body    { message: string, sessionId?: string }
 */
router.post('/tutor', async (req, res) => {
    const { message, sessionId } = req.body;

    if (!message || message.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Message is required.',
        });
    }

    if (!LYZR_API_KEY || !LYZR_AGENT_ID) {
        return res.status(503).json({
            success: false,
            message: 'Lyzr AI Tutor is not configured on the server.',
        });
    }

    console.log(`[Lyzr Tutor] Incoming message: "${message.slice(0, 60)}..."`);

    try {
        const result = await callLyzrAgent(
            message.trim(),
            sessionId || `skillbridge-session-${Date.now()}`
        );

        if (result.success) {
            return res.json({
                success: true,
                reply: result.reply,
                source: 'lyzr',
            });
        }

        console.error('[Lyzr Tutor] Agent call failed:', result.error);
        return res.status(503).json({
            success: false,
            message: 'AI Tutor is temporarily unavailable. Please try again in a moment.',
            detail: process.env.NODE_ENV === 'development' ? result.error : undefined,
        });

    } catch (err) {
        console.error('[Lyzr Tutor] Critical error:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal error in AI Tutor subsystem.',
        });
    }
});

/**
 * @route   GET /api/ai/tutor
 * @desc    Health check — verifies Lyzr config is present
 * @access  Public
 */
router.get('/tutor', (req, res) => {
    res.json({
        success: true,
        message: 'Lyzr AI Tutor route is online ✅',
        configured: !!LYZR_API_KEY && !!LYZR_AGENT_ID,
        agentId: LYZR_AGENT_ID ? `${LYZR_AGENT_ID.slice(0, 8)}...` : 'NOT SET',
    });
});

// ─────────────────────────────────────────────────────────────────
//  GEMINI AI ROUTES (existing)
// ─────────────────────────────────────────────────────────────────

/**
 * @route   POST /api/ai/debug
 * @desc    Analyzes student code and provides Socratic feedback
 * @access  Private (2nd Year+)
 */
router.post('/debug', protect, yearAccess(['2nd Year', '3rd Year', '4th Year']), async (req, res) => {
    const { code, language, problemStatement, lessonTitle } = req.body;

    // Validate request
    if (!code || !language) {
        return res.status(400).json({
            success: false,
            message: "Incomplete request. Code and language are required."
        });
    }

    const prompt = `
        You are SkillBridge AI Tutor, a master polyglot coding instructor.
        You are helping a student debug ${language} code for: "${lessonTitle}".
        
        CONTEXT:
        ${problemStatement}

        STUDENT CODE:
        \`\`\`${language}
        ${code}
        \`\`\`

        TASK:
        1. Analyze the code specifically for ${language} idioms and common errors.
        2. Provide guided feedback using the Socratic method (don't give the direct answer).
        
        RULES:
        - Identify the line number where the issue starts.
        - errorType should be "Syntax", "Logic", or "Optimized".
        - Be encouraging but firm on logic.

        JSON SCHEMA:
        {
            "errorType": "string",
            "lineNumber": "number",
            "explanation": "string",
            "hint": "string",
            "improvementTip": "string"
        }
    `;

    try {
        const aiResponse = await generateAIResponse(prompt);

        if (aiResponse.success) {
            return res.json({
                success: true,
                aiAvailable: true,
                data: aiResponse.data
            });
        }

        // Handle Quota/Scaling Issues gracefully
        if (aiResponse.isQuotaExceeded) {
            return res.json({
                success: true,
                aiAvailable: false,
                message: "AI Tutor is processing many requests. Please retry in 30 seconds."
            });
        }

        // Generic Failure
        return res.status(503).json({
            success: false,
            aiAvailable: false,
            message: "AI Tutor is currently recalibrating. Please try again later."
        });

    } catch (criticalErr) {
        console.error("[AI Tutor Critical Failure]:", criticalErr);
        res.status(500).json({
            success: false,
            message: "Internal core failure in AI subsystem."
        });
    }
});

/**
 * @route   GET /api/ai/debug
 * @desc    Health check for AI routes
 */
router.get('/debug', (req, res) => {
    res.json({
        success: true,
        message: "AI Controller Online ✅",
        config: {
            modelsActive: MODELS.length,
            timeout: `${AI_TIMEOUT_MS / 1000}s`
        }
    });
});

// ─────────────────────────────────────────────────────────────────
//  PYTHON BASICS SYLLABUS — Embedded Course Knowledge Base
//  This is the "training data" the AI Tutor uses to answer questions
// ─────────────────────────────────────────────────────────────────
const PYTHON_BASICS_SYLLABUS = `
=== SKILLBRIDGE PYTHON BASICS — COMPLETE COURSE SYLLABUS ===

COURSE OVERVIEW:
SkillBridge Python for Beginners is a 4-week guided learning pathway. The goal is to help 
students transition from zero programming knowledge to building real-world command-line 
applications. Teaching philosophy: students learn by doing, experimenting, debugging, and 
logical reasoning. The AI Tutor gives hints and identifies mistakes WITHOUT revealing full answers.

══════════════════════════════════════════════════════
WEEK 1: PYTHON FOUNDATIONS
══════════════════════════════════════════════════════

LESSON 1 — What is Programming?
• Programming = giving instructions to a computer to perform tasks automatically
• A program follows: Input → Processing → Output
• Algorithm = a step-by-step method to solve a problem BEFORE writing code
• Example algorithm to find largest number: (1) Take two numbers (2) Compare them (3) Print the larger one
• Why Python for beginners: simple syntax, less code, used in AI/Web/Data Science/Automation

LESSON 2 — Python Syntax and Indentation
• Syntax = the rules of writing code
• python is clean — no semicolons, no curly braces needed
• print("Hello World") — basic output
• Indentation (spaces at start of line) defines code BLOCKS — Python enforces this strictly
• Correct: if 5 > 2: (newline) (4 spaces) print("Correct")
• WRONG — missing indent causes IndentationError
• Why indentation: improves readability, enforces clean style

LESSON 3 — Variables and Data Types
• Variable = a container to store data. Example: name = "Musif"  age = 21
• Python auto-detects types — no need to declare
• Data Types:
  - int (integer): whole numbers. Example: x = 10
  - float: decimal numbers. Example: price = 99.5
  - str (string): text in quotes. Example: city = "Mumbai"
  - bool (boolean): True or False. Example: is_active = True
• Check type: print(type(x))  → <class 'int'>

LESSON 4 — Input and Output Operations
• Output: print() function — print("Welcome to Python")
• Input: input() function — name = input("Enter your name: ")
• IMPORTANT: input() always returns a STRING by default
• To get numbers: age = int(input("Enter age: "))
• Example combining both:
  a = int(input("Enter first number: "))
  b = int(input("Enter second number: "))
  print("Sum =", a + b)

LESSON 5 — Operators and Expressions
• Arithmetic: + - * / // % **
  - // = floor division (integer result)
  - % = modulus (remainder). 5 % 2 = 1
  - ** = exponent. 5 ** 2 = 25
• Comparison: == != > < >= <=  (always return True or False)
• Logical: and (both must be True), or (at least one True), not (reverses True/False)
• Expression = combination of variables, operators, values: result = (a + b) * 2

══════════════════════════════════════════════════════
WEEK 2: LOGIC BUILDING AND FLOW CONTROL
══════════════════════════════════════════════════════

LESSON 1 — Conditional Statements (if, elif, else)
• if checks a condition — if True, runs indented block; if False, skips
• if-else: if handles True case, else handles False case
• if-elif-else: multiple conditions, Python checks TOP to BOTTOM, only FIRST True block runs
• Example:
  marks = 75
  if marks >= 90:
      print("Grade A")
  elif marks >= 60:
      print("Grade B")
  else:
      print("Grade C")
• Rules: use colon : after condition, indentation mandatory, only first True block executes

LESSON 2 — Logical Expressions
• and: BOTH conditions must be True
  if age >= 18 and has_id:  print("Entry allowed")
• or: ONE condition needs to be True
  if day == "Saturday" or day == "Sunday":  print("Weekend")
• not: reverses True↔False
  if not is_logged_in:  print("Please login")

LESSON 3 — for and while Loops
• for loop: used when number of iterations is KNOWN
  for i in range(5): print(i)  → prints 0 1 2 3 4
  for fruit in fruits: print(fruit)  → iterates a list
• while loop: used when a CONDITION decides repetition
  count = 1
  while count <= 5:
      print(count)
      count += 1
• INFINITE LOOP WARNING: while True: print("Hello") — runs forever, need break or Ctrl+C
• for vs while: for = known iterations, while = condition-based

LESSON 4 — The range() Function
• Syntax: range(start, stop, step)
• range(5) → 0 1 2 3 4 (stop value is EXCLUDED)
• range(2, 6) → 2 3 4 5
• range(1, 10, 2) → 1 3 5 7 9 (step of 2)
• range(10, 0, -1) → 10 9 8 ... 1 (reverse loop)

LESSON 5 — Debugging Logical Errors
• Logical errors: code RUNS but gives WRONG output (no syntax error, just wrong thinking)
• Common mistakes:
  - Wrong operator: if a = 5 ← should be if a == 5 (= is assignment, == is comparison)
  - Wrong indentation: code outside if block runs anyway
  - Wrong loop condition: while x < 5: x -= 1 ← infinite loop if x starts at 10
• Debugging tips:
  1. Use print() to check variable values mid-execution
  2. Test with different inputs
  3. Read conditions slowly
  4. Break big problems into small steps
  Example: print("Current value of x:", x)

══════════════════════════════════════════════════════
WEEK 3: FUNCTIONS AND DATA HANDLING
══════════════════════════════════════════════════════

LESSON 1 — What is a Function?
• Function = block of REUSABLE code that performs a specific task
• Why: organizes code, reduces repetition, easier debugging, modular programs
• Syntax:
  def function_name():
      print("Hello Python")
• Call it: function_name()   ← runs only when called
• def keyword, function_name, () for parameters, : colon, indented body

LESSON 2 — Parameters and Return Values
• Parameters allow functions to work with different data
  def greet(name):
      print("Hello", name)
  greet("Ali")   ← "Ali" is the argument
• Multiple parameters: def add(a, b): print(a + b)
• return sends result BACK from a function
  def multiply(a, b):
      return a * b
  result = multiply(4, 3)  → result is 12
• print vs return: print shows on screen but cannot be stored; return gives value back to caller

LESSON 3 — Lists and Tuples
• LIST: ordered, MUTABLE (changeable), allows duplicates. uses []
  numbers = [10, 20, 30]
  numbers[0] → 10 (indexing starts at 0)
  numbers[-1] → 30 (last item)
  numbers[1] = 50  ← modify
  numbers.append(40)  ← add to end
  for num in numbers: print(num)  ← loop
• TUPLE: like list but IMMUTABLE (cannot be changed). uses ()
  data = (1, 2, 3)
  data[0] → 1  ← can still read
  data[0] = 99  ← ERROR! cannot modify
• Use tuples when data must remain constant (coordinates, days of week, etc.)

LESSON 4 — Dictionaries
• Dictionary: stores KEY-VALUE pairs (like a real dictionary: word → definition)
• Creating:
  student = {"name": "Sara", "age": 21, "course": "Python"}
• Access: student["name"] → "Sara"
• Update: student["age"] = 22
• Add new key: student["city"] = "Mumbai"
• Loop: for key, value in student.items(): print(key, value)
• Why powerful: fast lookup, used in APIs/JSON, stores real-world structured data

LESSON 5 — String Processing
• text = "Hello Python"
• Indexing: text[0] → "H", text[-1] → "n"
• Methods:
  - text.upper() → "HELLO PYTHON"
  - text.lower() → "hello python"
  - len(text) → 12
  - text.replace("Python", "World") → "Hello World"
  - sentence.split(" ") → ['I', 'love', 'coding']   split into list
  - "-".join(['I', 'love', 'coding']) → "I-love-coding"
• Concatenation: "Hello " + name
• f-Strings (MODERN, PREFERRED): f"My name is {name} and I am {age} years old"
  → inserts variable values directly into string

══════════════════════════════════════════════════════
WEEK 4: REAL-WORLD CLI DEVELOPMENT
══════════════════════════════════════════════════════

LESSON 1 — File Handling
• File handling = storing and retrieving data PERMANENTLY from files (.txt, .csv, .json)
• Without files: data disappears when program closes
• Opening: file = open("data.txt", "r")
• File modes: "r"=read, "w"=write(overwrites!), "a"=append, "x"=create new
• Reading entire file: content = file.read()
• Reading line by line: for line in file: print(line)
• Writing: file = open("data.txt", "w"); file.write("Hello Python"); file.close()
• Appending: file = open("data.txt", "a"); file.write("\nNew Line")
• BEST PRACTICE: use "with" statement — auto-closes file:
  with open("data.txt", "r") as file:
      print(file.read())
• Real uses: saving user data, logs, AI prompts, reports

LESSON 2 — Error Handling with try/except
• Errors (exceptions) happen during execution: ZeroDivisionError, FileNotFoundError, ValueError
• WITHOUT handling → program CRASHES
• Basic syntax:
  try:
      x = 10 / 0
  except:
      print("An error occurred")
• Specific errors: except ValueError: (when int("abc") fails)
• Multiple exceptions:
  except FileNotFoundError: print("File not found")
  except PermissionError: print("No permission")
• else: runs if NO error occurred
• finally: ALWAYS runs (cleanup code like closing connections)
• Why essential: prevents crashes, improves UX, required in all real apps

LESSON 3 — Modular Program Structure
• Modular programming: divide program into small modules (SEPARATE files)
• Benefits: easy maintenance, code reuse, cleaner structure, team collaboration
• Create module (math_utils.py): def add(a, b): return a + b
• Use it: import math_utils; print(math_utils.add(5, 3))
• Import methods:
  - import math_utils (import whole module)
  - from math_utils import add (import specific function)
  - import math_utils as mu (alias)

LESSON 4 — Introduction to Automation
• Automation = using Python to perform REPETITIVE tasks automatically
• Examples: rename files, send emails, scrape websites, process data, generate reports
• os module (built-in): os.listdir() → list files; os.makedirs() → create folders
• Key automation libraries: os (file system), shutil (file operations), 
  requests (API calls), selenium (browser), pandas (data processing)
• Power of automation: tasks taking 10 minutes manually done in 1 second

=== END OF SYLLABUS ===
`;

/**
 * @route   POST /api/ai/chat
 * @desc    Conversational AI Tutor endpoint — trained on Python Basics syllabus
 *          Answers any student question about the course with Socratic teaching
 * @access  Public (Optional Bearer Token)
 */
router.post('/chat', async (req, res) => {
    const { message, conversationHistory = [], lessonTitle, moduleTitle, weekTitle, courseTitle, code } = req.body;

    if (!message || message.trim().length === 0) {
        return res.status(400).json({ success: false, message: "Message is required." });
    }

    // Build conversation context from history (last 8 messages max for token efficiency)
    const recentHistory = conversationHistory.slice(-8);
    const historyText = recentHistory.map(m =>
        `${m.role === 'user' ? 'STUDENT' : 'TUTOR'}: ${m.content}`
    ).join('\n');

    // Build context about where the student is
    const contextParts = [];
    if (courseTitle) contextParts.push(`Course: ${courseTitle}`);
    if (weekTitle) contextParts.push(`Week: ${weekTitle}`);
    if (moduleTitle) contextParts.push(`Module: ${moduleTitle}`);
    if (lessonTitle) contextParts.push(`Lesson: ${lessonTitle}`);
    const contextString = contextParts.length > 0
        ? `\nSTUDENT'S CURRENT LOCATION IN COURSE:\n${contextParts.join(' | ')}`
        : '';

    // Include student's code if they have any
    const codeContext = code && code.trim() && code.trim() !== '// No code provided'
        ? `\nSTUDENT'S CURRENT CODE:\n\`\`\`python\n${code.trim()}\n\`\`\``
        : '';

    const prompt = `
You are the SkillBridge AI Tutor — a warm, encouraging, and expert Python teacher.
You are helping a BEGINNER student learn Python through the SkillBridge Python Basics course.

${PYTHON_BASICS_SYLLABUS}

${contextString}
${codeContext}

CONVERSATION HISTORY (most recent):
${historyText || '(New conversation)'}

STUDENT'S QUESTION: ${message}

YOUR TEACHING RULES:
1. ONLY teach content from the syllabus above. If a student asks something beyond the course scope, politely note it's advanced and briefly explain, then bring focus back to the current course.
2. Use the SOCRATIC METHOD: ask guiding questions to help students discover answers themselves. Don't just give the answer directly (especially for code challenges).
3. For debugging help: ask "What do you think line X is doing?" before correcting.
4. Be WARM and ENCOURAGING — beginner students need confidence. Use phrases like "Great question!", "You're on the right track!", "Let's think about this together."
5. Use simple language. Avoid jargon. When introducing a technical term, always explain it immediately.
6. Keep answers CONCISE but complete — 2-4 short paragraphs max. Use bullet points for lists.
7. For code questions: show small, focused examples. Always explain WHAT each line does.
8. If student seems confused about a concept, relate it to real life (like the examples in the syllabus).
9. Always end your response with either: (a) a follow-up clarifying question, (b) encouragement to try it themselves, or (c) a pointer to what they should try next.
10. NEVER mock or discourage a student's question, no matter how basic.

RESPONSE FORMAT:
- Reply in plain text (no markdown headers, but you can use bullet points with •)
- Keep it conversational, like a friendly tutor talking directly to the student
- Maximum 300 words unless the question genuinely requires more detail

Now respond to the student's question naturally and helpfully:`;

    try {
        // Use text response (not JSON) for conversational chat
        let lastError = null;
        let reply = null;

        for (const modelName of MODELS) {
            try {
                console.log(`[AI Chat] Attempting with model: ${modelName}`);

                const model = genAI.getGenerativeModel({ model: modelName });

                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("AI_TIMEOUT")), AI_TIMEOUT_MS)
                );

                const result = await Promise.race([
                    model.generateContent(prompt),
                    timeoutPromise
                ]);

                reply = result.response.text();
                break; // Success — stop trying models

            } catch (err) {
                lastError = err;
                const errorMsg = (err.message || "").toLowerCase();
                const status = err.status || 0;
                console.warn(`[AI Chat] Model ${modelName} failed: ${errorMsg}`);

                if (status === 429 || errorMsg.includes("quota") || errorMsg.includes("429")) continue;
                if (status === 404 || status === 503 || errorMsg.includes("not found")) continue;
                if (errorMsg.includes("timeout")) continue;
                if (status === 400) break;
            }
        }

        if (reply) {
            return res.json({ success: true, reply: reply.trim() });
        }

        // All models failed
        const isQuota = lastError?.status === 429 || lastError?.message?.includes("quota");
        if (isQuota) {
            return res.json({
                success: true,
                reply: "I'm helping many students right now and need a short break! ⏳ Please try your question again in about 30 seconds."
            });
        }

        return res.status(503).json({
            success: false,
            message: "AI Tutor is temporarily unavailable. Please try again in a moment."
        });

    } catch (criticalErr) {
        console.error("[AI Chat Critical Failure]:", criticalErr);
        res.status(500).json({ success: false, message: "Internal AI system error." });
    }
});

// ─────────────────────────────────────────────────────────────────
//  AI CAREER ROADMAP GENERATOR
// ─────────────────────────────────────────────────────────────────

const CareerRoadmap = require('../models/CareerRoadmap');

/**
 * @route   POST /api/ai/roadmap/generate
 * @desc    Generate a personalized career roadmap using AI
 * @access  Private
 */
router.post('/roadmap/generate', protect, async (req, res) => {
    const { career, level, skills, hours, budget, goal } = req.body;

    if (!career || !level || !hours || !budget || !goal) {
        return res.status(400).json({
            success: false,
            message: 'All profile fields are required: career, level, skills, hours, budget, goal'
        });
    }

    const prompt = `
You are an AI Career Roadmap Generator for SkillBridge, an EdTech platform for engineering students.

Generate a fully personalized 2nd Year Engineering Roadmap based on this student's profile:

Student Profile:
- Career Interest: ${career}
- Current Level: ${level}
- Existing Skills: ${(skills || []).join(', ') || 'None specified'}
- Weekly Time Available: ${hours}
- Certification Budget: ${budget}
- Final Goal: ${goal}

IMPORTANT RULES:
- Tailor everything strictly based on student profile.
- If student is beginner → focus on fundamentals.
- If intermediate → focus on projects + internships.
- If advanced → focus on specialization + strong portfolio.
- If budget is low or Free → suggest free certifications only.
- If goal is placement → focus on DSA + internships.
- If goal is startup → focus on product building + networking.
- If student is confused → suggest career exploration roadmap.
- Keep it practical and execution-focused.
- Give clear action steps with timelines.

Generate a structured JSON response with this EXACT schema:

{
  "title": "string - Roadmap title",
  "summary": "string - 2-3 sentence executive summary",
  "semester3": {
    "title": "Semester 3 Plan",
    "months": [
      { "month": "Month 1", "focus": "string", "tasks": ["string array of action items"] },
      { "month": "Month 2", "focus": "string", "tasks": ["string array"] },
      { "month": "Month 3", "focus": "string", "tasks": ["string array"] }
    ]
  },
  "semester4": {
    "title": "Semester 4 Plan",
    "months": [
      { "month": "Month 4", "focus": "string", "tasks": ["string array"] },
      { "month": "Month 5", "focus": "string", "tasks": ["string array"] },
      { "month": "Month 6", "focus": "string", "tasks": ["string array"] }
    ]
  },
  "skills": [
    { "name": "string", "priority": "High|Medium|Low", "timeToLearn": "string e.g. 2 weeks" }
  ],
  "certifications": [
    { "name": "string", "provider": "string", "cost": "Free|Paid", "url": "string", "priority": "High|Medium" }
  ],
  "projects": [
    { "title": "string", "description": "string", "techStack": ["string"], "difficulty": "Beginner|Intermediate|Advanced", "estimatedTime": "string" }
  ],
  "platforms": [
    { "name": "string", "purpose": "string", "url": "string" }
  ],
  "achievements": [
    { "target": "string", "deadline": "string", "category": "Technical|Soft Skills|Portfolio|Community" }
  ],
  "internshipStrategy": {
    "timeline": "string - when to start applying",
    "targetCompanies": ["string"],
    "preparationSteps": ["string"],
    "tips": ["string"]
  },
  "portfolioStrategy": {
    "linkedinTips": ["string"],
    "githubTips": ["string"],
    "portfolioWebsiteTips": ["string"]
  },
  "weeklyPlan": {
    "totalHours": "${hours}",
    "breakdown": [
      { "day": "string", "hours": "number", "focus": "string" }
    ]
  },
  "techStack": ["string - recommended tools and technologies"],
  "kpis": [
    { "metric": "string", "target": "string", "timeframe": "string" }
  ],
  "networkingStrategy": ["string - specific networking action items"],
  "differentiator": "string - 1 unique thing to stand out from peers",
  "mistakesToAvoid": ["string - common mistakes for this career path"]
}

Return ONLY valid JSON. No markdown, no code blocks, no extra text.`;

    try {
        let lastError = null;
        let roadmapData = null;

        for (const modelName of MODELS) {
            try {
                console.log(`[Roadmap AI] Attempting with model: ${modelName}`);
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    generationConfig: { responseMimeType: "application/json" }
                });

                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("AI_TIMEOUT")), 30000) // 30s for roadmaps
                );

                const result = await Promise.race([
                    model.generateContent(prompt),
                    timeoutPromise
                ]);

                const responseText = result.response.text();
                try {
                    roadmapData = JSON.parse(responseText);
                } catch (e) {
                    const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
                    roadmapData = JSON.parse(cleanJson);
                }
                break;

            } catch (err) {
                lastError = err;
                const errorMsg = (err.message || "").toLowerCase();
                const status = err.status || 0;
                console.warn(`[Roadmap AI] Model ${modelName} failed: ${errorMsg}`);
                if (status === 429 || errorMsg.includes("quota") || errorMsg.includes("429")) continue;
                if (status === 404 || status === 503 || errorMsg.includes("not found")) continue;
                if (errorMsg.includes("timeout")) continue;
                if (status === 400) break;
            }
        }

        if (!roadmapData) {
            const isQuota = lastError?.status === 429 || lastError?.message?.includes("quota");
            return res.status(503).json({
                success: false,
                message: isQuota
                    ? 'AI is processing many requests. Please retry in 30 seconds.'
                    : 'AI Roadmap Generator is temporarily unavailable. Please try again.'
            });
        }

        // Save to database
        const saved = await CareerRoadmap.findOneAndUpdate(
            { userId: req.user.id },
            {
                userId: req.user.id,
                profile: { career, level, skills: skills || [], hours, budget, goal },
                roadmap: roadmapData,
                generatedAt: new Date(),
                $inc: { version: 1 }
            },
            { upsert: true, new: true }
        );

        return res.json({
            success: true,
            roadmap: saved.roadmap,
            profile: saved.profile,
            generatedAt: saved.generatedAt
        });

    } catch (criticalErr) {
        console.error("[Roadmap AI Critical Failure]:", criticalErr);
        return res.status(500).json({ success: false, message: "Internal error generating roadmap." });
    }
});

/**
 * @route   GET /api/ai/roadmap
 * @desc    Get the user's saved roadmap (if any)
 * @access  Private
 */
router.get('/roadmap', protect, async (req, res) => {
    try {
        const roadmap = await CareerRoadmap.findOne({ userId: req.user.id })
            .sort({ createdAt: -1 });

        if (!roadmap) {
            return res.json({ success: true, exists: false });
        }

        return res.json({
            success: true,
            exists: true,
            roadmap: roadmap.roadmap,
            profile: roadmap.profile,
            generatedAt: roadmap.generatedAt
        });
    } catch (err) {
        console.error("[Roadmap Fetch Error]:", err);
        return res.status(500).json({ success: false, message: "Failed to fetch roadmap." });
    }
});

module.exports = router;

