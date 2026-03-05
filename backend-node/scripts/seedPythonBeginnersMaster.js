const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');
const User = require('./models/User');

dotenv.config();

const seedPythonBeginnersMaster = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected.');

        // 1. Find or Create Instructor
        let instructor = await User.findOne({ role: 'admin' });
        if (!instructor) {
            instructor = await User.create({
                name: 'Python Master',
                email: 'master@skillbridge.ai',
                password: 'password123',
                role: 'admin',
                isVerified: true
            });
        }

        // 2. Clear existing course with same slug if any
        await Course.deleteOne({ slug: 'python-for-beginners' });

        // 3. Define Course Structure from Syllabus
        const pythonCourse = new Course({
            title: 'Python for Beginners',
            subtitle: 'A complete NEP-aligned, AI-guided bootcamp from zero to real-world CLI developer.',
            description: 'SkillBridge Python for Beginners is a guided learning pathway that helps students transition from zero programming knowledge to building real-world command-line applications. Learn by doing — through debugging, logic-building, and structured projects.',
            fullDescription: `
                <h3>Welcome to SkillBridge Python Basics</h3>
                <p>This isn't just another video course. It's a structured journey where you learn by <strong>doing</strong> and <strong>debugging</strong>.</p>
                <p>Aligned with the modern NEP skill framework, this 4-week course takes you from absolute zero to building real CLI tools.</p>
                <ul>
                    <li><strong>AI-Guided Debugging:</strong> Never get stuck. Our AI Tutor gives hints, identifies mistakes, and promotes independent thinking — without revealing full solutions.</li>
                    <li><strong>Project-Based Learning:</strong> Build real command-line tools from Week 4.</li>
                    <li><strong>NEP-Aligned Curriculum:</strong> Follows the latest skill framework for modern education in India.</li>
                    <li><strong>Logic-First Approach:</strong> Understand algorithms before writing code.</li>
                </ul>
            `,
            category: 'Programming',
            level: 'Beginner',
            price: 4999,
            originalPrice: 9999,
            instructor: instructor._id,
            image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80',
            isPublished: true,
            isFeatured: true,
            tags: ['Python', 'Programming', 'NEP Aligned', 'AI Enhanced', 'Beginners', 'CLI'],
            features: [
                'AI Tutor (Guided Debugging — Hints Only)',
                'NEP-Aligned Skill Framework',
                'Practice Challenges Every Module',
                'Real-World CLI Mini Projects',
                'Certificate of Completion',
                'GitHub Portfolio Guidance',
                'Logic Visualizers for Key Concepts'
            ],
            assessmentModel: {
                codingWeightage: "70%",
                mcqWeightage: "30%"
            },
            aiTutorSystem: {
                logicMirroringExamples: ["Indentation errors", "Type mismatch", "Logic loops", "Off-by-one errors"],
                indentationAlertBehavior: "Highlight and explain the concept of scope",
                syntaxHintRules: ["Explain why, don't show how", "Use analogies", "Encourage student to read error messages"]
            },
            weeks: [
                // ─────────────────────────────────────────────
                // WEEK 1: Python Foundations
                // ─────────────────────────────────────────────
                {
                    title: 'Week 1: Python Foundations',
                    order: 1,
                    description: 'Understand what programming is, learn Python syntax, variables, data types, input/output, and operators.',
                    modules: [
                        {
                            title: 'Module 1: Introduction to Programming & Python',
                            order: 1,
                            description: 'What is programming, algorithms, and why Python is a great first language.',
                            lessons: [
                                {
                                    title: 'What is Programming?',
                                    type: 'reading',
                                    duration: '10:00',
                                    order: 1,
                                    content: `Programming means giving instructions to a computer so it can perform tasks automatically. These instructions are written in a language like Python, Java, or C++.

A program is simply: Input → Processing → Output

Example:
- Input: Numbers from user
- Processing: Add numbers
- Output: Result displayed

Python was created by Guido van Rossum in the late 1980s. It has simple syntax, requires less code, and is used in AI, Web Development, Data Science, and Automation.`
                                },
                                {
                                    title: 'What is an Algorithm?',
                                    type: 'reading',
                                    duration: '10:00',
                                    order: 2,
                                    content: `An algorithm is a step-by-step method to solve a problem logically before writing code.

Example — Algorithm to find the largest number:
1. Take two numbers from the user.
2. Compare them.
3. Print the larger number.

Algorithms help in:
- Problem solving
- Writing efficient code
- Avoiding confusion while coding

Always plan your algorithm before you start coding!`
                                },
                                {
                                    title: 'Why Python for Beginners?',
                                    type: 'reading',
                                    duration: '08:00',
                                    order: 3,
                                    content: `Why Python is perfect for beginners:
- Simple, clean syntax
- Less code compared to other languages
- Huge community support
- Used in AI, Web, Data Science, and Automation
- No need to declare variable types

Python reads almost like English, making it the easiest language to start with.`
                                },
                                {
                                    title: 'Quiz: Programming Basics',
                                    type: 'quiz',
                                    duration: '10:00',
                                    order: 4,
                                    quizQuestions: [
                                        {
                                            question: 'What is programming?',
                                            options: ['Designing graphics for apps', 'Giving instructions to a computer to perform tasks', 'Installing software on a computer', 'Using social media platforms'],
                                            correctAnswer: 1,
                                            explanation: 'Programming means giving instructions to a computer to perform tasks automatically.'
                                        },
                                        {
                                            question: 'Who created Python?',
                                            options: ['Bill Gates', 'Linus Torvalds', 'Guido van Rossum', 'James Gosling'],
                                            correctAnswer: 2,
                                            explanation: 'Python was created by Guido van Rossum in the late 1980s.'
                                        },
                                        {
                                            question: 'What is an algorithm?',
                                            options: ['A type of virus', 'A social media platform', 'A step-by-step method to solve a problem', 'A hardware component'],
                                            correctAnswer: 2,
                                            explanation: 'An algorithm is a step-by-step method to solve a problem logically before writing code.'
                                        }
                                    ]
                                }
                            ],
                            },
                        {
                            title: 'Module 2: Python Syntax & Indentation',

                            order: 2,
                            description: 'Learn the rules for writing Python code correctly, including indentation.',
                            lessons: [
                                {
                                    title: 'Python Syntax Rules',
                                    type: 'reading',
                                    duration: '12:00',
                                    order: 1,
                                    content: `Syntax means the rules of writing code. Python syntax is clean and readable.

Types of quotes in Python:
- Single Quotes: print('My name is Vivek')
- Double Quotes: print("Vivek's Dad is cool guy.")
- Triple Quotes: print("""Hello\\nMy name is Vivek\\nI am learning Python""")

Unlike other languages, Python does NOT require semicolons or brackets at the end of lines.`
                                },
                                {
                                    title: 'Understanding Indentation',
                                    type: 'reading',
                                    duration: '10:00',
                                    order: 2,
                                    content: `Indentation means spaces at the beginning of a line. Python uses indentation to define code blocks.

Correct Example:
if 5 > 2:
    print("Correct")

Wrong Example (will cause error):
if 5 > 2:
print("Correct")

Why Python uses indentation:
- Improves code readability
- Enforces clean coding style
- Avoids the need for curly braces {} like other languages

Always use 4 spaces (or 1 Tab) for indentation.`
                                },
                                {
                                    title: '3D Logic Visualizer: Code Blocks & Indentation',
                                    type: 'visualizer',
                                    duration: '08:00',
                                    order: 3,
                                    threeJsBlock: {
                                        conceptName: 'Indentation Staircase',
                                        visualDescription: 'Visual representation of nested code blocks using indented 3D layers.',
                                        pythonConcept: 'indentation',
                                        interactionType: 'toggling',
                                        uiIntegrationHint: 'Show correct vs incorrect indentation with color highlights'
                                    }
                                },
                                {
                                    title: 'Challenge: Fix the Indentation',
                                    type: 'coding',
                                    duration: '15:00',
                                    order: 4,
                                    codingChallenge: {
                                        problemStatement: 'Print "Python is cool" — make sure your code has correct syntax. Use proper indentation in the if block.',
                                        starterCode: `# Fix the code below:\nif 10 > 5:\nprint("Python is cool")`,
                                        language: 'python',
                                        solution: `if 10 > 5:\n    print("Python is cool")`,
                                        testCases: [
                                            { input: '', output: 'Python is cool', isHidden: false }
                                        ]
                                    }
                                }
                            ]
                        },
                        {
                            title: 'Module 3: Variables & Data Types',
                            order: 3,
                            description: 'Store and manage data using variables and understand Python data types.',
                            lessons: [
                                {
                                    title: 'What is a Variable?',
                                    type: 'reading',
                                    duration: '12:00',
                                    order: 1,
                                    content: `A variable is a container used to store data.

Examples:
name = "Musif"
age = 21

Python automatically detects the type — no need to declare.

Common Data Types in Python:
- Integer (int): Whole numbers → x = 10
- Float (float): Decimal numbers → price = 99.5
- String (str): Text data → city = "Mumbai"
- Boolean (bool): True or False → is_active = True

Checking Data Type:
print(type(x))
Output: <class 'int'>`
                                },
                                {
                                    title: 'Quiz: Variables & Data Types',
                                    type: 'quiz',
                                    duration: '10:00',
                                    order: 2,
                                    quizQuestions: [
                                        {
                                            question: 'What is a variable in Python?',
                                            options: ['A fixed constant value', 'A container used to store data', 'A type of function', 'A special keyword'],
                                            correctAnswer: 1,
                                            explanation: 'A variable is a container used to store data that can change during program execution.'
                                        },
                                        {
                                            question: 'Which data type stores True or False?',
                                            options: ['int', 'str', 'bool', 'float'],
                                            correctAnswer: 2,
                                            explanation: 'Boolean (bool) stores True or False values.'
                                        },
                                        {
                                            question: 'What is the data type of: price = 99.5?',
                                            options: ['int', 'float', 'str', 'bool'],
                                            correctAnswer: 1,
                                            explanation: 'Decimal (fractional) numbers are of type float.'
                                        }
                                    ]
                                },
                                {
                                    title: 'Challenge: Meet the Machine',
                                    type: 'coding',
                                    duration: '18:00',
                                    order: 3,
                                    codingChallenge: {
                                        problemStatement: 'Create three variables: name (string), age (integer), and gpa (float). Then print them on separate lines.',
                                        starterCode: `# Create your variables here\nname = \nage = \ngpa = \n\n# Print them\nprint(name)\nprint(age)\nprint(gpa)`,
                                        language: 'python',
                                        solution: `name = "Musif"\nage = 21\ngpa = 9.5\nprint(name)\nprint(age)\nprint(gpa)`,
                                        testCases: [
                                            { input: '', output: 'Musif\n21\n9.5', isHidden: false }
                                        ]
                                    }
                                }
                            ,
                                {
                                    title: '3D Visualizer: Data Type Atoms',
                                    type: 'visualizer',
                                    duration: '06:00',
                                    order: 4,
                                    threeJsBlock: {
                                        conceptName: 'Data Type Atoms',
                                        visualDescription: 'Orbiting atomic spheres represent Python types: int, str, float, bool — each in their own orbital ring.',
                                        pythonConcept: 'data-types',
                                        interactionType: 'orbiting',
                                        uiIntegrationHint: 'Watch type atoms orbiting a central variable nucleus'
                                    }
                                }
                            ,
                                {
                                    title: '3D Visualizer: Input-Output Pipeline',
                                    type: 'visualizer',
                                    duration: '06:00',
                                    order: 6,
                                    threeJsBlock: {
                                        conceptName: 'IO Pipeline',
                                        visualDescription: 'A glowing pipeline with data packets: INPUT stage → PROCESS stage → OUTPUT stage, showing how operators transform data.',
                                        pythonConcept: 'input-output-operators',
                                        interactionType: 'flowing',
                                        uiIntegrationHint: 'Observe data packets flowing through the arithmetic pipeline'
                                    }
                                }
                            ]
                        },
                        {
                            title: 'Module 4: Input, Output & Operators',
                            order: 4,
                            description: 'Interact with users using print() and input(), and perform calculations with operators.',
                            lessons: [
                                {
                                    title: 'Input and Output in Python',
                                    type: 'reading',
                                    duration: '12:00',
                                    order: 1,
                                    content: `Output in Python — use the print() function:
print("Welcome to Python")

Printing variables:
name = "Ali"
print(name)

Input from User — use the input() function:
name = input("Enter your name: ")
print(name)

By default, input() stores data as a string.
For numbers: age = int(input("Enter age: "))

Combining Input and Output:
a = int(input("Enter first number: "))
b = int(input("Enter second number: "))
print("Sum =", a + b)`
                                },
                                {
                                    title: 'Operators & Expressions',
                                    type: 'reading',
                                    duration: '15:00',
                                    order: 2,
                                    content: `Operators perform operations on values.

Arithmetic Operators:
+ → Addition (a + b)
- → Subtraction (a - b)
* → Multiplication (a * b)
/ → Division (a / b)
% → Modulus/Remainder (a % b)
** → Power (a ** b)

Comparison Operators (return True/False):
== (equal), != (not equal), > , < , >= , <=

Logical Operators:
and → Both conditions must be True
or  → At least one condition must be True
not → Reverses the condition

An Expression combines variables, operators, and values:
result = (a + b) * 2`
                                },
                                {
                                    title: 'Challenge: Simple Calculator',
                                    type: 'coding',
                                    duration: '20:00',
                                    order: 3,
                                    codingChallenge: {
                                        problemStatement: 'Read two integers from stdin (one per line). Print their sum, then their product on separate lines.',
                                        starterCode: `import sys\nlines = sys.stdin.read().split()\na = int(lines[0])\nb = int(lines[1])\n# Write your code here`,
                                        language: 'python',
                                        solution: `import sys\nlines = sys.stdin.read().split()\na = int(lines[0])\nb = int(lines[1])\nprint(a + b)\nprint(a * b)`,
                                        testCases: [
                                            { input: '5\n3', output: '8\n15', isHidden: false },
                                            { input: '10\n4', output: '14\n40', isHidden: false }
                                        ]
                                    }
                                },
                                {
                                    title: 'Week 1 Assessment',
                                    type: 'quiz',
                                    duration: '15:00',
                                    order: 4,
                                    quizQuestions: [
                                        {
                                            question: 'Which function is used to take user input in Python?',
                                            options: ['scan()', 'input()', 'read()', 'get()'],
                                            correctAnswer: 1,
                                            explanation: 'input() is the built-in Python function used to take user input.'
                                        },
                                        {
                                            question: 'What does the % operator do?',
                                            options: ['Division', 'Power', 'Modulus (remainder)', 'Multiplication'],
                                            correctAnswer: 2,
                                            explanation: '% returns the remainder of a division operation.'
                                        },
                                        {
                                            question: 'What will print(type(99.5)) output?',
                                            options: ['<class int>', '<class float>', '<class str>', '<class number>'],
                                            correctAnswer: 1,
                                            explanation: '99.5 is a decimal number so its type is float.'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },

                // ─────────────────────────────────────────────
                // WEEK 2: Logic Building & Flow Control
                // ─────────────────────────────────────────────
                {
                    title: 'Week 2: Logic Building & Flow Control',
                    order: 2,
                    description: 'Master conditional statements, logical expressions, loops, and debugging logical errors.',
                    modules: [
                        {
                            title: 'Module 1: Conditional Statements',
                            order: 1,
                            description: 'Make your code smart with if, elif, and else decision-making.',
                            lessons: [
                                {
                                    title: 'The if Statement',
                                    type: 'reading',
                                    duration: '12:00',
                                    order: 1,
                                    content: `Conditional statements allow a program to make decisions based on conditions.

In real life: If it rains → take umbrella. Else → go normally.

Basic if Statement:
age = 18
if age >= 18:
    print("You are eligible to vote")

Python checks the condition. If True → code runs. If False → skipped.

if-else Statement:
number = 10
if number % 2 == 0:
    print("Even number")
else:
    print("Odd number")

if-elif-else (Multiple Conditions):
marks = 75
if marks >= 90:
    print("Grade A")
elif marks >= 60:
    print("Grade B")
else:
    print("Grade C")

Important Rules:
- Use colon : after condition
- Indentation is mandatory
- Only the first True block executes`
                                },
                                {
                                    title: '3D Logic Visualizer: If-Else Branching',
                                    type: 'visualizer',
                                    duration: '10:00',
                                    order: 2,
                                    threeJsBlock: {
                                        conceptName: 'Decision Diamond',
                                        visualDescription: 'A fork in the road representing True and False decision paths.',
                                        pythonConcept: 'if-elif-else',
                                        interactionType: 'toggling',
                                        uiIntegrationHint: 'Visualizing true/false branches with animated path routing'
                                    }
                                },
                                {
                                    title: 'Logical Expressions (and, or, not)',
                                    type: 'reading',
                                    duration: '12:00',
                                    order: 3,
                                    content: `Logical expressions combine multiple conditions using logical operators.

and → Both conditions must be True:
age = 20
has_id = True
if age >= 18 and has_id:
    print("Entry allowed")

or → At least one condition must be True:
day = "Sunday"
if day == "Saturday" or day == "Sunday":
    print("Weekend")

not → Reverses the condition:
is_logged_in = False
if not is_logged_in:
    print("Please login")

Complex Example:
if age > 18 and marks > 50:
    print("Eligible")`
                                },
                                {
                                                                    {
                                    title: '3D Visualizer: Boolean Logic Gates',
                                    type: 'visualizer',
                                    duration: '06:00',
                                    order: 6,
                                    threeJsBlock: {
                                        conceptName: 'Logic Gates — And Or Not',
                                        visualDescription: 'Three 3D gate nodes (AND, OR, NOT) wire truth values together — showing how logical operators combine conditions.',
                                        pythonConcept: 'logical-expressions',
                                        interactionType: 'orbiting',
                                        uiIntegrationHint: 'Watch T/F inputs flow through AND, OR, NOT gates'
                                    }
                                },
                                title: 'Challenge: Grade Calculator',
                                    type: 'coding',
                                    duration: '20:00',
                                    order: 4,
                                    codingChallenge: {
                                        problemStatement: 'Read marks (integer) from stdin. Print "Grade A" if marks >= 90, "Grade B" if >= 60, "Grade C" if >= 40, else "Fail".',
                                        starterCode: `import sys\nmarks = int(sys.stdin.read().strip())\n# Write your if-elif-else logic here`,
                                        language: 'python',
                                        solution: `import sys\nmarks = int(sys.stdin.read().strip())\nif marks >= 90:\n    print("Grade A")\nelif marks >= 60:\n    print("Grade B")\nelif marks >= 40:\n    print("Grade C")\nelse:\n    print("Fail")`,
                                        testCases: [
                                            { input: '95', output: 'Grade A', isHidden: false },
                                            { input: '72', output: 'Grade B', isHidden: false },
                                            { input: '45', output: 'Grade C', isHidden: false },
                                            { input: '30', output: 'Fail', isHidden: true }
                                        ]
                                    }
                                },
                                {
                                    title: 'Challenge: Login Validator',
                                    type: 'coding',
                                    duration: '20:00',
                                    order: 5,
                                    codingChallenge: {
                                        problemStatement: 'Read an age (integer) from stdin. Print "Access Granted" if age >= 18, otherwise print "Access Denied".',
                                        starterCode: `import sys\nage = int(sys.stdin.read().strip())\n# Write logic here`,
                                        language: 'python',
                                        solution: `import sys\nage = int(sys.stdin.read().strip())\nif age >= 18:\n    print("Access Granted")\nelse:\n    print("Access Denied")`,
                                        testCases: [
                                            { input: '20', output: 'Access Granted', isHidden: false },
                                            { input: '15', output: 'Access Denied', isHidden: false },
                                            { input: '18', output: 'Access Granted', isHidden: false }
                                        ]
                                    }
                                }
                            ]
                        },
                        {
                            title: 'Module 2: Loops — for & while',
                            order: 2,
                            description: 'Repeat actions efficiently using for and while loops and the range() function.',
                            lessons: [
                                {
                                    title: 'for Loop',
                                    type: 'reading',
                                    duration: '12:00',
                                    order: 1,
                                    content: `Loops repeat a block of code multiple times.

for Loop — used when the number of iterations is known:
for i in range(5):
    print(i)
Output: 0 1 2 3 4

Loop through a list:
fruits = ["Apple", "Mango", "Banana"]
for fruit in fruits:
    print(fruit)`
                                },
                                {
                                    title: 'while Loop & range()',
                                    type: 'reading',
                                    duration: '12:00',
                                    order: 2,
                                    content: `while Loop — used when condition decides repetition:
count = 1
while count <= 5:
    print(count)
    count += 1
Loop runs until condition becomes False.

⚠️ Infinite Loop Warning:
while True:
    print("Hello")
This runs forever unless stopped. Always make sure the loop condition will eventually become False.

range() Function — generates a sequence of numbers:
range(start, stop, step)

range(5)        → 0, 1, 2, 3, 4
range(2, 6)     → 2, 3, 4, 5
range(1, 10, 2) → 1, 3, 5, 7, 9
range(10, 0, -1)→ 10, 9, 8, ..., 1 (Reverse Loop)

Difference Between for and while:
- for: Fixed iterations, cleaner syntax
- while: Condition-based, more flexible`
                                },
                                {
                                    title: '3D Logic Visualizer: Loop Flow',
                                    type: 'visualizer',
                                    duration: '08:00',
                                    order: 3,
                                    threeJsBlock: {
                                        conceptName: 'Loop Carousel',
                                        visualDescription: 'Circular arrows showing loop repetition until condition fails.',
                                        pythonConcept: 'for-while-loops',
                                        interactionType: 'stepping',
                                        uiIntegrationHint: 'Show loop counter incrementing with condition check each round'
                                    }
                                },
                                {
                                    title: 'Challenge: Multiplication Table',
                                    type: 'coding',
                                    duration: '20:00',
                                    order: 4,
                                    codingChallenge: {
                                        problemStatement: 'Read a number from stdin. Print its multiplication table from 1 to 10, in format: "5 x 1 = 5".',
                                        starterCode: `import sys\nn = int(sys.stdin.read().strip())\n# Use a for loop to print the table`,
                                        language: 'python',
                                        solution: `import sys\nn = int(sys.stdin.read().strip())\nfor i in range(1, 11):\n    print(f"{n} x {i} = {n * i}")`,
                                        testCases: [
                                            { input: '5', output: '5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45\n5 x 10 = 50', isHidden: false }
                                        ]
                                    }
                                }
                            ,
                                {
                                    title: '3D Visualizer: Debug Microscope',
                                    type: 'visualizer',
                                    duration: '06:00',
                                    order: 4,
                                    threeJsBlock: {
                                        conceptName: 'Debug Microscope',
                                        visualDescription: 'A scanning beam moves line-by-line through code, highlighting logical errors in red — just like a debugger.',
                                        pythonConcept: 'debugging',
                                        interactionType: 'scanning',
                                        uiIntegrationHint: 'Watch the scanner beam identify error lines'
                                    }
                                }
                            ]
                        },
                        {
                            title: 'Module 3: Debugging Logical Errors',
                            order: 3,
                            description: 'Learn to identify and fix logical errors — the most common bug type for beginners.',
                            lessons: [
                                {
                                    title: 'Understanding Logical Errors',
                                    type: 'reading',
                                    duration: '15:00',
                                    order: 1,
                                    content: `Logical errors happen when code runs but gives wrong output. No syntax error — but wrong thinking.

Example of Logical Error:
age = 18
if age > 18:     ← Wrong! Should be >=
    print("Adult")

Problem: Age 18 should also be adult. Condition should be >=.

Fixed Version:
if age >= 18:
    print("Adult")

Common Logical Mistakes:
1. Wrong Operator: if a = 5  → Correct: if a == 5
2. Wrong Indentation: code runs outside the intended block
3. Wrong Loop Condition: while x < 5: x -= 1  → creates infinite loop

Debugging Tips:
- Use print() to check variable values: print("Current value:", x)
- Test with different inputs
- Read conditions slowly
- Break big problems into small steps`
                                },
                                {
                                    title: 'Challenge: Debug the Voting Check',
                                    type: 'coding',
                                    duration: '20:00',
                                    order: 2,
                                    codingChallenge: {
                                        problemStatement: 'A student wrote code that checks if age >= 18 is eligible to vote. Fix the logical error and print "Eligible to Vote" or "Not Eligible". Input is age from stdin.',
                                        starterCode: `import sys\nage = int(sys.stdin.read().strip())\n# The original buggy code used: if age > 18\n# Fix it to correctly include 18-year-olds\nif age > 18:\n    print("Eligible to Vote")\nelse:\n    print("Not Eligible")`,
                                        language: 'python',
                                        solution: `import sys\nage = int(sys.stdin.read().strip())\nif age >= 18:\n    print("Eligible to Vote")\nelse:\n    print("Not Eligible")`,
                                        testCases: [
                                            { input: '18', output: 'Eligible to Vote', isHidden: false },
                                            { input: '17', output: 'Not Eligible', isHidden: false },
                                            { input: '20', output: 'Eligible to Vote', isHidden: false }
                                        ]
                                    }
                                },
                                {
                                    title: 'Week 2 Assessment',
                                    type: 'quiz',
                                    duration: '15:00',
                                    order: 3,
                                    quizQuestions: [
                                        {
                                            question: 'What is a logical error?',
                                            options: ['Code that has a syntax mistake', 'Code that runs but gives wrong output', 'Code that crashes immediately', 'A missing indentation'],
                                            correctAnswer: 1,
                                            explanation: 'Logical errors occur when the code runs without crashing but produces incorrect results due to flawed logic.'
                                        },
                                        {
                                            question: 'What does range(1, 10, 2) generate?',
                                            options: ['1 2 3 4 5 6 7 8 9', '1 3 5 7 9', '2 4 6 8 10', '1 2 4 8'],
                                            correctAnswer: 1,
                                            explanation: 'range(1, 10, 2) starts at 1, goes to 9, with a step of 2: 1, 3, 5, 7, 9.'
                                        },
                                        {
                                            question: 'Which loop is best when iteration count is unknown?',
                                            options: ['for loop', 'while loop', 'do-while loop', 'repeat loop'],
                                            correctAnswer: 1,
                                            explanation: 'while loop is used when the number of iterations is not known — it keeps running as long as the condition is True.'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },

                // ─────────────────────────────────────────────
                // WEEK 3: Functions & Data Handling
                // ─────────────────────────────────────────────
                {
                    title: 'Week 3: Functions & Data Handling',
                    order: 3,
                    description: 'Master functions, lists, tuples, dictionaries, and string processing.',
                    modules: [
                        {
                            title: 'Module 1: Functions',
                            order: 1,
                            description: 'Write reusable, modular code using Python functions.',
                            lessons: [
                                {
                                    title: 'What is a Function?',
                                    type: 'reading',
                                    duration: '15:00',
                                    order: 1,
                                    content: `A function is a block of reusable code that performs a specific task. Instead of writing the same logic multiple times, you define it once and call it whenever needed.

Functions help in:
- Organizing code
- Reducing repetition
- Making debugging easier
- Building modular programs

Basic Syntax:
def function_name():
    print("Hello Python")

Explanation:
- def → keyword used to create a function
- function_name → chosen by programmer
- () → used for parameters (inputs)
- : → indicates start of function block
- Indented code → function body

Calling a Function:
def greet():
    print("Welcome")

greet()    ← This calls (runs) the function

The function runs ONLY when it is called.

Without functions:
print("Hello")
print("Hello")
print("Hello")

With function:
def say_hello():
    print("Hello")

say_hello()
say_hello()
say_hello()`
                                },
                                {
                                    title: 'Parameters & Return Values',
                                    type: 'reading',
                                    duration: '15:00',
                                    order: 2,
                                    content: `Parameters allow functions to work with different data.

Single Parameter:
def greet(name):
    print("Hello", name)

greet("Ali")   → name is the parameter, "Ali" is the argument

Multiple Parameters:
def add(a, b):
    print(a + b)

add(10, 5)

Return Values — sends a result back from a function:
def multiply(a, b):
    return a * b

result = multiply(4, 3)
print(result)   → Output: 12

print() vs return():
- print(): Displays output, cannot reuse result
- return: Sends value back, can store and reuse

Example:
value = multiply(2, 5)   ← this works only because of return`
                                },
                                {
                                    title: 'Challenge: Area Calculator',
                                    type: 'coding',
                                    duration: '25:00',
                                    order: 3,
                                    codingChallenge: {
                                        problemStatement: 'Write a function calculate_area(radius) that returns 3.14 * radius * radius. Read the radius from stdin and print the result.',
                                        starterCode: `import sys\nradius = float(sys.stdin.read().strip())\n\ndef calculate_area(radius):\n    # Write your logic here\n    pass\n\nprint(calculate_area(radius))`,
                                        language: 'python',
                                        solution: `import sys\nradius = float(sys.stdin.read().strip())\n\ndef calculate_area(radius):\n    return 3.14 * radius * radius\n\nprint(calculate_area(radius))`,
                                        testCases: [
                                            { input: '5', output: '78.5', isHidden: false },
                                            { input: '10', output: '314.0', isHidden: false }
                                        ]
                                    }
                                },
                                {
                                    title: 'Challenge: Temperature Converter',
                                    type: 'coding',
                                    duration: '20:00',
                                    order: 4,
                                    codingChallenge: {
                                        problemStatement: 'Write a function celsius_to_fahrenheit(c) that converts Celsius to Fahrenheit using formula: F = (C * 9/5) + 32. Read celsius from stdin and print the result.',
                                        starterCode: `import sys\nc = float(sys.stdin.read().strip())\n\ndef celsius_to_fahrenheit(c):\n    # Your formula here\n    pass\n\nprint(celsius_to_fahrenheit(c))`,
                                        language: 'python',
                                        solution: `import sys\nc = float(sys.stdin.read().strip())\n\ndef celsius_to_fahrenheit(c):\n    return (c * 9/5) + 32\n\nprint(celsius_to_fahrenheit(c))`,
                                        testCases: [
                                            { input: '0', output: '32.0', isHidden: false },
                                            { input: '100', output: '212.0', isHidden: false }
                                        ]
                                    }
                                }
                            ,
                                {
                                    title: '3D Visualizer: Function Portal',
                                    type: 'visualizer',
                                    duration: '07:00',
                                    order: 5,
                                    threeJsBlock: {
                                        conceptName: 'Function Portal',
                                        visualDescription: 'Input enters a glowing portal ring (def function), gets processed inside, then a different colored packet exits as the return value.',
                                        pythonConcept: 'functions-return',
                                        interactionType: 'flowing',
                                        uiIntegrationHint: 'See input-process-return visually'
                                    }
                                }
                            ]
                        },
                        {
                            title: 'Module 2: Lists & Tuples',
                            order: 2,
                            description: 'Store and manage collections of data using Python lists and tuples.',
                            lessons: [
                                {
                                    title: 'Python Lists',
                                    type: 'reading',
                                    duration: '15:00',
                                    order: 1,
                                    content: `Lists are ordered, changeable (mutable), and allow duplicates.

Creating a List:
numbers = [10, 20, 30]

Access Elements (0-indexed):
print(numbers[0])   → 10

Modify List:
numbers[1] = 50

Add Items:
numbers.append(40)

Remove Item:
numbers.remove(10)

Loop Through List:
for num in numbers:
    print(num)

Common List Methods:
- append(item): Add to end
- remove(item): Remove first occurrence
- len(list): Get length
- sort(): Sort in ascending order
- reverse(): Reverse the list`
                                },
                                {
                                    title: 'Python Tuples',
                                    type: 'reading',
                                    duration: '10:00',
                                    order: 2,
                                    content: `Tuples are like lists but immutable (cannot be changed after creation).

Creating a Tuple:
data = (1, 2, 3)

Access:
print(data[0])   → 1

Tuples cannot be modified after creation.

List vs Tuple:
- List: Mutable, Syntax [], Use for dynamic data
- Tuple: Immutable, Syntax (), Use for fixed/constant data

Use tuples when data should remain constant, e.g., coordinates, RGB colors.`
                                },
                                {
                                    title: 'Challenge: List Operations',
                                    type: 'coding',
                                    duration: '20:00',
                                    order: 3,
                                    codingChallenge: {
                                        problemStatement: 'Given a list of 5 numbers (read from stdin, one per line), print: 1) The sum of all numbers, 2) The largest number, 3) The list sorted in ascending order.',
                                        starterCode: `import sys\nlines = sys.stdin.read().split()\nnumbers = [int(x) for x in lines]\n# 1. Print sum\n# 2. Print max\n# 3. Print sorted list`,
                                        language: 'python',
                                        solution: `import sys\nlines = sys.stdin.read().split()\nnumbers = [int(x) for x in lines]\nprint(sum(numbers))\nprint(max(numbers))\nprint(sorted(numbers))`,
                                        testCases: [
                                            { input: '3\n1\n4\n1\n5', output: '14\n5\n[1, 1, 3, 4, 5]', isHidden: false }
                                        ]
                                    }
                                }
                            ,
                                {
                                    title: '3D Visualizer: List Array Train',
                                    type: 'visualizer',
                                    duration: '06:00',
                                    order: 4,
                                    threeJsBlock: {
                                        conceptName: 'List Array Train',
                                        visualDescription: 'Indexed 3D boxes chained like train cars represent list elements. Below: immutable tuple spheres locked in place.',
                                        pythonConcept: 'lists-tuples',
                                        interactionType: 'scrolling',
                                        uiIntegrationHint: 'Drag to see all list indices'
                                    }
                                }
                            ,
                                {
                                    title: '3D Visualizer: Dictionary Keymap',
                                    type: 'visualizer',
                                    duration: '06:00',
                                    order: 5,
                                    threeJsBlock: {
                                        conceptName: 'Dictionary Keymap',
                                        visualDescription: 'Key-value pairs orbit a central dict{} core. Each key panel is wired to its value — just like a Python dictionary.',
                                        pythonConcept: 'dictionaries-strings',
                                        interactionType: 'orbiting',
                                        uiIntegrationHint: 'Drag to inspect key-value pairs'
                                    }
                                }
                            ]
                        },
                        {
                            title: 'Module 3: Dictionaries & Strings',
                            order: 3,
                            description: 'Work with key-value data using dictionaries and master string manipulation.',
                            lessons: [
                                {
                                    title: 'Python Dictionaries',
                                    type: 'reading',
                                    duration: '15:00',
                                    order: 1,
                                    content: `Dictionaries store data in key-value pairs.

Real-world examples:
- Name → Age
- Product → Price

Creating a Dictionary:
student = {
    "name": "Sara",
    "age": 21,
    "course": "Python"
}

Access Value:
print(student["name"])   → Sara

Add or Update Value:
student["age"] = 22
student["city"] = "Mumbai"

Loop Through Dictionary:
for key, value in student.items():
    print(key, value)

Why Dictionaries Are Powerful:
- Fast data lookup
- Used in APIs and JSON
- Perfect for real-world structured data`
                                },
                                {
                                    title: 'String Processing',
                                    type: 'reading',
                                    duration: '15:00',
                                    order: 2,
                                    content: `Strings represent text data.

text = "Hello Python"

String Indexing:
print(text[0])    → H
print(text[-1])   → n

String Methods:
- text.upper()              → "HELLO PYTHON"
- text.lower()              → "hello python"
- len(text)                 → 12
- text.replace("Python", "World") → "Hello World"
- sentence.split(" ")       → splits into list of words

Join Strings:
"-".join(["I", "love", "coding"])   → "I-love-coding"

String Concatenation:
name = "Ali"
msg = "Hello " + name

f-Strings (Modern Formatting):
name = "Musif"
age = 21
print(f"My name is {name} and I am {age}")

f-strings are used heavily in modern Python and APIs!`
                                },
                                {
                                    title: 'Challenge: Student Profile',
                                    type: 'coding',
                                    duration: '20:00',
                                    order: 3,
                                    codingChallenge: {
                                        problemStatement: 'Create a dictionary with keys: name, age, city. Then print each key-value pair using a for loop in format "name: Musif".',
                                        starterCode: `# Create student dictionary\nstudent = {\n    "name": "Musif",\n    "age": 21,\n    "city": "Mumbai"\n}\n\n# Loop through and print\nfor key, value in student.items():\n    print(f"{key}: {value}")`,
                                        language: 'python',
                                        solution: `student = {\n    "name": "Musif",\n    "age": 21,\n    "city": "Mumbai"\n}\nfor key, value in student.items():\n    print(f"{key}: {value}")`,
                                        testCases: [
                                            { input: '', output: 'name: Musif\nage: 21\ncity: Mumbai', isHidden: false }
                                        ]
                                    }
                                },
                                {
                                    title: 'Week 3 Assessment',
                                    type: 'quiz',
                                    duration: '15:00',
                                    order: 4,
                                    quizQuestions: [
                                        {
                                            question: 'Which keyword is used to define a function in Python?',
                                            options: ['func', 'define', 'def', 'function'],
                                            correctAnswer: 2,
                                            explanation: 'Python uses "def" keyword to define functions.'
                                        },
                                        {
                                            question: 'What is the difference between a list and a tuple?',
                                            options: ['Lists use {} and tuples use []', 'Lists are immutable; tuples are mutable', 'Lists are mutable; tuples are immutable', 'There is no difference'],
                                            correctAnswer: 2,
                                            explanation: 'Lists can be changed (mutable), while tuples cannot be changed after creation (immutable).'
                                        },
                                        {
                                            question: 'What does f"Hello {name}" syntax do?',
                                            options: ['Creates a function', 'Creates a for loop', 'Embeds variable values inside strings', 'Defines a format class'],
                                            correctAnswer: 2,
                                            explanation: 'f-strings (formatted strings) allow you to embed variable values directly inside string literals.'
                                        },
                                        {
                                            question: 'How do you access a value by key in a dictionary?',
                                            options: ['dict.value("key")', 'dict["key"]', 'dict.get.key', 'dict->key'],
                                            correctAnswer: 1,
                                            explanation: 'Dictionary values are accessed using dict["key"] syntax.'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },

                // ─────────────────────────────────────────────
                // WEEK 4: Real-World CLI Development
                // ─────────────────────────────────────────────
                {
                    title: 'Week 4: Real-World CLI Development',
                    order: 4,
                    description: 'Build real command-line applications using file handling, error handling, and modular design.',
                    modules: [
                        {
                            title: 'Module 1: File Handling',
                            order: 1,
                            description: 'Store and retrieve data permanently using Python file operations.',
                            lessons: [
                                {
                                    title: 'What is File Handling?',
                                    type: 'reading',
                                    duration: '15:00',
                                    order: 1,
                                    content: `File handling allows programs to store and retrieve data permanently using files like .txt, .csv, or .json.

Without files: Data disappears when program closes.
With files: Data is saved and reused later.

Opening a File:
file = open("data.txt", "r")
Syntax: open("filename", "mode")

File Modes:
- "r" → Read file
- "w" → Write (overwrite existing content)
- "a" → Append data (add to existing content)
- "x" → Create new file

Reading from a File:
file = open("data.txt", "r")
content = file.read()
print(content)
file.close()

Read Line by Line:
for line in file:
    print(line)

Writing to a File:
file = open("data.txt", "w")
file.write("Hello Python")
file.close()
Note: "w" replaces old content!

Appending Data:
file = open("data.txt", "a")
file.write("\\nNew Line Added")
file.close()

Best Practice — Using with Statement (auto-closes file):
with open("data.txt", "r") as file:
    print(file.read())

Real Uses: Saving user data, logs, AI prompts, reports`
                                },
                                {
                                    title: 'Challenge: File Logger',
                                    type: 'coding',
                                    duration: '25:00',
                                    order: 2,
                                    codingChallenge: {
                                        problemStatement: 'Write to a file called "log.txt" the text "Session started". Then read the file and print its content.',
                                        starterCode: `# Write to file\nwith open("log.txt", "w") as f:\n    # Write "Session started"\n    pass\n\n# Read and print file content\nwith open("log.txt", "r") as f:\n    print(f.read())`,
                                        language: 'python',
                                        solution: `with open("log.txt", "w") as f:\n    f.write("Session started")\n\nwith open("log.txt", "r") as f:\n    print(f.read())`,
                                        testCases: [
                                            { input: '', output: 'Session started', isHidden: false }
                                        ]
                                    }
                                }
                            ,
                                {
                                    title: '3D Visualizer: File Cabinet',
                                    type: 'visualizer',
                                    duration: '06:00',
                                    order: 3,
                                    threeJsBlock: {
                                        conceptName: 'File Cabinet',
                                        visualDescription: 'Animated 3D drawers open and close to show file modes: r (read), w (write), a (append), x (create).',
                                        pythonConcept: 'file-handling',
                                        interactionType: 'toggling',
                                        uiIntegrationHint: 'Watch drawers open for each file mode'
                                    }
                                }
                            ]
                        },
                        {
                            title: 'Module 2: Error Handling & Modular Design',
                            order: 2,
                            description: 'Build robust programs with try/except and organize code into reusable modules.',
                            lessons: [
                                {
                                    title: 'Error Handling with try/except',
                                    type: 'reading',
                                    duration: '15:00',
                                    order: 1,
                                    content: `Errors (exceptions) happen when something goes wrong during execution.
Common examples: Dividing by zero, File not found, Wrong input type.
Without handling → program crashes.

Basic try/except Syntax:
try:
    x = 10 / 0
except:
    print("An error occurred")

Handling Specific Errors:
try:
    num = int(input("Enter number: "))
except ValueError:
    print("Invalid input")

Multiple Exceptions:
try:
    file = open("data.txt")
except FileNotFoundError:
    print("File not found")
except PermissionError:
    print("No permission")

Using else and finally:
try:
    x = 5 / 1
except:
    print("Error")
else:
    print("Success")
finally:
    print("Execution finished")

- else → runs if no error
- finally → always runs (for cleanup)

Why Error Handling is Important:
- Prevents crashes
- Improves user experience
- Required in real-world apps`
                                },
                                {
                                    title: 'Modular Programming',
                                    type: 'reading',
                                    duration: '12:00',
                                    order: 2,
                                    content: `Instead of writing everything in one file, divide the program into small modules (separate files).

Benefits: Easy maintenance, Code reuse, Cleaner structure.

Creating a Module (File: math_utils.py):
def add(a, b):
    return a + b

Using the Module (in main.py):
import math_utils
print(math_utils.add(5, 3))

Import Methods:
1. Import entire module: import math_utils
2. Import specific function: from math_utils import add
3. Rename module: import math_utils as mu

Why Modular Structure Matters:
Especially useful for large projects like Web apps, AI systems, Automation tools.`
                                },
                                {
                                    title: 'Introduction to Automation',
                                    type: 'reading',
                                    duration: '12:00',
                                    order: 3,
                                    content: `Automation means using Python to perform repetitive tasks automatically.

Examples:
- Renaming files
- Sending emails
- Scraping websites
- Data processing
- Report generation

Simple Automation — List files in a folder:
import os
files = os.listdir()
for file in files:
    print(file)

Automation — Reading Data from File:
with open("data.txt", "r") as file:
    for line in file:
        print(line.strip())

Popular Automation Libraries:
- os → file system tasks
- shutil → file operations
- requests → API calls
- selenium → browser automation
- pandas → data automation`
                                },
                                {
                                    title: 'Challenge: Safe Divider',
                                    type: 'coding',
                                    duration: '20:00',
                                    order: 4,
                                    codingChallenge: {
                                        problemStatement: 'Read two numbers from stdin (a and b). Print the result of a / b. If b is 0, print "Cannot divide by zero" (use try/except).',
                                        starterCode: `import sys\nlines = sys.stdin.read().split()\na = float(lines[0])\nb = float(lines[1])\n\ntry:\n    # Division logic here\n    pass\nexcept ZeroDivisionError:\n    print("Cannot divide by zero")`,
                                        language: 'python',
                                        solution: `import sys\nlines = sys.stdin.read().split()\na = float(lines[0])\nb = float(lines[1])\n\ntry:\n    print(a / b)\nexcept ZeroDivisionError:\n    print("Cannot divide by zero")`,
                                        testCases: [
                                            { input: '10\n2', output: '5.0', isHidden: false },
                                            { input: '7\n0', output: 'Cannot divide by zero', isHidden: false }
                                        ]
                                    }
                                }
                            ,
                                {
                                    title: '3D Visualizer: Try-Except Shield',
                                    type: 'visualizer',
                                    duration: '07:00',
                                    order: 5,
                                    threeJsBlock: {
                                        conceptName: 'Try-Except Shield',
                                        visualDescription: 'Error projectiles fly toward a hexagonal shield (except block). The shield catches them — preventing program crash.',
                                        pythonConcept: 'try-except-error-handling',
                                        interactionType: 'animated',
                                        uiIntegrationHint: 'Watch error exceptions being caught by the shield'
                                    }
                                }
                            ]
                        },
                        {
                            title: 'Module 3: Capstone — CLI To-Do Application',
                            order: 3,
                            description: 'Combine all your knowledge into a working command-line to-do application.',
                            lessons: [
                                {
                                    title: 'Project Overview: CLI To-Do App',
                                    type: 'reading',
                                    duration: '10:00',
                                    order: 1,
                                    content: `Your Capstone Project: Build a Command-Line To-Do Application.

This project combines EVERYTHING you've learned:
- Variables & Data Types (Week 1)
- Conditionals & Loops (Week 2)
- Functions & Lists (Week 3)
- File Handling & Error Handling (Week 4)

Features your app must have:
1. Add a task
2. View all tasks
3. Mark a task as complete
4. Save tasks to a file (persistence)
5. Handle errors gracefully

Architecture:
- main.py → Entry point, menu loop
- tasks.py → Functions: add_task, view_tasks, complete_task
- data.txt → Persistent task storage

This structure demonstrates modular programming!`
                                },
                                {
                                    title: 'Project Submission',
                                    type: 'project',
                                    duration: '02:00:00',
                                    order: 2,
                                    projectConfig: {
                                        repoRequirements: ['main.py (entry point)', 'tasks.py (task functions)', 'README.md'],
                                        minCommits: 5
                                    },
                                    content: 'Submit your GitHub repository link. Your project will be evaluated on functionality, code structure, and use of modular design.'
                                },
                                {
                                    title: 'Final Assessment',
                                    type: 'quiz',
                                    duration: '30:00',
                                    order: 3,
                                    quizQuestions: [
                                        {
                                            question: 'Which mode opens a file to ADD content without deleting existing data?',
                                            options: ['"w"', '"r"', '"a"', '"x"'],
                                            correctAnswer: 2,
                                            explanation: '"a" (append) mode adds new content to the end of the file without deleting existing content.'
                                        },
                                        {
                                            question: 'What does the finally block do in try/except?',
                                            options: ['Runs only if there is an error', 'Runs only if there is no error', 'Always runs, regardless of error', 'Stops the program'],
                                            correctAnswer: 2,
                                            explanation: 'The finally block always executes, whether an exception occurred or not. It\'s used for cleanup operations.'
                                        },
                                        {
                                            question: 'What is the benefit of modular programming?',
                                            options: ['Makes code slower', 'Enables code reuse and easier maintenance', 'Makes code harder to read', 'Requires more lines of code'],
                                            correctAnswer: 1,
                                            explanation: 'Modular programming divides code into separate files/functions for easier maintenance, reuse, and collaboration.'
                                        },
                                        {
                                            question: 'Which Python library is used for file system tasks like listing directories?',
                                            options: ['sys', 'os', 'json', 'math'],
                                            correctAnswer: 1,
                                            explanation: 'The os module provides functions for interacting with the operating system, including listing files and directories.'
                                        },
                                        {
                                            question: 'What is the correct way to open a file safely in Python?',
                                            options: ['file = open("data.txt")', 'with open("data.txt", "r") as file:', 'file.open("data.txt", "r")', 'open.file("data.txt")'],
                                            correctAnswer: 1,
                                            explanation: 'Using "with open()" is the best practice as it automatically closes the file when done, preventing resource leaks.'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        await pythonCourse.save();
        console.log(`✅ Course "${pythonCourse.title}" (slug: ${pythonCourse.slug}) successfully seeded!`);
        console.log(`📚 Total Weeks: ${pythonCourse.weeks.length}`);
        pythonCourse.weeks.forEach(week => {
            let lessonCount = 0;
            week.modules.forEach(m => lessonCount += m.lessons.length);
            console.log(`   ${week.title}: ${week.modules.length} modules, ${lessonCount} lessons`);
        });

        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
};

seedPythonBeginnersMaster();
