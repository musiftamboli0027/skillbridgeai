const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');
const User = require('./models/User');
const Assignment = require('./models/Assignment');

dotenv.config({ path: './.env' });

const seedCourse = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'skillbridge'
        });
        console.log(`Connected to MongoDB`);

        let instructor = await User.findOne({ role: 'admin' });
        if (!instructor) instructor = await User.findOne({});
        if (!instructor) {
            instructor = await User.create({
                name: 'SkillBridge Admin',
                email: 'admin@skillbridge.ai',
                password: 'password123',
                role: 'admin'
            });
        }

        console.log('Clearing existing data...');
        await Course.deleteMany({});
        await Assignment.deleteMany({});

        console.log('Creating Mastering Python Course...');
        const course = await Course.create({
            title: "Mastering Python: 0 to Pro",
            subtitle: "The definitive intensive bootcamp.",
            description: "A meticulously designed curriculum.",
            image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80",
            category: "Programming",
            level: "Beginner",
            duration: "1 Week",
            price: 4999,
            instructor: instructor._id,
            modules: []
        });

        // Module 1
        const module1Id = new mongoose.Types.ObjectId();
        const lessons = [];

        // Lesson 1: Video
        lessons.push({
            title: "How Python Works (Interpreter vs Compiler)",
            duration: "25:00",
            order: 1,
            type: "video",
            videoUrl: "https://youtu.be/FJ7O1DqJg7g?si=2fzhomsozAtw8lFe"
        });

        // Lesson 2: Quiz (The First Quiz)
        const quiz1 = await Assignment.create({
            course: course._id,
            module: module1Id,
            title: "Basics & Internals Quiz",
            description: "Test your knowledge on Python execution and interpretation.",
            type: "quiz",
            questions: [
                {
                    question: "Is Python a compiled or interpreted language?",
                    options: ["Compiled", "Interpreted", "Both", "Neither"],
                    correctAnswer: 2,
                    explanation: "Python is both; it compiles to bytecode and then interprets that bytecode."
                },
                {
                    question: "What is the primary role of the PVM (Python Virtual Machine)?",
                    options: ["Code Editing", "Bytecode Execution", "Network Management", "Memory Hiding"],
                    correctAnswer: 1
                }
            ]
        });
        lessons.push({
            title: "Knowledge Check: Basics",
            duration: "10:00",
            order: 2,
            type: "quiz",
            assignmentId: quiz1._id
        });

        // Lesson 3: Video
        lessons.push({
            title: "Variables & Data Types",
            duration: "20:00",
            order: 3,
            type: "video",
            videoUrl: "https://youtu.be/cKzP61Gjf00?si=m5nSw8G1z6_qE7uG"
        });

        // Lesson 4: Coding (The First Coding Problem)
        const coding1 = await Assignment.create({
            course: course._id,
            module: module1Id,
            title: "Variable Swapping Challenge",
            description: "Write a Python script that swaps the values of two variables without using a third variable.",
            type: "coding",
            problemStatement: "Given two variables a and b, swap their values using the Pythonic tuple unpacking way.",
            starterCode: {
                python: "a = 5\nb = 10\n\n# Your code here\n\nprint(f'{a},{b}')"
            },
            testCases: [
                {
                    input: "5,10",
                    expectedOutput: "10,5",
                    isHidden: false
                }
            ]
        });
        lessons.push({
            title: "Coding Lab: Variable Magic",
            duration: "15:00",
            order: 4,
            type: "coding", // Frontend handles 'coding' as assignment
            assignmentId: coding1._id
        });

        course.modules.push({
            _id: module1Id,
            title: "Python Essentials Bootcamp",
            weekNumber: 1,
            order: 1,
            lessons: lessons
        });

        await course.save();

        console.log('Course Seeded with Video -> Quiz -> Video -> Coding workflow!');
        process.exit();
    } catch (err) {
        console.error('Seeding Failed:', err);
        process.exit(1);
    }
};

seedCourse();
