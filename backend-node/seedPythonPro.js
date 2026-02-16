const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => console.error(err));

const seedPythonCourse = async () => {
    try {
        // 1. Find or Create Instructor
        let instructor = await User.findOne({ email: 'instructor@demo.com' });
        if (!instructor) {
            try {
                instructor = await User.create({
                    name: 'Demo Instructor',
                    email: 'instructor@demo.com',
                    password: 'password123',
                    role: 'instructor'
                });
            } catch (e) {
                instructor = await User.findOne({ email: 'instructor@demo.com' });
            }
        }

        // 2. Clear existing demo course if exists
        await Course.deleteOne({ title: 'Python 0 to Pro' });

        // 3. Create Course Object
        const course = new Course({
            title: 'Python 0 to Pro',
            subtitle: 'Master the fundamentals of Python in just one week.',
            description: 'A comprehensive demo course covering Python syntax, variables, and basic logic.',
            fullDescription: 'This course is designed to validate the SkillBridge learning workflow. It includes video lessons, reading materials, interactive quizzes, and real-time coding challenges.',
            category: 'Programming',
            level: 'Beginner',
            price: 0,
            instructor: instructor._id,
            image: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg',
            isPublished: true,
            tags: ['Python', 'Demo', 'Basics'],
            weeks: [
                {
                    title: 'Week 1: Python Foundations',
                    order: 1,
                    description: 'Introduction to Python environment and syntax.',
                    modules: [
                        {
                            title: 'Module 1: Introduction to Python',
                            order: 1,
                            description: 'Setting up and understanding Python.',
                            lessons: [
                                {
                                    title: 'Python Tutorial for Absolute Beginners',
                                    type: 'video',
                                    duration: '3600', // 1 hour (approx from video link)
                                    videoUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
                                    order: 1,
                                    content: 'Introduction to Python language history and usage.'
                                },
                                {
                                    title: 'Python Installation and Setup',
                                    type: 'reading',
                                    duration: '600',
                                    order: 2,
                                    content: '<h2>Installing Python</h2><p>Go to python.org and download the latest version for your OS.</p><h3>VS Code Setup</h3><p>Install the Python extension for VS Code.</p>'
                                },
                                {
                                    title: 'Quiz: Python Basics',
                                    type: 'quiz',
                                    duration: '300',
                                    order: 3,
                                    quizQuestions: [
                                        {
                                            question: 'Which of these is a valid Python variable?',
                                            options: ['1num', 'my_var', 'my-var', 'var@'],
                                            correctAnswer: 1, // Index of 'my_var'
                                            explanation: 'Variable names cannot start with numbers or symbols other than underscore, and cannot contain hyphens or @.'
                                        },
                                        {
                                            question: 'What is the correct file extension for Python files?',
                                            options: ['.py', '.python', '.pt', '.p'],
                                            correctAnswer: 0,
                                            explanation: 'Python files use the .py extension.'
                                        }
                                    ]
                                },
                                {
                                    title: 'Coding: Hello World',
                                    type: 'coding',
                                    duration: '900',
                                    order: 4,
                                    codingChallenge: {
                                        problemStatement: 'Write a program that prints "Hello SkillBridge" to the console.',
                                        starterCode: 'def solve():\n    # Write code here\n    pass',
                                        language: 'python',
                                        solution: 'def solve():\n    print("Hello SkillBridge")',
                                        testCases: [
                                            { input: '', output: 'Hello SkillBridge', isHidden: false }
                                        ]
                                    }
                                }
                            ]
                        },
                        {
                            title: 'Module 2: Variables & Data Types',
                            order: 2,
                            description: 'Understanding data storage.',
                            lessons: [
                                {
                                    title: 'Python Variables and Data Types',
                                    type: 'video',
                                    duration: '900', // 15 mins approx
                                    videoUrl: 'https://www.youtube.com/watch?v=kIiJbYGcJJA',
                                    order: 1
                                },
                                {
                                    title: 'Quiz: Data Types',
                                    type: 'quiz',
                                    duration: '300',
                                    order: 2,
                                    quizQuestions: [
                                        {
                                            question: 'What is the type of 5.5?',
                                            options: ['int', 'float', 'str', 'bool'],
                                            correctAnswer: 1
                                        },
                                        {
                                            question: 'How do you create a string variable?',
                                            options: ['x = 5', 'x = "Hello"', 'x = True', 'x = [1,2]'],
                                            correctAnswer: 1
                                        }
                                    ]
                                },
                                {
                                    title: 'Coding: Temperature Converter',
                                    type: 'coding',
                                    duration: '1200',
                                    order: 3,
                                    codingChallenge: {
                                        problemStatement: 'Convert Celsius to Fahrenheit.\nFormula: (C * 9/5) + 32\nPrint the result for input 100.',
                                        starterCode: 'def convert(c):\n    # Return the value\n    return 0\n\nprint(convert(100))',
                                        language: 'python',
                                        testCases: [
                                            { input: '100', output: '212.0', isHidden: false }
                                        ]
                                    }
                                }
                            ]
                        },
                        {
                            title: 'Module 3: Logic & Control Flow',
                            order: 3,
                            description: 'Making decisions with flow.',
                            lessons: [
                                {
                                    title: 'Python Conditions & Loops',
                                    type: 'video',
                                    duration: '1200', // 20 mins
                                    videoUrl: 'https://www.youtube.com/watch?v=Z1Yd7upQsXY',
                                    order: 1
                                },
                                {
                                    title: 'Quiz: Logic Gates',
                                    type: 'quiz',
                                    duration: '300',
                                    order: 2,
                                    quizQuestions: [
                                        {
                                            question: 'What is the output of: if True: print("Yes")',
                                            options: ['Yes', 'No', 'True', 'Error'],
                                            correctAnswer: 0
                                        }
                                    ]
                                },
                                {
                                    title: 'Coding: Even or Odd',
                                    type: 'coding',
                                    duration: '600',
                                    order: 3,
                                    codingChallenge: {
                                        problemStatement: 'Check if number n is even or odd.\nPrint "Even" or "Odd".',
                                        starterCode: 'def solve(n):\n    # Write logic here\n    pass\n\nsolve(5)',
                                        language: 'python',
                                        testCases: [
                                            { input: '2', output: 'Even', isHidden: false },
                                            { input: '3', output: 'Odd', isHidden: false }
                                        ]
                                    }
                                }
                            ]
                        },
                        {
                            title: 'Module 4: Text-First Learning (New)',
                            order: 4,
                            description: 'Experiencing the new text-based learning system.',
                            lessons: [
                                {
                                    title: 'Mastering Lists & Dictionaries',
                                    type: 'reading',
                                    duration: '900', // 15 mins
                                    order: 1,
                                    content: `
# Python Collections: Lists & Dictionaries

In Python, we often need to store groups of data. Detailed text-based learning allows you to read code, copy examples, and simpler progress tracking.

## 1. Lists
Lists are ordered sequences that can hold a variety of object types. They use \`[]\` brackets.

\`\`\`python
my_list = [1, 2, 3]
print(my_list[0]) # Output: 1
\`\`\`

### Common Operations
* **Append**: \`list.append(item)\`
* **Pop**: \`list.pop()\`
* **Sort**: \`list.sort()\`

## 2. Dictionaries
Dictionaries are unordered mappings for storing objects. PREVIOUSLY known as hash tables. They use \`{}\` brackets and \`key:value\` pairs.

\`\`\`python
my_dict = {'key1': 'value1', 'key2': 'value2'}
print(my_dict['key1']) # Output: value1
\`\`\`

> **Note:** Dictionaries are optimized for retrieving data. Known as O(1) time complexity lookup.

## Interactive Check
Try to create a list of your favorite fruits in the editor next!
                                    `
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        await course.save();
        console.log(`Course "${course.title}" created successfully with ID: ${course._id}`);
        process.exit();

    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedPythonCourse();
