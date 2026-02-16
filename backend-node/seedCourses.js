const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const colors = require('colors');
const Course = require('./models/Course');
const User = require('./models/User');

dotenv.config();

const courses = [
    {
        title: 'Full Stack Web Development Bootcamp',
        description: 'Master the MERN stack (MongoDB, Express, React, Node.js) and build real-world applications. This comprehensive course takes you from beginner to job-ready developer.',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Web Development',
        level: 'Beginner',
        duration: '6 Months',
        price: 4999,
        originalPrice: 8999,
        language: 'English',
        modules: [
            {
                title: 'Introduction to HTML & CSS',
                order: 1,
                lessons: [
                    {
                        title: 'HTML5 Basics',
                        duration: '15:00',
                        order: 1,
                        type: 'video'
                    },
                    {
                        title: 'CSS3 Styling',
                        duration: '20:00',
                        order: 2,
                        type: 'video'
                    }
                ]
            },
            {
                title: 'JavaScript Fundamentals',
                order: 2,
                lessons: []
            }
        ]
    },
    {
        title: 'Data Science with Python',
        description: 'Learn data analysis, visualization, and machine learning using Python. Perfect for beginners looking to enter the world of data science.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Data Science',
        level: 'Beginner',
        duration: '5 Months',
        price: 5999,
        originalPrice: 9999,
        language: 'English',
        modules: []
    },
    {
        title: 'UI/UX Design Masterclass',
        description: 'Design beautiful and user-friendly interfaces. Learn Figma, prototyping, and design principles used by top companies.',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Design',
        level: 'Intermediate',
        duration: '3 Months',
        price: 3499,
        originalPrice: 6999,
        language: 'English',
        modules: []
    },
    {
        title: 'Advanced React Patterns',
        description: 'Take your React skills to the next level with advanced patterns, performance optimization, and state management techniques.',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Web Development',
        level: 'Advanced',
        duration: '2 Months',
        price: 2999,
        originalPrice: 4999,
        language: 'English',
        modules: []
    },
    {
        title: 'Cloud Computing with AWS',
        description: 'Become an AWS Certified Solutions Architect. Learn to design and deploy scalable systems on Amazon Web Services.',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Cloud & DevOps',
        level: 'Intermediate',
        duration: '4 Months',
        price: 6499,
        originalPrice: 11999,
        language: 'English',
        modules: []
    },
    {
        title: 'Mobile App Development with Flutter',
        description: 'Build native iOS and Android apps with a single codebase using Google\'s Flutter framework.',
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Mobile Development',
        level: 'Beginner',
        duration: '4 Months',
        price: 4499,
        originalPrice: 7999,
        language: 'English',
        modules: []
    }
];

const seedCourses = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Find an instructor
        let instructor = await User.findOne({ role: 'admin' });
        if (!instructor) {
            instructor = await User.findOne({ role: 'instructor' });
        }
        if (!instructor) {
            instructor = await User.findOne({});
        }

        if (!instructor) {
            console.error('No user found using existing database to assign as instructor.');
            console.log('Please register a user first.');
            process.exit(1);
        }

        console.log(`Assigning courses to instructor: ${instructor.name} (${instructor._id})`);

        // Delete existing courses
        await Course.deleteMany();
        console.log('Courses cleared from database');

        // Add instructor to courses
        const coursesWithInstructor = courses.map(course => ({
            ...course,
            instructor: instructor._id,
            // Add some dummy requirements/features if not present
            features: ['Lifetime Access', 'Certificate of Completion', 'Project Files'],
            requirements: ['Basic computer knowledge', 'Internet connection']
        }));

        // Insert new courses
        await Course.insertMany(coursesWithInstructor);
        console.log('Data Imported!');

        process.exit();
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

seedCourses();
