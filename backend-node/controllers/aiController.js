const { GoogleGenerativeAI } = require("@google/generative-ai");

const CareerRoadmap = require('../models/CareerRoadmap');
const asyncHandler = require('../utils/asyncHandler');

// Lyzr Config
const axios = require('axios');
const LYZR_API_KEY = process.env.LYZR_API_KEY;
const LYZR_AGENT_ID = process.env.LYZR_AGENT_ID;
const LYZR_API_URL = process.env.LYZR_ENDPOINT || 'https://agent-prod.lyzr.ai/v1/inference';
const LYZR_TIMEOUT_MS = 20000;


const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const AI_TIMEOUT_MS = 10000;
const MODELS = [
    "gemini-2.0-flash-lite",
    "gemini-flash-latest",
    "gemini-1.5-flash"
];

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function callLyzrAgent(message, sessionId = 'default-session', userId = 'skillbridge-user') {
    if (!LYZR_API_KEY || !LYZR_AGENT_ID) {
        return { success: false, error: 'Lyzr AI is not configured' };
    }

    try {
        const response = await axios.post(LYZR_API_URL, {
            agent_id: LYZR_AGENT_ID,
            user_id: userId,
            session_id: sessionId,
            message: message,
            query: message // Compatibility
        }, {
            headers: {
                'x-api-key': LYZR_API_KEY,
                'Authorization': `Bearer ${LYZR_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 55000 // 55s for AI
        });

        const data = response.data;
        // Lyzr responses can be in data.response, data.message, data.output, etc.
        const reply = data?.response || data?.message || data?.output || 
                      (data?.data && (data.data.response || data.data.message || data.data.output)) ||
                      null;
        
        if (reply) {
            return { success: true, replyContent: String(reply) };
        }
        
        if (typeof data === 'string') return { success: true, replyContent: data };
        
        return { success: false, error: 'Empty response from Lyzr' };
    } catch (err) {
        console.error('Lyzr API Error:', err.response?.data || err.message);
        return { success: false, error: err.response?.data?.message || err.message };
    }
}

async function generateAIResponse(prompt, isRoadmap = false) {
    let lastError = null;
    const timeout = isRoadmap ? 30000 : AI_TIMEOUT_MS;
    for (const modelName of MODELS) {
        try {
            const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: { responseMimeType: "application/json" }
            });
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("AI_TIMEOUT")), timeout));
            const result = await Promise.race([model.generateContent(prompt), timeoutPromise]);
            const responseText = result.response.text();
            try {
                return { success: true, data: JSON.parse(responseText) };
            } catch (e) {
                const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
                return { success: true, data: JSON.parse(cleanJson) };
            }
        } catch (err) {
            lastError = err;
            if (err.status === 429) continue;
            if (err.status === 400) break;
        }
    }
    return { success: false, isQuotaExceeded: lastError?.status === 429, error: lastError?.message };
}

// Controller Methods
exports.getTutorResponse = asyncHandler(async (req, res) => {
    const { message, question, sessionId } = req.body;
    const input = message || question;
    
    if (!input) {
        return res.status(400).json({ success: false, message: 'Message or question required' });
    }
    
    const effectiveSessionId = sessionId || `session-${req.user?._id || 'anon'}`;
    const userId = req.user?._id?.toString() || 'skillbridge-user';
    
    let result = await callLyzrAgent(input, effectiveSessionId, userId);
    
    // Fallback to Gemini
    if (!result.success && GEMINI_API_KEY) {
        console.log('Lyzr failed, falling back to Gemini for response...');
        result = await generateAIChatResponse(input);
    }
    
    if (result.success) {
        return res.json({ success: true, reply: result.reply || result.replyContent });
    }
    
    res.status(503).json({ 
        success: false, 
        message: 'AI Tutor is thinking hard. Try again in a moment!',
        error: process.env.NODE_ENV === 'development' ? result.error : undefined
    });
});

exports.getTutorConfig = (req, res) => {
    res.json({
        success: true,
        available: !!LYZR_API_KEY && !!LYZR_AGENT_ID,
        endpoint: LYZR_API_URL
    });
};

async function generateAIChatResponse(message, history = []) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
        const chat = model.startChat({
            history: history.map(h => ({
                role: h.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: h.content }]
            })),
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        return { success: true, reply: response.text() };
    } catch (err) {
        console.error('Gemini Chat Error:', err);
        return { success: false, error: err.message };
    }
}

exports.getTutorChat = asyncHandler(async (req, res) => {
    const { message, conversationHistory = [], courseTitle, sessionId } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message required' });
    
    const enrichedMessage = courseTitle ? `[Course: ${courseTitle}] ${message}` : message;
    const effectiveSessionId = sessionId || `chat-${req.user?._id || 'anon'}`;
    const userId = req.user?._id?.toString() || 'skillbridge-user';

    // Try Lyzr first
    let result = await callLyzrAgent(enrichedMessage, effectiveSessionId, userId);
    
    // If Lyzr fails and we have Gemini, fallback to Gemini
    if (!result.success && GEMINI_API_KEY) {
        console.log('Lyzr failed, falling back to Gemini for chat...');
        result = await generateAIChatResponse(enrichedMessage, conversationHistory);
    }
    
    if (result.success) {
        return res.json({ success: true, reply: result.reply || result.replyContent });
    }
    
    res.status(503).json({ 
        success: false, 
        message: 'AI Tutor is temporarily offline for maintenance.' 
    });
});

exports.streamTutorChat = asyncHandler(async (req, res) => {
    const { message, conversationHistory = [], user } = req.body;
    
    if (!message) {
        return res.status(400).json({ success: false, message: 'Message required' });
    }

    if (!GEMINI_API_KEY) {
        return res.status(500).json({ success: false, message: 'Gemini API key not configured' });
    }

    const systemPrompt = `You are SkillPath AI Tutor, a premium learning assistant.
User Context:
- Goal: ${user?.goal || 'General Learning'}
- Level: ${user?.level || 'Beginner'}
- Interest: ${user?.intent || 'Professional Growth'}

Guidelines:
1. Provide actionable roadpoints and clear next steps.
2. Recommend specific topics or skills to master.
3. Keep tokens under 500 characters unless detailing a roadmap.
4. Maintain a supportive, expert, and encouraging tone.
5. Use markdown for structure (bold, bullet points).`;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: systemPrompt
        });

        const chat = model.startChat({
            history: conversationHistory.map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }]
            })),
            generationConfig: {
                maxOutputTokens: 1024,
            },
        });

        const result = await chat.sendMessageStream(message);

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
                res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
            }
        }
        
        res.write('data: [DONE]\n\n');
        res.end();
    } catch (error) {
        console.error('Gemini Streaming Error:', error);
        res.write(`data: ${JSON.stringify({ error: 'Failed to generate response' })}\n\n`);
        res.end();
    }
});

exports.debugCode = asyncHandler(async (req, res) => {
    const { code, language, lessonTitle } = req.body;
    if (!code || !language) return res.status(400).json({ success: false, message: 'Code and language required' });
    const prompt = `Debug ${language} for ${lessonTitle}. Code: ${code}. Provide Socratic feedback in JSON format.`;
    const result = await generateAIResponse(prompt);
    if (result.success) return res.json({ success: true, data: result.data });
    res.status(503).json({ success: false, message: result.isQuotaExceeded ? 'Busy, retry in 30s' : 'AI error' });
});

exports.generateRoadmap = asyncHandler(async (req, res) => {
    const { career, level, skills, hours, budget, goal } = req.body;
    const prompt = `Generate a highly detailed, personalized 6-month engineering career roadmap for a ${level} level student interested in becoming a ${career}.
    User Profile:
    - Current level: ${level}
    - Existing skills: ${Array.isArray(skills) ? skills.join(', ') : skills}
    - Weekly availability: ${hours}
    - Budget for learning: ${budget}
    - Long-term goal: ${goal}

    Return the final roadmap as a strictly valid JSON object with the following structure:
    {
      "title": "A catchy title for the roadmap",
      "summary": "A concise summary of the strategy",
      "kpis": [{"target": "Target objective", "metric": "How to measure", "timeframe": "When to achieve"}],
      "techStack": ["Technology name"],
      "differentiator": "A unique selling point/strategy for this student to stand out",
      "mistakesToAvoid": ["Mistake description"],
      "networkingStrategy": ["Actionable networking tip"],
      "semester3": {
        "title": "Skill Building Phase",
        "months": [{"month": "Month 1", "focus": "Primary topic", "tasks": ["Specific task to complete"]}]
      },
      "semester4": {
        "title": "Application & Projects Phase",
        "months": [{"month": "Month 4", "focus": "Primary topic", "tasks": ["Specific task to complete"]}]
      },
      "skills": [{"name": "Skill name", "priority": "High/Medium/Low", "timeToLearn": "Estimated time"}],
      "certifications": [{"name": "Cert name", "provider": "Provider name", "cost": "Estimated cost or Free", "url": "Official URL"}],
      "projects": [{"title": "Project name", "difficulty": "Beginner/Intermediate/Advanced", "description": "Short project brief", "techStack": ["Tech"], "estimatedTime": "Days/Weeks"}],
      "platforms": [{"name": "Platform name", "purpose": "Why use it", "url": "URL"}],
      "internshipStrategy": {
        "timeline": "When to apply",
        "preparationSteps": ["Prep step"],
        "targetCompanies": ["Company names"]
      },
      "portfolioStrategy": {
        "githubTips": ["Specific GitHub repo tip"],
        "linkedinTips": ["Specific profile optimization tip"]
      },
      "achievements": [{"target": "Milestone", "category": "Type", "deadline": "By which month"}],
      "weeklyPlan": {
        "totalHours": "${hours}",
        "breakdown": [{"day": "Monday", "hours": 2, "focus": "Specific study area"}]
      }
    }
    Ensure the content is professional, actionable, and specific to the ${career} field. Generate 3 to 4 months for each semester phase.`;
    const result = await generateAIResponse(prompt, true);
    if (result.success) {
        const saved = await CareerRoadmap.findOneAndUpdate(
            { userId: req.user.id },
            { userId: req.user.id, profile: req.body, roadmap: result.data, generatedAt: new Date() },
            { upsert: true, new: true }
        );
        return res.json({ success: true, roadmap: saved.roadmap, profile: saved.profile });
    }
    res.status(503).json({ success: false, message: 'Roadmap generation failed' });
});

exports.getRoadmap = asyncHandler(async (req, res) => {
    const roadmap = await CareerRoadmap.findOne({ userId: req.user.id });
    if (!roadmap) return res.json({ success: true, exists: false });
    res.json({ success: true, exists: true, roadmap: roadmap.roadmap, profile: roadmap.profile });
});
