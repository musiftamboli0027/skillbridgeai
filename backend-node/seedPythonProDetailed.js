const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');
const User = require('./models/User');

dotenv.config({ path: './.env' });

const courseData = {
    title: "Mastering Python: 0 to Pro",
    subtitle: "The Most Comprehensive Python Course on the Internet",
    description: "From absolute zero to a professional Python developer. Industry-ready curriculum structured week-wise for career success.",
    fullDescription: `
        <h2>Course Introduction</h2>
        <p>Welcome to the most complete Python course ever created. Whether you have never written a line of code or you are looking to switch careers into Software Engineering, Data Science, or AI, this course is your definitive roadmap.</p>
        <p>Python is the #1 programming language in the world because of its simplicity and powerful libraries. In this 12-week intensive program, we don't just teach you syntax; we teach you how to think like a software architect.</p>

        <h2>Learning Outcomes</h2>
        <ul>
            <li>Build high-scale desktop and web applications with Flask.</li>
            <li>Master automation and data scraping like a pro.</li>
            <li>Implement complex data structures and algorithms.</li>
            <li>Design databases and integrate them with Python.</li>
            <li>Understand the fundamentals of Machine Learning and AI.</li>
        </ul>

        <h2>Career Guidance</h2>
        <p>Upon completion, you will be prepared for roles such as Junior Python Developer, Automation Engineer, Data Analyst, and Backend Developer. We include mock interview questions and portfolio-building projects in every module.</p>

        <h2>Certificate of Expertise</h2>
        <p>Receive a industry-recognized digital certificate upon successful completion of the final capstone project. Share it on LinkedIn and include it in your CV to stand out to recruiters.</p>
    `,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    category: "Programming",
    level: "Beginner",
    duration: "12 Weeks",
    price: 4999,
    originalPrice: 9999,
    language: "English",
    features: [
        "12 Weeks of Structured Learning",
        "12 Real-World Mini Projects",
        "Python Interview Playbook",
        "Certificate of Expertise",
        "Industry-Ready Assignments"
    ],
    requirements: [
        "No prior coding experience required",
        "A computer and an internet connection"
    ],
    modules: [
        {
            title: "WEEK 1: Python Basics",
            order: 1,
            lessons: [
                {
                    title: "Variables & Data Types",
                    duration: "45:00",
                    order: 1,
                    type: "video",
                    content: "Everything starts here. Learn about integers, strings, floats, and how Python manages memory."
                },
                {
                    title: "Practice: The Tip Calculator",
                    duration: "30:00",
                    order: 2,
                    type: "project",
                    content: "Build a program that calculates tips and splits bills among friends."
                }
            ]
        },
        {
            title: "WEEK 2: Conditions & Logic",
            order: 2,
            lessons: [
                {
                    title: "If-Else & Logical Operators",
                    duration: "60:00",
                    order: 1,
                    type: "video",
                    content: "Teach your program to make decisions based on data."
                }
            ]
        },
        {
            title: "WEEK 3: Loops & Iterations",
            order: 3,
            lessons: [
                {
                    title: "For, While & Flow Control",
                    duration: "70:00",
                    order: 1,
                    type: "video",
                    content: "Master repetitive tasks and how to break out of them efficiently."
                }
            ]
        },
        {
            title: "WEEK 4: Functions & Modules",
            order: 4,
            lessons: [
                {
                    title: "DRY Principle: Functions",
                    duration: "65:00",
                    order: 1,
                    type: "video",
                    content: "Learn to write clean, reusable, and modular code."
                }
            ]
        },
        {
            title: "WEEK 5: Data Structures",
            order: 5,
            lessons: [
                {
                    title: "List, Tuple, Set & Dictionary",
                    duration: "90:00",
                    order: 1,
                    type: "video",
                    content: "Deep dive into the core of Python's data handling capabilities."
                }
            ]
        },
        {
            title: "WEEK 6: Strings & File Handling",
            order: 6,
            lessons: [
                {
                    title: "Persisting Data to Files",
                    duration: "75:00",
                    order: 1,
                    type: "video",
                    content: "Read from and write to text and CSV files on your system."
                }
            ]
        },
        {
            title: "WEEK 7: Object-Oriented Programming",
            order: 7,
            lessons: [
                {
                    title: "Classes & Inheritance",
                    duration: "100:00",
                    order: 1,
                    type: "video",
                    content: "The pro standard. Learn to build complex systems using objects."
                }
            ]
        },
        {
            title: "WEEK 8: Exception Handling",
            order: 8,
            lessons: [
                {
                    title: "Robust Error Management",
                    duration: "50:00",
                    order: 1,
                    type: "video",
                    content: "Handle unexpected crashes gracefully and keep your users happy."
                }
            ]
        },
        {
            title: "WEEK 9: Database with Python",
            order: 9,
            lessons: [
                {
                    title: "SQLite3 & CRUD Operations",
                    duration: "85:00",
                    order: 1,
                    type: "video",
                    content: "Store massive amounts of data in relational databases."
                }
            ]
        },
        {
            title: "WEEK 10: Web Development",
            order: 10,
            lessons: [
                {
                    title: "Backend with Flask",
                    duration: "120:00",
                    order: 1,
                    type: "video",
                    content: "Build your first dynamic website with a Python backend."
                }
            ]
        },
        {
            title: "WEEK 11: Automation & Data Analysis",
            order: 11,
            lessons: [
                {
                    title: "Pandas & Web Scraping",
                    duration: "110:00",
                    order: 1,
                    type: "video",
                    content: "Turn the internet into your database using automation."
                }
            ]
        },
        {
            title: "WEEK 12: Machine Learning Capstone",
            order: 12,
            lessons: [
                {
                    title: "Predictive Models & Graduation",
                    duration: "180:00",
                    order: 1,
                    type: "project",
                    content: "Implement a Scikit-Learn model and graduate to a Pro Developer."
                }
            ]
        }
    ]
};

const seedDetailedCourse = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);

        let instructor = await User.findOne({ role: 'admin' });
        if (!instructor) instructor = await User.findOne({});

        console.log('Clearing old courses...');
        await Course.deleteMany({});

        console.log('Seeding Mastering Python: 0 to Pro...');
        await Course.create({
            ...courseData,
            instructor: instructor._id
        });

        console.log('Final Database Sync Complete!');
        process.exit();
    } catch (err) {
        console.error('Seeding Error:', err.message);
        process.exit(1);
    }
};

seedDetailedCourse();
