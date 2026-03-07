const mongoose = require('mongoose');
const Course = require('../models/Course');
const User = require('../models/User');

const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedJavaBasics = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB.');

        // Find instructor
        let instructor = await User.findOne({ role: 'admin' });
        if (!instructor) instructor = await User.findOne({});
        if (!instructor) {
            console.error('No user found to assign as instructor. Please register a user first.');
            process.exit(1);
        }
        console.log(`Using instructor: ${instructor.name || instructor.email} (${instructor._id})`);

        // Check if it already exists and delete only Java Basics
        console.log('Deleting existing Java Basics course if any...');
        await Course.deleteMany({ title: "SkillBridge Java Basics" });

        // ── COURSE DATA ───────────────────────────────────────────────────────
        const courseData = {
            title: "SkillBridge Java Basics",
            subtitle: "From Zero to Real-World Java Applications",
            description: "SkillBridge Java for Beginners is a guided learning pathway aligned with modern NEP-based skill education. The goal is to help students transition from zero programming knowledge to building real-world Java applications.",
            fullDescription: "Students learn best by doing. Instead of passive reading, this course encourages experimentation, debugging, and logical reasoning using Java. The AI Tutor assists learners by giving hints, identifying mistakes, and promoting independent thinking without revealing full solutions.",
            category: "Programming",
            level: "Beginner",
            price: 1999,
            originalPrice: 4999,
            instructor: instructor._id,
            image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200",
            features: ["AI Tutor Assistance", "Hands-On Practice", "NEP-Aligned Curriculum", "Certificate of Completion"],
            tags: ["Java", "Beginner", "Programming"],
            isPublished: true,
            isFeatured: true,

            assessmentModel: {
                codingWeightage: "60%",
                mcqWeightage: "40%"
            },

            aiTutorSystem: {
                logicMirroringExamples: [
                    "Ask: 'How would you calculate the largest number on paper?' before giving code.",
                    "If a loop fails: 'Is the condition ever becoming False?'"
                ],
                indentationAlertBehavior: "Warn about proper formatting.",
                syntaxHintRules: [
                    "Detect missing semicolons",
                    "Check for missing classes and main methods"
                ]
            },

            weeks: [
                {
                    weekNumber: 1,
                    title: "Week 1: Java Foundations",
                    order: 1,
                    description: "Go from zero to writing your first Java programs. Master syntax, variables, data types, and input/output.",
                    modules: [
                        {
                            title: "Introduction to Java",
                            order: 1,
                            lessons: [
                                {
                                    title: "What is Java?",
                                    type: "reading",
                                    order: 1,
                                    duration: "10:00",
                                    content: `# What is Java?

Java is a popular and powerful programming language, created in 1995. It is owned by Oracle, and more than 3 billion devices run Java.

## Where is Java used?
- Mobile applications (specially Android apps)
- Desktop applications
- Web applications
- Web servers and application servers
- Games
- Database connection
- And much, much more!

## Features of Java
- Simple and Easy to Learn
- Object-Oriented
- Platform Independent
- Secure
- Robust
- Multithreaded
- High Performance

## Java Components
Java works on 3 main components:
- **JDK (Java Development Kit)** – Used to develop Java programs
- **JRE (Java Runtime Environment)** – Used to run Java programs
- **JVM (Java Virtual Machine)** – Converts bytecode into machine code

## Why Use Java?
Java works on different platforms (Windows, Mac, Linux, Raspberry Pi, etc.). It is one of the most popular programming languages in the world. It has a large demand in the current job market. It is easy to learn and simple to use. It is open-source and free. It is secure, fast and powerful.`,
                                    expectedSkills: ["Understand what Java is", "Know Java features", "Understand JDK, JRE, JVM"]
                                },
                                {
                                    title: "Java Syntax and Comments",
                                    type: "reading",
                                    order: 2,
                                    duration: "15:00",
                                    content: `# Java Syntax and main() Method

Java syntax means the set of rules that define how to write programs correctly — just like grammar rules in English. If the syntax is wrong, the program will show an error.

The \`main()\` method is required in every Java program:
\`\`\`java
public static void main(String[] args) {
    // code goes here
}
\`\`\`

# Java Comments

Comments can be used to explain Java code, and to make it more readable. It can also be used to prevent execution when testing alternative code.

## Two types of comments:
- **Single line comment**: Single-line comments start with two forward slashes (\`//\`)
- **Multiline comments**: Multi-line comments start with \`/*\` and end with \`*/\`.`,
                                    expectedSkills: ["Write the main method", "Write single and multi-line comments"]
                                },
                                {
                                    title: "Variables and Data Types",
                                    type: "reading",
                                    order: 3,
                                    duration: "15:00",
                                    content: `# Java Variable Types

Variables are containers for storing data values.

- **String** - stores text, such as "Hello". String values are surrounded by double quotes.
  \`\`\`java
  String name = "John";
  System.out.println(name);
  \`\`\`
- **int** - stores integers (whole numbers), without decimals, such as 123.
  \`\`\`java
  int myNum = 15;
  System.out.println(myNum);
  \`\`\`
- **float** - stores floating point numbers, with decimals, such as 19.9.
  \`\`\`java
  float myFloatNum = 5.99f;
  \`\`\`
- **char** - stores single characters, such as 'a'. Char values are surrounded by single quotes.
  \`\`\`java
  char myLetter = 'D';
  \`\`\`
- **boolean** - stores values with two states: true or false.
  \`\`\`java
  boolean myBool = true;
  \`\`\``,
                                    expectedSkills: ["Create variables for different data types", "Print variable values"]
                                }
                            ]
                        }
                    ],
                    miniChallenge: "Write a complete Java program with a main() method that creates varied data type variables and prints them.",
                    expectedSkills: [
                        "Understand what Java is and its features",
                        "Write the main() method with correct syntax",
                        "Use single and multi-line comments",
                        "Declare and initialize different types of variables"
                    ]
                }
            ]
        };

        const newCourse = await Course.create(courseData);
        console.log('\n✅ Java Basics course seeded successfully!');
        console.log(`   ID: ${newCourse._id}`);

        process.exit(0);

    } catch (err) {
        console.error('❌ Seed Error:', err.message || err);
        process.exit(1);
    }
};

seedJavaBasics();
