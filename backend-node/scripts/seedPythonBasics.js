const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');
const User = require('./models/User');

dotenv.config({ path: './.env' });

const seedPythonBasics = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB.');

        // Find instructor
        let instructor = await User.findOne({ role: 'admin' });
        if (!instructor) instructor = await User.findOne({});
        if (!instructor) {
            console.error('No user found to assign as instructor. Please register a user first.');
            process.exit(1);
        }
        console.log(`Using instructor: ${instructor.name || instructor.email} (${instructor._id})`);

        // ── DELETE ALL EXISTING COURSES ──────────────────────────────────────
        console.log('Deleting ALL existing courses...');
        await Course.deleteMany({});
        console.log('All courses cleared.');

        // ── COURSE DATA ───────────────────────────────────────────────────────
        const courseData = {
            title: "SkillBridge Python Basics",
            subtitle: "From Zero to Real-World Command-Line Applications",
            description: "SkillBridge Python for Beginners is a guided learning pathway aligned with modern NEP-based skill education. The goal is to help students transition from zero programming knowledge to building real-world command-line applications.",
            fullDescription: "Students learn best by doing. Instead of passive reading, this course encourages experimentation, debugging, and logical reasoning. The AI Tutor assists learners by giving hints, identifying mistakes, and promoting independent thinking without revealing full solutions. This master content document is structured for direct website insertion, lesson page creation, and AI Tutor integration.",
            category: "Programming",
            level: "Beginner",
            price: 1999,
            originalPrice: 4999,
            instructor: instructor._id,
            image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200",
            features: ["AI Tutor Assistance", "Hands-On Practice", "NEP-Aligned Curriculum", "Certificate of Completion"],
            tags: ["Python", "Beginner", "Programming", "CLI", "Automation"],
            isPublished: true,
            isFeatured: true,

            assessmentModel: {
                codingWeightage: "60%",
                mcqWeightage: "40%"
            },

            aiTutorSystem: {
                logicMirroringExamples: [
                    "Ask: 'How would you calculate the largest number on paper?' before giving code.",
                    "If a loop fails: 'Is the condition ever becoming False?'",
                    "For functions: 'What input does this task need, and what should it give back?'",
                    "For errors: 'Read the error message line by line — what does Python NOT understand?'"
                ],
                indentationAlertBehavior: "Highlight red line if colon is found without subsequent indentation.",
                syntaxHintRules: [
                    "Detect str + int mixing and suggest int() or str()",
                    "Check for missing colons in def/if/for/while",
                    "Detect = vs == in conditions",
                    "Warn about infinite loop patterns"
                ]
            },

            weeks: [
                // ══════════════════════════════════════════════════════════════
                // WEEK 1 — Python Foundations
                // ══════════════════════════════════════════════════════════════
                {
                    weekNumber: 1,
                    title: "Week 1: Python Foundations",
                    order: 1,
                    description: "Go from zero to writing your first Python programs. Master syntax, variables, data types, and input/output.",
                    modules: [
                        {
                            title: "Introduction to Programming & Algorithms",
                            order: 1,
                            lessons: [
                                {
                                    title: "What is Programming?",
                                    type: "reading",
                                    order: 1,
                                    duration: "10:00",
                                    content: `# What is Programming?

Programming means giving instructions to a computer so it can perform tasks automatically. These instructions are written in a language like Python, Java, or C++.

A program is simply:

> **Input → Processing → Output**

### Example
| Step | Description |
|------|-------------|
| Input | Numbers from user |
| Processing | Add numbers |
| Output | Result displayed |

## What is an Algorithm?

An algorithm is a step-by-step method to solve a problem **logically** before writing code.

**Example — Algorithm to find the largest number:**
1. Take two numbers from the user.
2. Compare them.
3. Print the larger number.

Algorithms help in:
- ✅ Problem solving
- ✅ Writing efficient code
- ✅ Avoiding confusion while coding

## Why Python for Beginners?

- 🟢 **Simple syntax** — reads almost like English
- 🟢 **Less code** compared to Java or C++
- 🟢 **Versatile** — used in AI, Web, Data Science, Automation`,
                                    expectedSkills: ["Understand what programming is", "Define an algorithm", "List reasons Python is beginner-friendly"]
                                }
                            ]
                        },
                        {
                            title: "Python Syntax, Variables & Data Types",
                            order: 2,
                            lessons: [
                                {
                                    title: "Python Syntax and Indentation",
                                    type: "reading",
                                    order: 1,
                                    duration: "15:00",
                                    content: `# Python Syntax and Indentation

## What is Syntax?

Syntax means the **rules of writing code**. Python syntax is clean and readable:

\`\`\`python
print("Hello World")
\`\`\`

Unlike some languages, Python does **NOT** require semicolons or brackets at the end of lines.

## What is Indentation?

Indentation means **spaces at the beginning of a line**. Python uses indentation to define code blocks.

### ✅ Correct:
\`\`\`python
if 5 > 2:
    print("Correct")
\`\`\`

### ❌ Wrong (IndentationError):
\`\`\`python
if 5 > 2:
print("Correct")
\`\`\`

## Why Does Python Use Indentation?
- Improves **readability**
- Enforces a **clean coding style**
- Makes code blocks **visually obvious**`,
                                    expectedSkills: ["Write valid Python syntax", "Apply correct indentation", "Avoid IndentationError"]
                                },
                                {
                                    title: "Variables and Data Types",
                                    type: "reading",
                                    order: 2,
                                    duration: "20:00",
                                    content: `# Variables and Data Types

## What is a Variable?

A variable is a **container used to store data**.

\`\`\`python
name = "Musif"
age = 21
\`\`\`

Python automatically detects the type — no need to declare it!

## Common Data Types in Python

| Type | Name | Example |
|------|------|---------|
| \`int\` | Integer (whole numbers) | \`x = 10\` |
| \`float\` | Float (decimal numbers) | \`price = 99.5\` |
| \`str\` | String (text data) | \`city = "Mumbai"\` |
| \`bool\` | Boolean (True/False) | \`is_active = True\` |

## Checking Data Type

\`\`\`python
x = 10
print(type(x))
\`\`\`

**Output:**
\`\`\`
<class 'int'>
\`\`\``,
                                    threeJsBlock: {
                                        conceptName: "Data Type Shapes",
                                        visualDescription: "Different 3D shapes represent types: Sphere = int, Cube = string, Pyramid = bool, Diamond = float.",
                                        pythonConcept: "Visualizing data types",
                                        interactionType: "Student clicks a type → shape highlights and label appears."
                                    },
                                    expectedSkills: ["Create variables", "Identify Python data types", "Use type() to inspect values"]
                                },
                                {
                                    title: "Interactive Logic Visualizer — Data Types",
                                    type: "visualizer",
                                    order: 3,
                                    duration: "10:00",
                                    content: "Interact with the 3D data type visualizer. Assign different values to variables and watch how Python categorizes them in memory."
                                }
                            ]
                        },
                        {
                            title: "Input, Output & Operators",
                            order: 3,
                            lessons: [
                                {
                                    title: "Input and Output Operations",
                                    type: "reading",
                                    order: 1,
                                    duration: "15:00",
                                    content: `# Input and Output Operations

## Output in Python

Use the \`print()\` function to display information:

\`\`\`python
print("Welcome to Python")
\`\`\`

You can also print variables:

\`\`\`python
name = "Ali"
print(name)
\`\`\`

## Input from User

Use the \`input()\` function to receive data:

\`\`\`python
name = input("Enter your name: ")
print(name)
\`\`\`

> ⚠️ By default, \`input()\` stores everything as a **string**.

## Converting Input Types

If you want numbers, convert explicitly:

\`\`\`python
age = int(input("Enter age: "))
\`\`\`

## Combining Input and Output

\`\`\`python
a = int(input("Enter first number: "))
b = int(input("Enter second number: "))
print("Sum =", a + b)
\`\`\``,
                                    debuggingBlock: {
                                        wrongCode: `name = input("Enter your name: ")
print("Hello " + name + " you are " + 18 + " years old")`,
                                        correctedCode: `name = input("Enter your name: ")
age = 18
print("Hello " + name + " you are " + str(age) + " years old")`,
                                        explanation: "You cannot concatenate a string and an integer directly. Use str() to convert the integer, or use an f-string."
                                    },
                                    expectedSkills: ["Use print() for output", "Use input() to collect user data", "Convert input types correctly"]
                                },
                                {
                                    title: "Operators and Expressions",
                                    type: "reading",
                                    order: 2,
                                    duration: "20:00",
                                    content: `# Operators and Expressions

Operators perform operations on values.

## Arithmetic Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| \`+\` | Addition | \`5 + 2 = 7\` |
| \`-\` | Subtraction | \`5 - 2 = 3\` |
| \`*\` | Multiplication | \`5 * 2 = 10\` |
| \`/\` | Division | \`5 / 2 = 2.5\` |
| \`//\` | Floor Division | \`5 // 2 = 2\` |
| \`%\` | Modulus (remainder) | \`5 % 2 = 1\` |
| \`**\` | Exponent | \`5 ** 2 = 25\` |

\`\`\`python
x = 5
y = 2
print(x + y)   # 7
print(x ** y)  # 25
\`\`\`

## Comparison Operators

Used to compare values — always return \`True\` or \`False\`:

\`\`\`python
print(5 > 3)   # True
print(5 == 5)  # True
print(5 != 3)  # True
\`\`\`

| Operator | Meaning |
|----------|---------|
| \`==\` | Equal to |
| \`!=\` | Not equal to |
| \`>\` | Greater than |
| \`<\` | Less than |
| \`>=\` | Greater than or equal |
| \`<=\` | Less than or equal |

## Logical Operators

Used with conditions:

\`\`\`python
a = True
b = False

print(a and b)  # False
print(a or b)   # True
print(not a)    # False
\`\`\`

## What is an Expression?

An expression is a combination of variables, operators, and values:

\`\`\`python
result = (a + b) * 2
\`\`\``,
                                    expectedSkills: ["Use all arithmetic operators", "Use comparison operators", "Use logical operators"]
                                },
                                {
                                    title: "Week 1 Knowledge Check",
                                    type: "quiz",
                                    order: 3,
                                    duration: "10:00",
                                    content: "Test your understanding of Python Foundations.",
                                    quizQuestions: [
                                        {
                                            question: "Which function is used to display output in Python?",
                                            options: ["input()", "print()", "show()", "echo()"],
                                            correctAnswer: 1
                                        },
                                        {
                                            question: "What does input() return by default?",
                                            options: ["int", "float", "string", "bool"],
                                            correctAnswer: 2
                                        },
                                        {
                                            question: "Which of these is a valid variable assignment?",
                                            options: ["21 = age", "age == 21", "age = 21", "var age = 21"],
                                            correctAnswer: 2
                                        },
                                        {
                                            question: "What is 5 % 2?",
                                            options: ["2", "1", "2.5", "0"],
                                            correctAnswer: 1
                                        },
                                        {
                                            question: "What does Python use to define code blocks?",
                                            options: ["Curly braces {}", "Semicolons ;", "Indentation (spaces)", "Parentheses ()"],
                                            correctAnswer: 2
                                        },
                                        {
                                            question: "Which data type stores True or False?",
                                            options: ["str", "int", "float", "bool"],
                                            correctAnswer: 3
                                        },
                                        {
                                            question: "How do you check the data type of a variable x?",
                                            options: ["datatype(x)", "typeof(x)", "type(x)", "check(x)"],
                                            correctAnswer: 2
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    miniChallenge: "Write a program that asks the user for their name and age, then prints: 'Hello <name>, you are <age> years old and in <age - 2026 + 2026> birth year.'",
                    expectedSkills: [
                        "Understand what programming and algorithms are",
                        "Write basic Python scripts with correct syntax",
                        "Create and use variables",
                        "Use all data types correctly",
                        "Take input and display output",
                        "Apply arithmetic, comparison, and logical operators"
                    ]
                },

                // ══════════════════════════════════════════════════════════════
                // WEEK 2 — Logic Building and Flow Control
                // ══════════════════════════════════════════════════════════════
                {
                    weekNumber: 2,
                    title: "Week 2: Logic Building and Flow Control",
                    order: 2,
                    description: "Learn to make decisions and repeat actions — the core skills of every programmer.",
                    modules: [
                        {
                            title: "Conditional Statements",
                            order: 1,
                            lessons: [
                                {
                                    title: "if, elif, else — Making Decisions",
                                    type: "reading",
                                    order: 1,
                                    duration: "20:00",
                                    content: `# Conditional Statements (if, elif, else)

Conditional statements allow a program to make **decisions** based on conditions.

In real life:
> If it rains → take umbrella  
> Else → go normally

## Basic \`if\` Statement

\`\`\`python
age = 18

if age >= 18:
    print("You are eligible to vote")
\`\`\`

**Explanation:**
- Python checks the condition.
- If **True** → code runs.
- If **False** → skipped.

## \`if-else\` Statement

\`\`\`python
number = 10

if number % 2 == 0:
    print("Even number")
else:
    print("Odd number")
\`\`\`

- \`if\` handles the **True** case.
- \`else\` handles the **False** case.

## \`if-elif-else\` Statement

Used when you have **multiple conditions**:

\`\`\`python
marks = 75

if marks >= 90:
    print("Grade A")
elif marks >= 60:
    print("Grade B")
else:
    print("Grade C")
\`\`\`

Python checks conditions **from top to bottom** and executes only the **first True** block.

## Important Rules
- ✅ Use colon \`:\` after every condition
- ✅ Indentation is mandatory inside the block
- ✅ Only the first True block executes when using elif`,
                                    expectedSkills: ["Write if statements", "Use if-else", "Use if-elif-else chains"]
                                },
                                {
                                    title: "Logical Expressions",
                                    type: "reading",
                                    order: 2,
                                    duration: "15:00",
                                    content: `# Logical Expressions

Logical expressions combine **multiple conditions** using logical operators.

## Using \`and\`

Both conditions must be **True**:

\`\`\`python
age = 20
has_id = True

if age >= 18 and has_id:
    print("Entry allowed")
\`\`\`

## Using \`or\`

Only **one** condition needs to be True:

\`\`\`python
day = "Sunday"

if day == "Saturday" or day == "Sunday":
    print("Weekend")
\`\`\`

## Using \`not\`

\`not\` **reverses** True ↔ False:

\`\`\`python
is_logged_in = False

if not is_logged_in:
    print("Please login")
\`\`\`

## Combining in Real Programs

\`\`\`python
age = 20
marks = 55

if age > 18 and marks > 50:
    print("Eligible for scholarship")
else:
    print("Not eligible")
\`\`\`

This entire condition line is called a **logical expression**.`,
                                    expectedSkills: ["Combine conditions with and/or/not", "Write complex logical expressions"]
                                },
                                {
                                    title: "AI Logic Playground — Conditionals",
                                    type: "playground",
                                    order: 3,
                                    duration: "15:00",
                                    content: "Practice writing if-elif-else statements. Try the grade calculator, voting eligibility checker, and weekend detector. The AI Tutor will give hints if you get stuck!"
                                }
                            ]
                        },
                        {
                            title: "Loops and Iteration",
                            order: 2,
                            lessons: [
                                {
                                    title: "for and while Loops",
                                    type: "reading",
                                    order: 1,
                                    duration: "20:00",
                                    content: `# for and while Loops

Loops **repeat** a block of code multiple times.

## \`for\` Loop

Used when the **number of iterations is known**:

\`\`\`python
for i in range(5):
    print(i)
\`\`\`

**Output:** 0 1 2 3 4

### Loop Through a List

\`\`\`python
fruits = ["Apple", "Mango", "Banana"]

for fruit in fruits:
    print(fruit)
\`\`\`

## \`while\` Loop

Used when a **condition** decides repetition:

\`\`\`python
count = 1

while count <= 5:
    print(count)
    count += 1
\`\`\`

Loop runs until the condition becomes **False**.

## ⚠️ Infinite Loop Warning

\`\`\`python
while True:
    print("Hello")
\`\`\`

This runs **forever** unless stopped with \`break\` or Ctrl+C.

## Difference Between for and while

| Feature | for loop | while loop |
|---------|----------|------------|
| When to use | Known number of iterations | Condition-based |
| Risk | Low | Risk of infinite loop |
| Common use | Iterating lists, ranges | Menus, game loops |`,
                                    threeJsBlock: {
                                        conceptName: "Loop Flow Visualizer",
                                        visualDescription: "Animated 3D loop showing a counter ball bouncing between start and end, with iteration count displayed.",
                                        pythonConcept: "Loop execution flow",
                                        interactionType: "User sets start/end values, watches loop animate."
                                    },
                                    expectedSkills: ["Write for loops", "Write while loops", "Avoid infinite loops"]
                                },
                                {
                                    title: "The range() Function",
                                    type: "reading",
                                    order: 2,
                                    duration: "15:00",
                                    content: `# The range() Function

\`range()\` generates a **sequence of numbers**, mainly used with loops.

## Basic Syntax

\`\`\`python
range(start, stop, step)
\`\`\`

## Example 1 — Single Value (starts from 0)

\`\`\`python
for i in range(5):
    print(i)
\`\`\`

**Output:** 0 1 2 3 4

## Example 2 — Start and Stop

\`\`\`python
for i in range(2, 6):
    print(i)
\`\`\`

**Output:** 2 3 4 5

## Example 3 — Step Value (skip by 2)

\`\`\`python
for i in range(1, 10, 2):
    print(i)
\`\`\`

**Output:** 1 3 5 7 9

## Reverse Loop

\`\`\`python
for i in range(10, 0, -1):
    print(i)
\`\`\`

**Output:** 10 9 8 7 6 5 4 3 2 1

> **Note:** \`range(stop)\` — stop value is **excluded** from the sequence!`,
                                    expectedSkills: ["Use range() with 1, 2, and 3 arguments", "Create reverse loops", "Use step values"]
                                },
                                {
                                    title: "Debugging Logical Errors",
                                    type: "reading",
                                    order: 3,
                                    duration: "15:00",
                                    content: `# Debugging Logical Errors

Logical errors happen when code **runs but gives wrong output**. No syntax error — but wrong thinking!

## Example of a Logical Error

\`\`\`python
age = 18

if age > 18:
    print("Adult")
\`\`\`

**Problem:** Age 18 should also print "Adult", but it won't because \`> 18\` excludes 18.

### Fixed Version:
\`\`\`python
if age >= 18:
    print("Adult")
\`\`\`

## Common Logical Mistakes

### 1. Wrong Operator (\`=\` vs \`==\`)
\`\`\`python
# Wrong:
if a = 5:   # SyntaxError - assignment inside if!

# Correct:
if a == 5:  # Comparison
\`\`\`

### 2. Wrong Indentation
\`\`\`python
# Wrong:
if x > 5:
print("Hello")   # Not indented — error!

# Correct:
if x > 5:
    print("Hello")
\`\`\`

### 3. Wrong Loop Condition (Infinite Loop)
\`\`\`python
# Wrong — x never reaches 5:
x = 10
while x < 5:
    x -= 1   # x goes to -infinity!
\`\`\`

## Debugging Tips 🛠️

1. Use \`print()\` to check variable values
2. Test with **different** inputs
3. Read conditions **slowly and carefully**
4. Break big problems into **small steps**

\`\`\`python
# Debug like this:
print("Current value of x:", x)
print("Condition result:", x > 5)
\`\`\``,
                                    debuggingBlock: {
                                        wrongCode: `x = 10
while x < 5:
    x -= 1
    print(x)`,
                                        correctedCode: `x = 1
while x <= 5:
    print(x)
    x += 1`,
                                        explanation: "The original code starts x at 10, which is already not < 5, so the loop never runs. Even if it did, subtracting from x makes the condition true forever. Fix: start at 1, use <= 5, and add 1 each iteration."
                                    },
                                    expectedSkills: ["Identify logical errors", "Debug using print statements", "Fix wrong operators and loop conditions"]
                                },
                                {
                                    title: "Week 2 Knowledge Check",
                                    type: "quiz",
                                    order: 4,
                                    duration: "10:00",
                                    content: "Test your understanding of Logic Building and Flow Control.",
                                    quizQuestions: [
                                        {
                                            question: "What does elif mean in Python?",
                                            options: ["end if", "else if", "extra loop", "exit loop"],
                                            correctAnswer: 1
                                        },
                                        {
                                            question: "What is the output of range(2, 6)?",
                                            options: ["2, 3, 4, 5, 6", "2, 3, 4, 5", "1, 2, 3, 4, 5, 6", "3, 4, 5"],
                                            correctAnswer: 1
                                        },
                                        {
                                            question: "Which loop is best when you know the exact number of iterations?",
                                            options: ["while", "do-while", "for", "repeat"],
                                            correctAnswer: 2
                                        },
                                        {
                                            question: "What does 'and' require to return True?",
                                            options: ["At least one True", "Both conditions True", "Both conditions False", "Neither condition"],
                                            correctAnswer: 1
                                        },
                                        {
                                            question: "What is a logical error?",
                                            options: ["Code that doesn't run", "Code that runs but gives wrong result", "A missing colon", "Wrong indentation"],
                                            correctAnswer: 1
                                        },
                                        {
                                            question: "What is range(1, 10, 2)?",
                                            options: ["1 3 5 7 9", "1 2 3 4 5 6 7 8 9 10", "2 4 6 8 10", "1 3 5 7 9 11"],
                                            correctAnswer: 0
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    miniChallenge: "Write a grade calculator: Ask the user for marks (0-100). Print Grade A (>=90), Grade B (>=60), Grade C (>=40), or Grade F (below 40). Use a loop to keep asking until the user types -1 to quit.",
                    expectedSkills: [
                        "Write if-elif-else statements",
                        "Use logical operators (and, or, not)",
                        "Write for and while loops",
                        "Use range() with different arguments",
                        "Identify and fix logical errors"
                    ]
                },

                // ══════════════════════════════════════════════════════════════
                // WEEK 3 — Functions and Data Handling
                // ══════════════════════════════════════════════════════════════
                {
                    weekNumber: 3,
                    title: "Week 3: Functions and Data Handling",
                    order: 3,
                    description: "Write reusable, organized code using functions. Work with Python's powerful built-in data structures.",
                    modules: [
                        {
                            title: "Functions",
                            order: 1,
                            lessons: [
                                {
                                    title: "What is a Function?",
                                    type: "reading",
                                    order: 1,
                                    duration: "15:00",
                                    content: `# What is a Function?

A function is a **block of reusable code** that performs a specific task. Instead of writing the same logic multiple times, you define it once and call it whenever needed.

## Functions help in:
- 🗂️ **Organizing** code
- 🔁 **Reducing** repetition
- 🐛 **Making** debugging easier
- 🧱 **Building** modular programs

## Basic Syntax

\`\`\`python
def function_name():
    print("Hello Python")
\`\`\`

**Explanation:**
- \`def\` → keyword used to create a function
- \`function_name\` → name chosen by programmer
- \`()\` → used for parameters (inputs)
- \`:\` → indicates start of function block
- Indented code → function body

## Calling a Function

\`\`\`python
def greet():
    print("Welcome")

greet()  # Call the function
\`\`\`

**Output:** Welcome

The function runs **only when it is called**.

## Why Functions Matter

### Without functions (repetitive):
\`\`\`python
print("Hello")
print("Hello")
print("Hello")
\`\`\`

### With a function (clean):
\`\`\`python
def say_hello():
    print("Hello")

say_hello()
say_hello()
say_hello()
\`\`\`

Cleaner, reusable, and easy to modify!`,
                                    expectedSkills: ["Define functions using def", "Call functions", "Explain why functions are useful"]
                                },
                                {
                                    title: "Parameters and Return Values",
                                    type: "reading",
                                    order: 2,
                                    duration: "20:00",
                                    content: `# Parameters and Return Values

Functions become more useful when they **accept input** and **return output**.

## Parameters (Inputs)

Parameters allow functions to work with different data:

\`\`\`python
def greet(name):
    print("Hello", name)

greet("Ali")    # Output: Hello Ali
greet("Sara")   # Output: Hello Sara
\`\`\`

Here:
- \`name\` → **parameter** (in definition)
- \`"Ali"\` → **argument** (when calling)

## Multiple Parameters

\`\`\`python
def add(a, b):
    print(a + b)

add(10, 5)   # Output: 15
\`\`\`

## Return Values

\`return\` sends a **result back** from a function:

\`\`\`python
def multiply(a, b):
    return a * b

result = multiply(4, 3)
print(result)   # Output: 12
\`\`\`

## print vs return

| Feature | print | return |
|---------|-------|--------|
| Shows on screen | ✅ Yes | ❌ No |
| Gives value back | ❌ No | ✅ Yes |
| Can be stored | ❌ No | ✅ Yes |

\`\`\`python
# Using the returned value:
value = multiply(2, 5)
print("2 x 5 =", value)  # Output: 2 x 5 = 10
\`\`\``,
                                    expectedSkills: ["Define functions with parameters", "Use multiple parameters", "Use return to send back values", "Differentiate print vs return"]
                                },
                                {
                                    title: "AI Logic Playground — Functions",
                                    type: "playground",
                                    order: 3,
                                    duration: "20:00",
                                    content: "Build and test your own functions! Try creating a function that calculates BMI, a temperature converter (Celsius to Fahrenheit), and a simple calculator with 4 operations. The AI Tutor will review your logic."
                                }
                            ]
                        },
                        {
                            title: "Data Structures",
                            order: 2,
                            lessons: [
                                {
                                    title: "Lists and Tuples",
                                    type: "reading",
                                    order: 1,
                                    duration: "20:00",
                                    content: `# Lists and Tuples

These are **data structures** used to store multiple values.

## Lists

Lists are **ordered**, **changeable (mutable)**, and allow duplicates.

\`\`\`python
numbers = [10, 20, 30]
\`\`\`

### Access Elements (index starts at 0):
\`\`\`python
print(numbers[0])   # 10
print(numbers[-1])  # 30 (last item)
\`\`\`

### Modify List:
\`\`\`python
numbers[1] = 50   # [10, 50, 30]
\`\`\`

### Add Items:
\`\`\`python
numbers.append(40)   # [10, 50, 30, 40]
\`\`\`

### Loop Through List:
\`\`\`python
for num in numbers:
    print(num)
\`\`\`

## Tuples

Tuples are like lists but **immutable** (cannot be changed after creation):

\`\`\`python
data = (1, 2, 3)
print(data[0])   # 1
\`\`\`

## List vs Tuple

| Feature | List \`[]\` | Tuple \`()\` |
|---------|------------|-------------|
| Mutable | ✅ Yes | ❌ No |
| Syntax | Square brackets | Parentheses |
| Use when | Data changes | Data is fixed |

> Use tuples when data should remain **constant** (e.g., coordinates, days of week).`,
                                    expectedSkills: ["Create and modify lists", "Access elements by index", "Use append()", "Understand when to use tuples vs lists"]
                                },
                                {
                                    title: "Dictionaries",
                                    type: "reading",
                                    order: 2,
                                    duration: "20:00",
                                    content: `# Dictionaries

Dictionaries store data in **key-value pairs** — like a real dictionary where a word (key) has a definition (value).

**Real Examples:**
- Name → Age
- Product → Price
- Username → Email

## Creating a Dictionary

\`\`\`python
student = {
    "name": "Sara",
    "age": 21,
    "course": "Python"
}
\`\`\`

## Access Value

\`\`\`python
print(student["name"])   # Sara
\`\`\`

## Add or Update Value

\`\`\`python
student["age"] = 22           # Update
student["city"] = "Mumbai"    # Add new key
\`\`\`

## Loop Through Dictionary

\`\`\`python
for key, value in student.items():
    print(key, ":", value)
\`\`\`

**Output:**
\`\`\`
name : Sara
age : 22
course : Python
city : Mumbai
\`\`\`

## Why Dictionaries Are Powerful
- ⚡ **Fast data lookup** by key
- 🌐 **Used in APIs** and JSON responses
- 🗃️ **Real-world structured data** (user profiles, products)`,
                                    threeJsBlock: {
                                        conceptName: "Dictionary Key-Value Map",
                                        visualDescription: "3D boxes with key labels, connected by arrows to value containers. Clicking a key highlights its value.",
                                        pythonConcept: "Dictionary structure and lookup",
                                        interactionType: "Click key → highlight matching value."
                                    },
                                    expectedSkills: ["Create dictionaries", "Access, add, and update values", "Loop through dictionary items"]
                                },
                                {
                                    title: "String Processing",
                                    type: "reading",
                                    order: 3,
                                    duration: "20:00",
                                    content: `# String Processing

Strings represent **text data**. Python has powerful built-in tools for working with strings.

\`\`\`python
text = "Hello Python"
\`\`\`

## String Indexing

\`\`\`python
print(text[0])    # H  (first character)
print(text[-1])   # n  (last character)
\`\`\`

## Useful String Methods

\`\`\`python
# Convert case
text.upper()      # "HELLO PYTHON"
text.lower()      # "hello python"

# Length
len(text)         # 12

# Replace words
text.replace("Python", "World")   # "Hello World"

# Split into list
sentence = "I love coding"
words = sentence.split(" ")       # ['I', 'love', 'coding']

# Join list back to string
"-".join(words)   # "I-love-coding"
\`\`\`

## String Concatenation

\`\`\`python
name = "Ali"
msg = "Hello " + name    # "Hello Ali"
\`\`\`

## f-Strings (Modern, Preferred Formatting)

\`\`\`python
name = "Musif"
age = 21
print(f"My name is {name} and I am {age} years old")
\`\`\`

**Output:** My name is Musif and I am 21 years old

> f-strings are heavily used in **modern Python** and especially in **API development** and **web frameworks**!`,
                                    expectedSkills: ["Index and slice strings", "Use upper/lower/replace/split/join", "Format strings with f-strings"]
                                },
                                {
                                    title: "Week 3 Knowledge Check",
                                    type: "quiz",
                                    order: 4,
                                    duration: "10:00",
                                    content: "Test your understanding of Functions and Data Handling.",
                                    quizQuestions: [
                                        {
                                            question: "What keyword is used to create a function in Python?",
                                            options: ["func", "function", "def", "define"],
                                            correctAnswer: 2
                                        },
                                        {
                                            question: "What does return do in a function?",
                                            options: ["Prints result", "Sends result back to caller", "Closes the function", "Restarts the function"],
                                            correctAnswer: 1
                                        },
                                        {
                                            question: "Which list method adds an item at the end?",
                                            options: ["add()", "push()", "insert()", "append()"],
                                            correctAnswer: 3
                                        },
                                        {
                                            question: "What is the difference between a list and a tuple?",
                                            options: ["Lists use (), tuples use []", "Lists are immutable, tuples are mutable", "Lists are mutable, tuples are immutable", "No difference"],
                                            correctAnswer: 2
                                        },
                                        {
                                            question: "How do you access a value in a dictionary?",
                                            options: ["dict.get_value(key)", "dict[key]", "dict.key", "dict->key"],
                                            correctAnswer: 1
                                        },
                                        {
                                            question: "What does f\"Hello {name}\" do in Python?",
                                            options: ["Causes an error", "Prints the letter f", "Inserts the variable name into the string", "Creates a function"],
                                            correctAnswer: 2
                                        },
                                        {
                                            question: "What does 'I love coding'.split(' ') return?",
                                            options: ["'I-love-coding'", "['I', 'love', 'coding']", "('I', 'love', 'coding')", "'Ilovecoding'"],
                                            correctAnswer: 1
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    miniChallenge: "Build a Student Profile Manager: Create a function that takes name, age, and marks, stores them in a dictionary, and prints a formatted report using f-strings. Store multiple students in a list and loop through all profiles.",
                    expectedSkills: [
                        "Define and call functions with parameters",
                        "Use return values effectively",
                        "Create and manipulate lists",
                        "Use tuples for constant data",
                        "Work with dictionaries (CRUD operations)",
                        "Process strings with built-in methods and f-strings"
                    ]
                },

                // ══════════════════════════════════════════════════════════════
                // WEEK 4 — Real-World CLI Development
                // ══════════════════════════════════════════════════════════════
                {
                    weekNumber: 4,
                    title: "Week 4: Real-World CLI Development",
                    order: 4,
                    description: "Apply everything you've learned to build real command-line applications with file handling, error management, and automation.",
                    modules: [
                        {
                            title: "File Handling",
                            order: 1,
                            lessons: [
                                {
                                    title: "Reading and Writing Files",
                                    type: "reading",
                                    order: 1,
                                    duration: "25:00",
                                    content: `# File Handling in Python

File handling allows programs to **store and retrieve data permanently** using files like .txt, .csv, or .json.

**Without files:** Data disappears when program closes.  
**With files:** Data is saved and reused later — like a database!

## Opening a File

Python uses the \`open()\` function:

\`\`\`python
file = open("data.txt", "r")
\`\`\`

**Syntax:** \`open("filename", "mode")\`

## File Modes

| Mode | Meaning |
|------|---------|
| \`"r"\` | Read (file must exist) |
| \`"w"\` | Write (creates or overwrites) |
| \`"a"\` | Append (adds to end) |
| \`"x"\` | Create (fails if exists) |

## Reading from a File

### Read Entire File:
\`\`\`python
file = open("data.txt", "r")
content = file.read()
print(content)
file.close()
\`\`\`

### Read Line by Line:
\`\`\`python
file = open("data.txt", "r")
for line in file:
    print(line)
file.close()
\`\`\`

## Writing to a File

\`\`\`python
file = open("data.txt", "w")
file.write("Hello Python")
file.close()
\`\`\`

> ⚠️ \`"w"\` **replaces** old content — be careful!

## Appending Data

\`\`\`python
file = open("data.txt", "a")
file.write("\\nNew Line Added")
file.close()
\`\`\`

## ✅ Best Practice — Using \`with\` Statement

Automatically closes the file — **always use this**:

\`\`\`python
with open("data.txt", "r") as file:
    print(file.read())
\`\`\`

No need to call \`file.close()\` — Python handles it!

## Real-World Uses
- 💾 Saving user data and profiles
- 📋 Writing application logs
- 🤖 Storing AI prompts and responses
- 📊 Generating reports`,
                                    expectedSkills: ["Open files in different modes", "Read entire files and line by line", "Write and append to files", "Use the with statement"]
                                }
                            ]
                        },
                        {
                            title: "Error Handling & Modular Programming",
                            order: 2,
                            lessons: [
                                {
                                    title: "Error Handling with try/except",
                                    type: "reading",
                                    order: 1,
                                    duration: "20:00",
                                    content: `# Error Handling with try/except

## What is Error Handling?

Errors (exceptions) happen when something goes wrong during execution:
- Dividing by zero
- File not found
- Wrong input type

**Without handling → program crashes.**  
**With handling → graceful recovery!**

## Basic try/except Syntax

\`\`\`python
try:
    x = 10 / 0
except:
    print("An error occurred")
\`\`\`

Instead of crashing, we **catch** the error and respond.

## Handling Specific Errors

\`\`\`python
try:
    num = int(input("Enter number: "))
except ValueError:
    print("Invalid input — please enter a number!")
\`\`\`

## Multiple Exceptions

\`\`\`python
try:
    file = open("data.txt")
except FileNotFoundError:
    print("File not found")
except PermissionError:
    print("No permission to read this file")
\`\`\`

## Using else and finally

\`\`\`python
try:
    x = 5 / 1
except:
    print("Error")
else:
    print("Success!")          # Runs ONLY if no error
finally:
    print("Execution finished") # ALWAYS runs
\`\`\`

**Explanation:**
- \`else\` → runs if **no** error occurred
- \`finally\` → **always** runs (cleanup code)

## Why Error Handling is Important
- 🛡️ **Prevents crashes** in production apps
- 😊 **Improves user experience** (friendly messages)
- ✅ **Required** in all real-world applications`,
                                    debuggingBlock: {
                                        wrongCode: `age = int(input("Enter your age: "))
print("Your age is:", age)`,
                                        correctedCode: `try:
    age = int(input("Enter your age: "))
    print("Your age is:", age)
except ValueError:
    print("Please enter a valid number!")`,
                                        explanation: "If the user types 'abc' instead of a number, int() raises a ValueError and crashes the program. Wrapping it in try/except handles this gracefully."
                                    },
                                    expectedSkills: ["Use try/except to handle errors", "Handle specific exception types", "Use else and finally correctly"]
                                },
                                {
                                    title: "Modular Program Structure",
                                    type: "reading",
                                    order: 2,
                                    duration: "15:00",
                                    content: `# Modular Program Structure

## What is Modular Programming?

Instead of writing everything in one file, **divide your program into small modules** (separate files).

**Benefits:**
- 🔧 Easy maintenance
- ♻️ Code reuse across projects
- 📁 Cleaner, organized structure
- 👥 Team collaboration

## Creating a Module

**File: math_utils.py**
\`\`\`python
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b
\`\`\`

## Using the Module

**File: main.py**
\`\`\`python
import math_utils

print(math_utils.add(5, 3))       # 8
print(math_utils.subtract(10, 4)) # 6
\`\`\`

## Import Methods

\`\`\`python
# Method 1: Import entire module
import math_utils

# Method 2: Import specific function
from math_utils import add

# Method 3: Rename module (alias)
import math_utils as mu
print(mu.add(2, 3))
\`\`\`

## Why Modular Structure Matters

Especially important for large projects like:
- 🌐 Web applications
- 🤖 AI systems
- 🔄 Automation tools
- 🎓 Your SkillBridge platform backend!`,
                                    expectedSkills: ["Create Python modules", "Import modules using different methods", "Organize code into multiple files"]
                                },
                                {
                                    title: "Introduction to Automation",
                                    type: "reading",
                                    order: 3,
                                    duration: "20:00",
                                    content: `# Introduction to Automation

## What is Automation?

Automation means using Python to perform **repetitive tasks automatically** instead of doing them manually.

**Examples:**
- 📂 Renaming hundreds of files at once
- 📧 Sending bulk emails
- 🌐 Scraping websites for data
- 📊 Processing large datasets
- 📑 Generating reports automatically

## Simple Automation — File Operations

\`\`\`python
import os

# List all files in current folder
files = os.listdir()
for file in files:
    print(file)
\`\`\`

## Automation — Reading Data from Files

\`\`\`python
with open("data.txt", "r") as file:
    for line in file:
        print(line.strip())
\`\`\`

## Popular Automation Libraries

| Library | Purpose |
|---------|---------|
| \`os\` | File system tasks (built-in) |
| \`shutil\` | File copy/move/delete operations |
| \`requests\` | Making API calls |
| \`selenium\` | Browser automation |
| \`pandas\` | Data processing automation |

## A Complete Mini Automation Example

\`\`\`python
import os

folder = "my_files"
os.makedirs(folder, exist_ok=True)  # Create folder if not exists

# Create 5 numbered text files
for i in range(1, 6):
    filename = f"{folder}/file_{i}.txt"
    with open(filename, "w") as f:
        f.write(f"This is file number {i}\\n")

print("✅ 5 files created automatically!")
\`\`\`

> This is the power of Python — tasks that would take 10 minutes manually done in **1 second**!`,
                                    expectedSkills: ["Use os module for file operations", "Automate repetitive file tasks", "Know key automation libraries"]
                                },
                                {
                                    title: "Interactive Logic Visualizer — File Flow",
                                    type: "visualizer",
                                    order: 4,
                                    duration: "10:00",
                                    content: "Watch how data flows from your Python program into a file and back. See the open → write → close cycle animated in 3D, and understand why the 'with' statement is safer."
                                },
                                {
                                    title: "Week 4 Knowledge Check",
                                    type: "quiz",
                                    order: 5,
                                    duration: "10:00",
                                    content: "Final assessment for Week 4 — Real-World CLI Development.",
                                    quizQuestions: [
                                        {
                                            question: "Which file mode creates a new file or overwrites an existing one?",
                                            options: ["\"r\"", "\"a\"", "\"w\"", "\"x\""],
                                            correctAnswer: 2
                                        },
                                        {
                                            question: "What is the advantage of using 'with open()' over regular open()?",
                                            options: ["It's faster", "It automatically closes the file", "It reads faster", "It only works for .txt files"],
                                            correctAnswer: 1
                                        },
                                        {
                                            question: "Which block in try/except ALWAYS executes?",
                                            options: ["try", "except", "else", "finally"],
                                            correctAnswer: 3
                                        },
                                        {
                                            question: "What exception is raised when you enter text instead of a number in int()?",
                                            options: ["TypeError", "ValueError", "NameError", "IndexError"],
                                            correctAnswer: 1
                                        },
                                        {
                                            question: "What does 'import os' allow you to do?",
                                            options: ["Connect to internet", "Work with OS file system", "Send emails", "Create databases"],
                                            correctAnswer: 1
                                        },
                                        {
                                            question: "What does 'from math_utils import add' do?",
                                            options: ["Imports the entire math_utils module", "Imports only the add function", "Creates a new add function", "Deletes math_utils"],
                                            correctAnswer: 1
                                        },
                                        {
                                            question: "Which mode appends data to the end of an existing file?",
                                            options: ["\"r\"", "\"w\"", "\"a\"", "\"x\""],
                                            correctAnswer: 2
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    miniChallenge: "Build a 'Student Grade Book' CLI App: The program should let the user (1) Add a student with name and marks, (2) Save all students to a students.txt file, (3) Read and display all students from the file, and (4) Handle errors if the file doesn't exist. Use functions, dictionaries, file handling, and try/except.",
                    expectedSkills: [
                        "Read and write files using open() and 'with'",
                        "Handle errors gracefully with try/except/else/finally",
                        "Create and import Python modules",
                        "Use os module for basic automation",
                        "Build a complete CLI application combining all 4 weeks"
                    ]
                }
            ]
        };

        // ── SEED THE COURSE ────────────────────────────────────────────────
        const created = await Course.create(courseData);
        console.log(`\n✅ Successfully seeded course: "${created.title}"`);
        console.log(`   ID: ${created._id}`);
        console.log(`   Weeks: 4`);
        console.log(`   Total modules: 8`);
        console.log(`   Total lessons: 27+`);
        console.log('\nDatabase now contains ONLY the SkillBridge Python Basics course.');

        process.exit(0);

    } catch (err) {
        console.error('❌ Seed Error:', err.message || err);
        process.exit(1);
    }
};

seedPythonBasics();
