export interface Lesson {
    id: string;
    title: string;
    content: string;
    codeExample: string;
    interactive?: boolean;
}

export const lessons: Lesson[] = [
    {
        id: "intro",
        title: "Introduction to Logic",
        content: "Logic is the heart of any computer program. It allows your code to make decisions based on certain conditions. In JavaScript, we use Boolean values (true or false) and comparison operators to build these decisions.",
        codeExample: "// Boolean logic example\nconst isLearning = true;\nconst hasEnergy = true;\n\nif (isLearning && hasEnergy) {\n  console.log(\"Great progress!\");\n}"
    },
    {
        id: "if-else",
        title: "The If Statement",
        content: "The `if` statement executes a block of code if a specified condition is true. The `else` statement provides an alternative block of code if the condition is false.",
        codeExample: "let temperature = 25;\n\nif (temperature > 30) {\n  console.log(\"It's hot!\");\n} else {\n  console.log(\"It's comfortable.\");\n}"
    },
    {
        id: "else-if",
        title: "Else If Ladder",
        content: "When you have multiple conditions to check, use `else if`. JavaScript will check each condition in order and execute the first one that matches.",
        codeExample: "let score = 85;\n\nif (score >= 90) {\n  console.log(\"Grade: A\");\n} else if (score >= 80) {\n  console.log(\"Grade: B\");\n} else {\n  console.log(\"Grade: C\");\n}"
    },
    {
        id: "boolean-logic",
        title: "Boolean Operators",
        content: "Combine conditions using logical operators: `&&` (AND), `||` (OR), and `!` (NOT). These allow for complex decision-making.",
        codeExample: "const isWeekend = true;\nconst isHoliday = false;\n\nif (isWeekend || isHoliday) {\n  console.log(\"Time to relax!\");\n}"
    }
];

export const quizQuestions = [
    {
        id: 1,
        question: "Which keyword is used to check an alternative condition if the first 'if' fails?",
        options: ["else", "then", "else if", "otherwise"],
        correctAnswer: 2
    },
    {
        id: 2,
        question: "What does the '||' operator represent?",
        options: ["AND", "OR", "NOT", "XOR"],
        correctAnswer: 1
    },
    {
        id: 3,
        question: "If score is 75, what will (score >= 70 && score < 80) evaluate to?",
        options: ["true", "false", "undefined", "Error"],
        correctAnswer: 0
    }
];
