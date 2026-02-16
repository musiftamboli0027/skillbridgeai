const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Submission = require('../models/Submission');
const progressService = require('../services/progressService');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// @desc    Get Assignment is now via Get Course Lesson
// @route   POST /api/assignments/:lessonId/submit/quiz
exports.submitQuiz = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const { answers, courseId, moduleId } = req.body; // answers: { [questionIndex]: selectedOptionIndex }

        // Find the lesson in the course
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const { lesson, module } = findLesson(course, lessonId);
        if (!lesson || lesson.type !== 'quiz') {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Calculate Score
        let correctCount = 0;
        const results = lesson.quizQuestions.map((q, idx) => {
            const isCorrect = answers[idx] === q.correctAnswer;
            if (isCorrect) correctCount++;
            return { question: q.question, isCorrect, correctOption: q.correctAnswer };
        });

        const score = Math.round((correctCount / lesson.quizQuestions.length) * 100);
        const passed = score >= 70; // 70% threshold

        // Save Submission
        const submission = await Submission.create({
            user: req.user.id,
            course: courseId,
            module: moduleId,
            lesson: lessonId,
            assignmentType: 'quiz',
            quizAnswers: Object.entries(answers).map(([k, v]) => ({ questionId: k, selectedOption: v })),
            score,
            status: passed ? 'passed' : 'failed'
        });

        // If passed, mark lesson complete
        let unlockResult = null;
        if (passed) {
            unlockResult = await progressService.markLessonComplete(req.user.id, courseId, lessonId, moduleId);
        }

        res.json({ success: true, score, passed, results, unlockResult });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Submit Coding
// @route   POST /api/assignments/:lessonId/submit/coding
exports.submitCoding = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const { code, language, courseId, moduleId } = req.body;

        const course = await Course.findById(courseId);
        const { lesson } = findLesson(course, lessonId);

        if (!lesson || lesson.type !== 'coding') {
            return res.status(404).json({ message: 'Coding challenge not found' });
        }

        const challenge = lesson.codingChallenge;
        const testCases = challenge.testCases || [];

        const results = [];
        let passedCount = 0;

        // Run Code against Test Cases
        for (const tc of testCases) {
            try {
                // Prepare Python script wrapper to capture output properly if needed
                // For "HelloWorld", specific input might not be needed, but for "Temperature", it is.
                // Simple run:
                const output = await runCode(code, language, tc.input);

                // Normalization (trim whitespace and handle line endings)
                const actual = output.trim().replace(/\r\n/g, '\n');
                const expected = tc.output.toString().trim().replace(/\r\n/g, '\n');

                // Advanced Matching: if expected is just a number, we can try numeric match
                const isNumeric = !isNaN(parseFloat(expected)) && isFinite(expected);
                const passed = (actual === expected) || (isNumeric && parseFloat(actual) === parseFloat(expected));

                if (passed) passedCount++;

                results.push({
                    input: tc.isHidden ? 'Hidden' : tc.input,
                    expected: tc.isHidden ? 'Hidden' : expected,
                    actual: tc.isHidden ? 'Hidden' : actual,
                    passed
                });
            } catch (err) {
                results.push({
                    input: tc.isHidden ? 'Hidden' : tc.input,
                    error: err.message,
                    passed: false
                });
            }
        }

        const score = testCases.length > 0 ? Math.round((passedCount / testCases.length) * 100) : 100;
        const passed = score === 100; // Strict 100% for coding? Or 80? Let's say 100 for now.

        // Save Submission
        await Submission.create({
            user: req.user.id,
            course: courseId,
            module: moduleId,
            lesson: lessonId,
            assignmentType: 'coding',
            code,
            language,
            testResults: results,
            score,
            status: passed ? 'passed' : 'failed'
        });

        let unlockResult = null;
        if (passed) {
            unlockResult = await progressService.markLessonComplete(req.user.id, courseId, lessonId, moduleId);
        }

        res.json({ success: true, score, passed, results, unlockResult });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

async function runCode(code, language, input) {
    return new Promise((resolve, reject) => {
        const isPython = language === 'python';
        const tempId = Date.now() + Math.floor(Math.random() * 1000);
        const filename = `temp_${tempId}${isPython ? '.py' : '.js'}`;
        const tempDir = path.join(__dirname, '../temp');
        const filepath = path.join(tempDir, filename);

        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        let wrappedCode = code;
        if (input) {
            if (!isPython) {
                const functionName = 'sum';
                // If they haven't explicitly logged the function call, we append it.
                if (!code.includes(`console.log(${functionName}`)) {
                    wrappedCode += `\n\n// Auto-generated test call\nconst _res_ = typeof ${functionName} !== 'undefined' ? ${functionName}(${input}) : undefined;\nif (_res_ !== undefined) console.log(_res_);`;
                }
            } else {
                const functionName = 'sum';
                if (!code.includes(`print(${functionName}`)) {
                    wrappedCode += `\n\n# Auto-generated test call\ntry:\n    _res_ = ${functionName}(${input})\n    if _res_ is not None: print(_res_)\nexcept NameError: pass`;
                }
            }
        }

        fs.writeFileSync(filepath, wrappedCode);

        const command = isPython ? `python "${filepath}"` : `node "${filepath}"`;

        const child = exec(command, { timeout: 4000 }, (error, stdout, stderr) => {
            // Cleanup
            try { if (fs.existsSync(filepath)) fs.unlinkSync(filepath); } catch (e) { }

            if (error && error.killed) return reject(new Error('Time Limit Exceeded (4s)'));
            if (stderr && !stderr.includes('DeprecationWarning')) return reject(new Error(stderr));
            resolve(stdout);
        });
    });
}

function findLesson(course, lessonId) {
    for (const week of (course.weeks || [])) {
        for (const mod of (week.modules || [])) {
            const found = mod.lessons.find(l => l._id.toString() === lessonId);
            if (found) return { lesson: found, module: mod };
        }
    }
    return { lesson: null, module: null };
}
