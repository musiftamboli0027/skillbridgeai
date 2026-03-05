const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');
const User = require('./models/User');

dotenv.config({ path: './.env' });

const seedPythonUltimate = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        let instructor = await User.findOne({ role: 'admin' });
        if (!instructor) instructor = await User.findOne({});
        if (!instructor) {
            console.error('No instructor found. Seed failed.');
            process.exit(1);
        }

        const title = "Python Core: The 4-Week Logic Bootcamp";
        console.log(`Clearing existing ${title}...`);
        await Course.deleteMany({ title: title });

        const courseData = {
            title: title,
            subtitle: "Master logic and problem solving with Python - Designed for Absolute Beginners.",
            description: "Go from zero coding knowledge to building real applications in 4 weeks. Practical, structured, and platform-ready.",
            fullDescription: "Built for college students with zero programming experience. This course focuses on logic first, syntax second. Includes 3D visualizations and an intelligent AI Tutor system.",
            category: "Programming",
            level: "Beginner",
            price: 2499,
            originalPrice: 5999,
            instructor: instructor._id,
            image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200",
            features: ["Expert Instructed", "3D Logic Visualizations", "AI-Powered", "Certificate"],
            tags: ["Python", "Logic", "Beginner", "Bootcamp"],
            isPublished: true,
            isFeatured: true,

            assessmentModel: {
                codingWeightage: "60%",
                mcqWeightage: "40%"
            },

            aiTutorSystem: {
                logicMirroringExamples: [
                    "Ask: 'How would you calculate average on paper?' before giving code.",
                    "If a loop fails: 'Is the condition ever becoming False?'"
                ],
                indentationAlertBehavior: "Highlight red line if colon is found without subsequent spacing.",
                syntaxHintRules: [
                    "Detect str + int mixing and suggest int()",
                    "Check for missing colons in def/if/for"
                ]
            },

            weeks: [
                {
                    weekNumber: 1,
                    title: "Week 1: The Python Launchpad",
                    order: 1,
                    description: "Mastering the foundations of Input, Output, and Variables.",
                    modules: [
                        {
                            title: "Foundations & Interaction",
                            order: 1,
                            lessons: [
                                {
                                    title: "Introduction to Python",
                                    type: "reading",
                                    order: 1,
                                    duration: "10:00",
                                    content: "# What is Python?\n\nPython is a high-level, interpreted programming language that is famous for being extremely easy to read. Unlike other languages that use complex symbols, Python uses plain English keywords, making it the perfect first language for humans.\n\n### Where is it used?\n*   **Artificial Intelligence**: Powering ChatGPT and self-driving cars.\n*   **Web Development**: Building the backends of Instagram and Spotify.\n*   **Data Science**: Analyzing massive amounts of data for NASA and banks.\n*   **Automation**: Writing scripts to do your boring daily tasks for you.",
                                    expectedSkills: ["Understand what Python is", "Identify Python use cases"]
                                },
                                {
                                    title: "Installation & Setup",
                                    type: "reading",
                                    order: 2,
                                    duration: "15:00",
                                    content: "# Setting Up Your Lab\n\nTo write Python, you need two things: The **Python Interpreter** (the brain) and a **Code Editor** (the notepad).\n\n### 1. Download Python\n*   Visit [python.org/downloads](https://www.python.org/downloads/)\n*   Download the latest version for your OS (Windows, macOS, or Linux).\n*   **CRITICAL**: On Windows, check the box that says **\"Add Python to PATH\"** during installation.\n\n### 2. Choose Your Editor\nWhile you can use notepad, professionals use:\n*   **VS Code**: Most popular, versatile, and free.\n*   **PyCharm**: Built specifically for heavy Python development.\n*   **SkillBridge Editor**: You can also use our built-in interactive editor for these lessons!",
                                    expectedSkills: ["Install Python correctly", "Configure Environment Path"]
                                },
                                {
                                    title: "The print() Function",
                                    type: "reading",
                                    order: 3,
                                    duration: "15:00",
                                    content: "# Communicating with the World\n\nIn Python, we use the `print()` function to show output on the screen.\n\n```python\nprint(\"Hello Students\")\n```\nEverything inside the quotes `\" \"` will be displayed exactly as it is.",
                                    threeJsBlock: {
                                        conceptName: "The Input Portal",
                                        visualDescription: "A floating input box in 3D space. When user enters text, it appears above a glowing cube.",
                                        pythonConcept: "input() and output flow",
                                        interactionType: "Typing triggers animation showing data moving into cube."
                                    }
                                },
                                {
                                    title: "Variables: Your Storage Boxes",
                                    type: "reading",
                                    order: 4,
                                    duration: "20:00",
                                    content: "# Storing Data\n\nVariables are like boxes that store values for later use.\n\n```python\nname = \"Rahul\"\nage = 18\n```\nHere `name` is a variable holding text, and `age` is holding a number.",
                                    threeJsBlock: {
                                        conceptName: "Variable Scope",
                                        visualDescription: "Interactive 3D representation of Global vs Local memory stacks.",
                                        pythonConcept: "Variables and Scope",
                                        interactionType: "Toggle between contexts to see variable persistence."
                                    }
                                }
                            ]
                        },
                        {
                            title: "Data Types & Logic",
                            order: 2,
                            lessons: [
                                {
                                    title: "Understanding Data Types",
                                    type: "reading",
                                    order: 1,
                                    duration: "20:00",
                                    content: "# Different Types for Different Data\n\nPython needs to know what kind of data you are using:\n\n*   **int**: Whole numbers (like 25)\n*   **float**: Decimal numbers (like 3.5)\n*   **string**: Text inside quotes (like \"Python\")\n*   **bool**: True or False values",
                                    threeJsBlock: {
                                        conceptName: "Data Type Shapes",
                                        visualDescription: "Different shapes represent types: Sphere = int, Cube = string, Pyramid = bool.",
                                        pythonConcept: "Visualizing data types",
                                        interactionType: "Student clicks type -> shape highlights."
                                    }
                                },
                                {
                                    title: "Interactive Logic Visualizer",
                                    type: "visualizer",
                                    order: 2,
                                    duration: "10:00",
                                    content: "Interact with the 3D logic flow to understand how decisions are made in code. Observe how different inputs change the execution branch."
                                },
                                {
                                    title: "AI Logic Playground",
                                    type: "playground",
                                    order: 3,
                                    duration: "15:00",
                                    content: "Experiment with logic in our interactive playground. The AI Tutor is here to help you understand your code structure."
                                },
                                {
                                    title: "Debugging & Common Pitfalls",
                                    type: "reading",
                                    order: 4,
                                    duration: "15:00",
                                    content: "# Fixing Your Code\n\nLearning to debug is a superpower. Always look at the error message!",
                                    debuggingBlock: {
                                        wrongCode: "age = input(\"Enter age\")\nprint(age + 10)",
                                        correctedCode: "age = int(input(\"Enter age\"))\nprint(age + 10)",
                                        explanation: "input() always returns text (string). To perform math, you must convert it to an integer using int()."
                                    }
                                },
                                {
                                    title: "Week 1 Knowledge Check",
                                    type: "quiz",
                                    order: 5,
                                    duration: "10:00",
                                    content: "Test your understanding of Week 1 concepts.",
                                    quizQuestions: [
                                        {
                                            question: "Which function prints output?",
                                            options: ["input()", "print()", "show()", "echo()"],
                                            correctAnswer: 1
                                        },
                                        {
                                            question: "Which of these is a string?",
                                            options: ["25", "\"Python\"", "True", "3.5"],
                                            correctAnswer: 1
                                        },
                                        {
                                            question: "What does a variable store?",
                                            options: ["Images", "Values", "Internet", "Hardware"],
                                            correctAnswer: 1
                                        },
                                        {
                                            question: "input() function returns what type by default?",
                                            options: ["int", "float", "string", "bool"],
                                            correctAnswer: 2
                                        },
                                        {
                                            question: "How do you start a comment in Python?",
                                            options: ["//", "#", "--", "!!"],
                                            correctAnswer: 1
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    miniChallenge: "Create a program that asks for a user's name and age, then prints: 'Hello <name>, you are <age> years old.'",
                    expectedSkills: [
                        "Write basic Python scripts",
                        "Use variables correctly",
                        "Take input from users",
                        "Identify data types",
                        "Fix simple syntax errors"
                    ]
                }
            ]
        };

        await Course.create(courseData);
        console.log('Successfully seeded Week 1 of the 4-Week Python Logic Bootcamp.');
        process.exit();

    } catch (err) {
        console.error('Seed Error:', err);
        process.exit(1);
    }
};

seedPythonUltimate();
