const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');
const User = require('./models/User');

dotenv.config();

const seedPythonBeginners = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected.');

        // 1. Find or Create Instructor
        let instructor = await User.findOne({ role: 'admin' });
        if (!instructor) {
            instructor = await User.create({
                name: 'Python Expert',
                email: 'python.expert@skillbridge.ai',
                password: 'password123',
                role: 'instructor',
                isVerified: true
            });
        }

        // 2. Clear existing course with same title if any
        await Course.deleteOne({ title: 'Python Full Course for Beginners' });

        // 3. Define Course Structure
        const pythonCourse = new Course({
            title: 'Python Full Course for Beginners',
            subtitle: 'Go from absolute zero to building your own Python applications.',
            description: 'This comprehensive course covers everything you need to start your journey as a Python developer. No prior programming experience required.',
            fullDescription: 'Python is a high-level, interpreted, general-purpose programming language. Its design philosophy emphasizes code readability with the use of significant indentation. This course is meticulously designed for absolute beginners, taking you through the basics of syntax, variables, and data types, all the way to complex functions, file handling, and project development.',
            category: 'Programming',
            level: 'Beginner',
            price: 2999,
            originalPrice: 5999,
            instructor: instructor._id,
            image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80',
            isPublished: true,
            tags: ['Python', 'Programming', 'Backend', 'Foundations'],
            features: [
                '50+ Hours of Content',
                'Interactive Coding Labs',
                'Real-world Projects',
                'Certificate of Completion',
                'Quizzes and Assignments'
            ],
            weeks: [
                {
                    title: 'Week 1: Introduction & Environment Setup',
                    order: 1,
                    description: 'Get your machine ready and write your first line of Python code.',
                    modules: [
                        {
                            title: 'Module 1: Welcome to the World of Python',
                            order: 1,
                            description: 'Overview of Python and why it is so popular.',
                            lessons: [
                                {
                                    title: 'What is Python?',
                                    type: 'reading',
                                    duration: '10:00',
                                    order: 1,
                                    content: 'Introduction to Python and its applications.'
                                },
                                {
                                    title: 'Setting up Python on Windows/Mac/Linux',
                                    type: 'reading',
                                    duration: '15:00',
                                    order: 2,
                                    content: `
# Setting up Your Python Environment

To start coding in Python, you need two main things:
1. **The Python Interpreter**: This is what runs your code.
2. **An IDE or Text Editor**: This is where you write your code. We recommend **VS Code**.

### Step 1: Install Python
- Go to [python.org](https://www.python.org/downloads/)
- Click the download button for your OS.
- **Important**: On Windows, check the box that says "Add Python to PATH" during installation.

### Step 2: Install VS Code
- Go to [code.visualstudio.com](https://code.visualstudio.com/)
- Download and install.
- Open VS Code and install the **Python Extension** by Microsoft.
                                    `
                                },
                                {
                                    title: 'Quiz: Introduction Basics',
                                    type: 'quiz',
                                    duration: '05:00',
                                    order: 3,
                                    quizQuestions: [
                                        {
                                            question: 'Who created Python?',
                                            options: ['Guido van Rossum', 'James Gosling', 'Dennis Ritchie', 'Bjarne Stroustrup'],
                                            correctAnswer: 0,
                                            explanation: 'Guido van Rossum created Python in the late 1980s.'
                                        },
                                        {
                                            question: 'Is Python case-sensitive?',
                                            options: ['Yes', 'No'],
                                            correctAnswer: 0,
                                            explanation: 'Yes, "Variable" and "variable" are different in Python.'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    title: 'Week 2: Variables & Core Data Types',
                    order: 2,
                    description: 'Learning how Python stores and manipulates data.',
                    modules: [
                        {
                            title: 'Module 2: Numbers and Strings',
                            order: 1,
                            description: 'The building blocks of data.',
                            lessons: [
                                {
                                    title: 'Variables and Memory',
                                    type: 'reading',
                                    duration: '15:00',
                                    order: 1,
                                    content: 'Understanding how Python handles variables and memory management.'
                                },
                                {
                                    title: 'Coding: Simple Calculations',
                                    type: 'coding',
                                    duration: '20:00',
                                    order: 2,
                                    codingChallenge: {
                                        problemStatement: 'Calculate the area of a circle with radius 7. (Area = 3.14 * r * r). Store the result in a variable named "area" and print it.',
                                        starterCode: 'def solve():\n    radius = 7\n    # Your code here\n    pass',
                                        language: 'python',
                                        solution: 'def solve():\n    radius = 7\n    area = 3.14 * radius * radius\n    print(area)',
                                        testCases: [
                                            { input: '', output: '153.86', isHidden: false }
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    title: 'Week 3: Control Flow - Decisions & Loops',
                    order: 3,
                    description: 'Making your programs smart with logic.',
                    modules: [
                        {
                            title: 'Module 3: If-Else & For-While Loops',
                            order: 1,
                            description: 'Controlling the execution of your code.',
                            lessons: [
                                {
                                    title: 'Conditional Logic in Python',
                                    type: 'reading',
                                    duration: '25:00',
                                    order: 1,
                                    content: 'Mastering conditional logic and branching in your Python programs.'
                                },
                                {
                                    title: 'The "If" Statement Guide',
                                    type: 'reading',
                                    duration: '10:00',
                                    order: 2,
                                    content: `
# Logic and Decisions

Python uses \`if\`, \`elif\`, and \`else\` to make decisions.

\`\`\`python
age = 18
if age >= 18:
    print("You can vote!")
else:
    print("Too young to vote.")
\`\`\`

### Logical Operators
- \`and\`: Both conditions must be true.
- \`or\`: At least one condition must be true.
- \`not\`: Reverses the result.
                                    `
                                },
                                {
                                    title: 'Coding Challenge: Number Checker',
                                    type: 'coding',
                                    duration: '15:00',
                                    order: 3,
                                    codingChallenge: {
                                        problemStatement: 'Write a function that takes a number and prints "Positive" if it is > 0, "Negative" if < 0, and "Zero" if it is exactly 0.',
                                        starterCode: 'def check_number(n):\n    # Write logic here\n    pass',
                                        language: 'python',
                                        testCases: [
                                            { input: '10', output: 'Positive', isHidden: false },
                                            { input: '-5', output: 'Negative', isHidden: false },
                                            { input: '0', output: 'Zero', isHidden: false }
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        await pythonCourse.save();
        console.log(`\u2705 Course "${pythonCourse.title}" successfully seeded!`);

        process.exit(0);
    } catch (err) {
        console.error('\u274c Seeding failed:', err);
        process.exit(1);
    }
};

seedPythonBeginners();
