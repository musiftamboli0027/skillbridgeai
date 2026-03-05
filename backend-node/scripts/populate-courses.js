const axios = require('axios');

// Sample course data (20 courses)
const courses = [
    {
        title: "Advanced JavaScript & TypeScript",
        subtitle: "Master Modern JavaScript and TypeScript",
        description: "Deep dive into advanced JavaScript concepts, ES6+, and TypeScript for building scalable applications.",
        category: "Programming",
        level: "Advanced",
        duration: "16 weeks",
        price: 32999,
        originalPrice: 42999,
        image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=500&fit=crop",
        tags: ["JavaScript", "TypeScript", "ES6", "Advanced"],
        features: ["Advanced JavaScript patterns", "TypeScript fundamentals", "Async programming", "Performance optimization"],
        requirements: ["Basic JavaScript knowledge"],
        whatYouWillLearn: ["Master advanced JavaScript", "Build type-safe applications", "Implement design patterns"]
    },
    {
        title: "React Native Mobile Development",
        subtitle: "Build iOS and Android Apps",
        description: "Learn to build cross-platform mobile applications using React Native and modern development practices.",
        category: "Mobile Development",
        level: "Intermediate",
        duration: "14 weeks",
        price: 28999,
        originalPrice: 38999,
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=500&fit=crop",
        tags: ["React Native", "Mobile", "iOS", "Android"],
        features: ["Cross-platform development", "Native modules", "Redux state management", "App deployment"],
        requirements: ["React basics"],
        whatYouWillLearn: ["Build mobile apps", "Integrate native features", "Deploy to app stores"]
    },
    {
        title: "UI/UX Design Masterclass",
        subtitle: "Design Beautiful User Experiences",
        description: "Comprehensive course on UI/UX design principles, tools, and best practices for creating stunning interfaces.",
        category: "Design",
        level: "Beginner",
        duration: "10 weeks",
        price: 22999,
        originalPrice: 29999,
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop",
        tags: ["UI Design", "UX Design", "Figma"],
        features: ["Design thinking", "Wireframing", "User research", "Design systems"],
        requirements: ["No prior experience needed"],
        whatYouWillLearn: ["Create user-centered designs", "Build prototypes", "Conduct user research"]
    },
    {
        title: "DevOps Engineering Complete",
        subtitle: "CI/CD, Docker, Kubernetes & More",
        description: "Master DevOps practices including containerization, orchestration, CI/CD pipelines, and cloud infrastructure.",
        category: "Cloud & DevOps",
        level: "Advanced",
        duration: "18 weeks",
        price: 36999,
        originalPrice: 46999,
        image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=500&fit=crop",
        tags: ["DevOps", "Docker", "Kubernetes", "CI/CD"],
        features: ["Docker containerization", "Kubernetes orchestration", "Jenkins pipelines", "Infrastructure as Code"],
        requirements: ["Linux basics"],
        whatYouWillLearn: ["Implement CI/CD", "Deploy containers", "Manage Kubernetes"]
    },
    {
        title: "Artificial Intelligence Fundamentals",
        subtitle: "Introduction to AI and Machine Learning",
        description: "Explore the fundamentals of AI, machine learning algorithms, and practical applications in real-world scenarios.",
        category: "Data Science",
        level: "Intermediate",
        duration: "15 weeks",
        price: 33999,
        originalPrice: 43999,
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop",
        tags: ["AI", "Machine Learning", "Python"],
        features: ["AI fundamentals", "ML algorithms", "Neural networks", "NLP basics"],
        requirements: ["Python programming"],
        whatYouWillLearn: ["Understand AI concepts", "Implement ML algorithms", "Build neural networks"]
    },
    {
        title: "Cybersecurity Essentials",
        subtitle: "Protect Systems and Networks",
        description: "Learn cybersecurity fundamentals, ethical hacking, network security, and how to protect digital assets.",
        category: "Programming",
        level: "Intermediate",
        duration: "12 weeks",
        price: 29999,
        originalPrice: 39999,
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=500&fit=crop",
        tags: ["Cybersecurity", "Ethical Hacking"],
        features: ["Security fundamentals", "Ethical hacking", "Network security", "Penetration testing"],
        requirements: ["Basic networking knowledge"],
        whatYouWillLearn: ["Identify vulnerabilities", "Perform penetration testing", "Secure networks"]
    },
    {
        title: "Blockchain Development",
        subtitle: "Build Decentralized Applications",
        description: "Master blockchain technology, smart contracts, and decentralized application development using Ethereum.",
        category: "Programming",
        level: "Advanced",
        duration: "14 weeks",
        price: 34999,
        originalPrice: 44999,
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=500&fit=crop",
        tags: ["Blockchain", "Ethereum", "Solidity"],
        features: ["Blockchain fundamentals", "Smart contracts", "DApp development", "Web3 integration"],
        requirements: ["Programming experience"],
        whatYouWillLearn: ["Understand blockchain", "Write smart contracts", "Build DApps"]
    },
    {
        title: "Angular Complete Guide",
        subtitle: "Build Enterprise Web Applications",
        description: "Comprehensive Angular course covering components, services, routing, state management, and enterprise patterns.",
        category: "Web Development",
        level: "Intermediate",
        duration: "13 weeks",
        price: 26999,
        originalPrice: 35999,
        image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&h=500&fit=crop",
        tags: ["Angular", "TypeScript", "RxJS"],
        features: ["Angular fundamentals", "Component architecture", "RxJS observables", "NgRx state management"],
        requirements: ["JavaScript basics"],
        whatYouWillLearn: ["Build Angular apps", "Implement reactive programming", "Manage state"]
    },
    {
        title: "Game Development with Unity",
        subtitle: "Create 2D and 3D Games",
        description: "Learn game development using Unity engine, C# programming, and game design principles.",
        category: "Programming",
        level: "Beginner",
        duration: "16 weeks",
        price: 30999,
        originalPrice: 40999,
        image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&h=500&fit=crop",
        tags: ["Unity", "Game Development", "C#"],
        features: ["Unity engine", "C# programming", "2D and 3D games", "Physics and animations"],
        requirements: ["No prior experience needed"],
        whatYouWillLearn: ["Create games", "Program game mechanics", "Design levels"]
    },
    {
        title: "GraphQL API Development",
        subtitle: "Modern API Design",
        description: "Master GraphQL for building efficient, flexible APIs with Node.js and Apollo Server.",
        category: "Web Development",
        level: "Intermediate",
        duration: "10 weeks",
        price: 24999,
        originalPrice: 32999,
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=500&fit=crop",
        tags: ["GraphQL", "Node.js", "Apollo"],
        features: ["GraphQL fundamentals", "Schema design", "Apollo Server", "Resolvers"],
        requirements: ["Node.js basics"],
        whatYouWillLearn: ["Design GraphQL schemas", "Build APIs", "Implement resolvers"]
    },
    {
        title: "Flutter Mobile Development",
        subtitle: "Cross-Platform Apps with Dart",
        description: "Build beautiful, natively compiled applications for mobile, web, and desktop using Flutter.",
        category: "Mobile Development",
        level: "Beginner",
        duration: "12 weeks",
        price: 27999,
        originalPrice: 36999,
        image: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=800&h=500&fit=crop",
        tags: ["Flutter", "Dart", "Mobile"],
        features: ["Flutter framework", "Dart language", "Widget composition", "State management"],
        requirements: ["Basic programming"],
        whatYouWillLearn: ["Build cross-platform apps", "Create widgets", "Manage state"]
    },
    {
        title: "PostgreSQL Database Mastery",
        subtitle: "Advanced Database Design",
        description: "Deep dive into PostgreSQL database design, query optimization, and performance tuning.",
        category: "Programming",
        level: "Advanced",
        duration: "11 weeks",
        price: 25999,
        originalPrice: 34999,
        image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=500&fit=crop",
        tags: ["PostgreSQL", "Database", "SQL"],
        features: ["Advanced SQL", "Database design", "Indexing", "Query optimization"],
        requirements: ["Basic SQL knowledge"],
        whatYouWillLearn: ["Design databases", "Optimize queries", "Manage production databases"]
    },
    {
        title: "Vue.js Complete Course",
        subtitle: "Progressive JavaScript Framework",
        description: "Master Vue.js 3 with Composition API, Vuex, and Vue Router for building web applications.",
        category: "Web Development",
        level: "Beginner",
        duration: "11 weeks",
        price: 23999,
        originalPrice: 31999,
        image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&h=500&fit=crop",
        tags: ["Vue.js", "JavaScript", "Vuex"],
        features: ["Vue.js 3", "Composition API", "Vuex", "Vue Router"],
        requirements: ["HTML, CSS, JavaScript"],
        whatYouWillLearn: ["Build Vue apps", "Use Composition API", "Manage state"]
    },
    {
        title: "Microservices Architecture",
        subtitle: "Design Scalable Systems",
        description: "Learn to design, build, and deploy microservices-based applications using modern patterns.",
        category: "Cloud & DevOps",
        level: "Advanced",
        duration: "15 weeks",
        price: 35999,
        originalPrice: 45999,
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop",
        tags: ["Microservices", "Architecture", "Docker"],
        features: ["Microservices patterns", "Service communication", "API gateway", "Distributed tracing"],
        requirements: ["Backend development"],
        whatYouWillLearn: ["Design microservices", "Implement communication", "Deploy services"]
    },
    {
        title: "iOS Development with Swift",
        subtitle: "Build Native iPhone Apps",
        description: "Complete iOS development course using Swift, SwiftUI, and UIKit.",
        category: "Mobile Development",
        level: "Intermediate",
        duration: "14 weeks",
        price: 31999,
        originalPrice: 41999,
        image: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=800&h=500&fit=crop",
        tags: ["iOS", "Swift", "SwiftUI"],
        features: ["Swift programming", "SwiftUI", "UIKit", "Core Data"],
        requirements: ["Basic programming"],
        whatYouWillLearn: ["Build iOS apps", "Create UIs", "Implement persistence"]
    },
    {
        title: "Selenium Test Automation",
        subtitle: "Automated Testing",
        description: "Master Selenium WebDriver for automated testing of web applications.",
        category: "Programming",
        level: "Intermediate",
        duration: "9 weeks",
        price: 21999,
        originalPrice: 28999,
        image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=500&fit=crop",
        tags: ["Selenium", "Testing", "Automation"],
        features: ["Selenium WebDriver", "Test frameworks", "Page Object Model", "CI/CD integration"],
        requirements: ["Programming basics"],
        whatYouWillLearn: ["Automate testing", "Design frameworks", "Integrate CI/CD"]
    },
    {
        title: "Rust Programming Language",
        subtitle: "Systems Programming",
        description: "Learn Rust programming language for building fast, reliable, and memory-safe systems.",
        category: "Programming",
        level: "Advanced",
        duration: "13 weeks",
        price: 29999,
        originalPrice: 38999,
        image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=500&fit=crop",
        tags: ["Rust", "Systems Programming"],
        features: ["Rust fundamentals", "Ownership model", "Concurrency", "WebAssembly"],
        requirements: ["Programming experience"],
        whatYouWillLearn: ["Write safe code", "Understand ownership", "Build concurrent apps"]
    },
    {
        title: "Tailwind CSS Mastery",
        subtitle: "Utility-First CSS",
        description: "Master Tailwind CSS for building modern, responsive user interfaces.",
        category: "Design",
        level: "Beginner",
        duration: "6 weeks",
        price: 18999,
        originalPrice: 24999,
        image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=500&fit=crop",
        tags: ["Tailwind CSS", "CSS", "Web Design"],
        features: ["Tailwind fundamentals", "Responsive design", "Custom configurations", "Dark mode"],
        requirements: ["HTML and CSS basics"],
        whatYouWillLearn: ["Build with utilities", "Create layouts", "Customize Tailwind"]
    },
    {
        title: "Next.js Full Stack Development",
        subtitle: "React Framework for Production",
        description: "Build production-ready full-stack applications with Next.js.",
        category: "Web Development",
        level: "Intermediate",
        duration: "12 weeks",
        price: 28999,
        originalPrice: 37999,
        image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&h=500&fit=crop",
        tags: ["Next.js", "React", "Full Stack"],
        features: ["Next.js fundamentals", "SSR", "SSG", "API routes"],
        requirements: ["React basics"],
        whatYouWillLearn: ["Build Next.js apps", "Implement SSR", "Create APIs"]
    },
    {
        title: "MongoDB Database Development",
        subtitle: "NoSQL Database",
        description: "Master MongoDB database design, queries, aggregation, and best practices.",
        category: "Programming",
        level: "Intermediate",
        duration: "10 weeks",
        price: 24999,
        originalPrice: 32999,
        image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&h=500&fit=crop",
        tags: ["MongoDB", "NoSQL", "Database"],
        features: ["MongoDB fundamentals", "Document modeling", "Aggregation", "Indexing"],
        requirements: ["Basic database knowledge"],
        whatYouWillLearn: ["Design schemas", "Write queries", "Optimize performance"]
    }
];

const API_URL = 'http://localhost:5000/api';

async function loginOrRegisterAdmin() {
    const ADMIN_EMAIL = 'admin@skillbridge.com';
    const ADMIN_PASSWORD = 'admin123';

    try {
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
        });
        return loginResponse.data.token;
    } catch (loginError) {
        console.log('⚠️  Login failed, attempting to register admin user...');

        try {
            const registerResponse = await axios.post(`${API_URL}/auth/register`, {
                name: 'Admin User',
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                role: 'admin'
            });

            console.log('✅ Admin user registered!');
            return registerResponse.data.token;
        } catch (registerError) {
            throw new Error('Failed to authenticate');
        }
    }
}

async function createCourses() {
    try {
        console.log('🔐 Authenticating...\n');
        const token = await loginOrRegisterAdmin();
        console.log('✅ Authenticated!\n');

        console.log(`📚 Creating ${courses.length} courses...\n`);

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < courses.length; i++) {
            const course = courses[i];

            try {
                await axios.post(
                    `${API_URL}/admin/course`,
                    course,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                console.log(`✅ [${i + 1}/${courses.length}] ${course.title}`);
                successCount++;
            } catch (error) {
                console.error(`❌ [${i + 1}/${courses.length}] ${course.title}`);
                failCount++;
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('🎉 Completed!');
        console.log(`✅ Created: ${successCount} courses`);
        if (failCount > 0) console.log(`❌ Failed: ${failCount} courses`);
        console.log('='.repeat(60));
        console.log('\n🌐 Visit: http://localhost:5173/courses');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

createCourses();
