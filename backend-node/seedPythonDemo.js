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
        let instructor = await User.findOne({ email: 'instructor@skillbridge.com' });
        if (!instructor) {
            instructor = await User.create({
                name: 'Demo Instructor',
                email: 'instructor@demo.com',
                password: 'password123',
                role: 'instructor'
            });
        }

        // 2. Clear existing demo course if exists
        await Course.deleteOne({ title: 'Python Basics (Demo)' });

        // 3. Create Course Object
        const course = new Course({
            title: 'Python Basics (Demo)',
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
                    title: 'Week 1: Getting Started with Python',
                    order: 1,
                    description: 'Introduction to Python environment and syntax.',
                    modules: [
                        {
                            title: 'Module 1: Introduction',
                            order: 1,
                            description: 'Setting up and understanding Python.',
                            lessons: [
                                {
                                    title: 'What is Python?',
                                    type: 'video',
                                    duration: '300', // 5 mins
                                    videoUrl: 'https://www.youtube.com/watch?v=kqtD5dpn9C8', // Placeholder
                                    order: 1,
                                    content: 'Introduction to Python language history and usage.'
                                },
                                {
                                    title: 'Installation Guide',
                                    type: 'reading',
                                    duration: '600',
                                    order: 2,
                                    content: '<h2>Installing Python</h2><p>Go to python.org and download the latest version...</p>'
                                },
                                {
                                    title: 'Basics MCQ',
                                    type: 'quiz',
                                    duration: '300',
                                    order: 3,
                                    quizQuestions: [
                                        {
                                            question: 'Which of the following is a valid variable name?',
                                            options: ['1var', 'my_var', 'var-name', 'class'],
                                            correctAnswer: 1, // Index of 'my_var'
                                            explanation: 'Variable names cannot start with numbers or symbols other than underscore.'
                                        },
                                        {
                                            question: 'Python is an interpreted language.',
                                            options: ['True', 'False'],
                                            correctAnswer: 0,
                                            explanation: 'Yes, Python code is executed line by line.'
                                        }
                                    ]
                                },
                                {
                                    title: 'Print Hello World',
                                    type: 'coding',
                                    duration: '900',
                                    order: 4,
                                    codingChallenge: {
                                        problemStatement: 'Write a program that prints "Hello SkillBridge" to the console.',
                                        starterCode: 'def main():\n    # Write code here\n    pass',
                                        language: 'python',
                                        solution: 'def main():\n    print("Hello SkillBridge")',
                                        testCases: [
                                            { input: '', output: 'Hello SkillBridge', isHidden: false }
                                        ]
                                    }
                                }
                            ]
                        },
                        {
                            title: 'Module 2: Variables',
                            order: 2,
                            description: 'Understanding data storage.',
                            lessons: [
                                {
                                    title: 'Variables & Types',
                                    type: 'video',
                                    duration: '400',
                                    videoUrl: 'https://www.youtube.com/watch?v=KHC5nJbRxk',
                                    order: 1
                                },
                                {
                                    title: 'Data Types Quiz',
                                    type: 'quiz',
                                    duration: '300',
                                    order: 2,
                                    quizQuestions: [
                                        {
                                            question: 'What is the type of 5.5?',
                                            options: ['int', 'float', 'str', 'bool'],
                                            correctAnswer: 1
                                        }
                                    ]
                                },
                                {
                                    title: 'Temperature Converter',
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
