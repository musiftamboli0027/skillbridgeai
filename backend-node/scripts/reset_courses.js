const mongoose = require('mongoose');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Submission = require('../models/Submission');
const Payment = require('../models/Payment');

const MONGODB_URI = 'mongodb+srv://23sc114502014_db_user:Skillbridge00@cluster0.abcwwdc.mongodb.net/skillbridge?appName=Cluster0';

const reset = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Delete all
        await Course.deleteMany({});
        await Enrollment.deleteMany({});
        await Submission.deleteMany({});
        await Payment.deleteMany({});
        console.log('Deleted all courses, enrollments, submissions and payments');

        const instructorId = '697ee7b063c84fc51429a144';

        const masterCourse = new Course({
            title: 'Mastering JavaScript Logic',
            subtitle: 'One Module, One Path to Certification',
            description: 'This is the compressed ultimate learning path. Complete the single module to earn your professional certification.',
            fullDescription: 'In this specialized course, we focus on the core logic of programming. By completing the challenging coding modules, you demonstrate your proficiency and earn a verified skill certificate.',
            category: 'Programming',
            level: 'Beginner',
            price: 499,
            originalPrice: 1999,
            currency: 'INR',
            isPaid: true,
            isPublished: true,
            instructor: instructorId,
            image: 'https://images.unsplash.com/photo-1579468110564-5a731c21d8b9?auto=format&fit=crop&q=80&w=800',
            features: ['Certificate', 'Hands-on Practice'],
            weeks: [
                {
                    title: 'The Foundation',
                    description: 'All you need in one week',
                    order: 1,
                    modules: [
                        {
                            title: 'Core Programming Logic',
                            description: 'Master the fundamental logic patterns',
                            order: 1,
                            lessons: [
                                {
                                    title: 'Variables and Constants',
                                    description: 'Learn how to store data',
                                    type: 'reading',
                                    content: '# Variables\nIn JavaScript, we use `let` and `const` to store data.\n\n```javascript\nlet name = "SkillBridge";\nconst PI = 3.14;\n```',
                                    order: 1
                                },
                                {
                                    title: 'Coding Challenge: The Sum Function',
                                    description: 'Write a function that returns the sum of two numbers',
                                    type: 'coding',
                                    codingChallenge: {
                                        problemStatement: 'Create a function named `sum` that takes two parameters `a` and `b` and returns their sum.',
                                        starterCode: 'function sum(a, b) {\n  // Write your code here\n}',
                                        language: 'javascript',
                                        solution: 'function sum(a, b) { return a + b; }',
                                        testCases: [
                                            { input: '1, 2', output: '3', isHidden: false },
                                            { input: '10, 20', output: '30', isHidden: false },
                                            { input: '-1, 5', output: '4', isHidden: true }
                                        ]
                                    },
                                    order: 2
                                }
                            ],
                            unlockRequirements: {
                                minQuizScore: 0,
                                requireCodingPass: true
                            }
                        }
                    ]
                }
            ]
        });

        await masterCourse.save();
        console.log('Created Master Course with one module and one coding lesson');

        process.exit(0);
    } catch (error) {
        console.error('Error during reset:', error);
        process.exit(1);
    }
};

reset();
