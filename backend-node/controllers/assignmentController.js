const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Submission = require('../models/Submission');
const progressService = require('../services/progressService');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/assignments/:lessonId/submit/quiz
// ─────────────────────────────────────────────────────────────────────────────
exports.submitQuiz = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const { answers, courseId, moduleId } = req.body;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const { lesson } = findLesson(course, lessonId);
        if (!lesson || lesson.type !== 'quiz') {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        let correctCount = 0;
        const results = lesson.quizQuestions.map((q, idx) => {
            const isCorrect = answers[idx] === q.correctAnswer;
            if (isCorrect) correctCount++;
            return { question: q.question, isCorrect, correctOption: q.correctAnswer };
        });

        const score = Math.round((correctCount / lesson.quizQuestions.length) * 100);
        const passed = score >= 70;

        await Submission.create({
            user: req.user.id,
            course: courseId,
            module: moduleId,
            lesson: lessonId,
            assignmentType: 'quiz',
            quizAnswers: Object.entries(answers).map(([k, v]) => ({ questionId: k, selectedOption: v })),
            score,
            status: passed ? 'passed' : 'failed'
        });

        let unlockResult = null;
        if (passed) {
            unlockResult = await progressService.markLessonComplete(req.user.id, courseId, lessonId, moduleId);
        }

        res.json({ success: true, score, passed, results, unlockResult });
    } catch (err) {
        console.error('[Quiz Submit]', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/assignments/:lessonId/submit/coding
// ─────────────────────────────────────────────────────────────────────────────
exports.submitCoding = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const { code, language, courseId, moduleId } = req.body;

        if (!code || !courseId) {
            return res.status(400).json({ success: false, message: 'code and courseId are required' });
        }

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

        const { lesson } = findLesson(course, lessonId);

        // ── If no coding challenge / test cases defined → auto-accept (run-only mode) ──
        if (!lesson || lesson.type !== 'coding' || !lesson.codingChallenge?.testCases?.length) {
            // Just save submission + mark complete (no test harness)
            await Submission.create({
                user: req.user.id,
                course: courseId,
                module: moduleId,
                lesson: lessonId,
                assignmentType: 'coding',
                code,
                language,
                testResults: [],
                score: 100,
                status: 'passed'
            });

            const unlockResult = await progressService.markLessonComplete(
                req.user.id, courseId, lessonId, moduleId
            );

            return res.json({
                success: true,
                score: 100,
                passed: true,
                results: [],
                noTestCases: true,
                unlockResult
            });
        }

        const challenge = lesson.codingChallenge;
        const testCases = challenge.testCases;
        const functionName = challenge.functionName || null; // e.g. "add", "greet"

        const results = [];
        let passedCount = 0;

        for (const tc of testCases) {
            try {
                const output = await runCode(code, language, tc.input, functionName);
                const actual = output.trim().replace(/\r\n/g, '\n');
                const expected = String(tc.output).trim().replace(/\r\n/g, '\n');

                const isNumeric = !isNaN(parseFloat(expected)) && isFinite(expected);
                const testPassed = (actual === expected) ||
                    (isNumeric && parseFloat(actual) === parseFloat(expected));

                if (testPassed) passedCount++;

                results.push({
                    input: tc.isHidden ? 'Hidden' : tc.input,
                    expected: tc.isHidden ? 'Hidden' : expected,
                    actual: tc.isHidden ? 'Hidden' : actual,
                    passed: testPassed
                });
            } catch (err) {
                results.push({
                    input: tc.isHidden ? 'Hidden' : tc.input,
                    error: err.message,
                    passed: false
                });
            }
        }

        const score = testCases.length > 0
            ? Math.round((passedCount / testCases.length) * 100)
            : 100;

        // Pass threshold: 80% of test cases (was strict 100% before — too harsh)
        const passed = score >= 80;

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
            unlockResult = await progressService.markLessonComplete(
                req.user.id, courseId, lessonId, moduleId
            );
        }

        res.json({ success: true, score, passed, results, unlockResult });

    } catch (err) {
        console.error('[Coding Submit]', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// runCode — execute student code, optionally calling a named function
// ─────────────────────────────────────────────────────────────────────────────
async function runCode(code, language, input, functionName) {
    return new Promise((resolve, reject) => {
        const isPython = language === 'python' || language === 'py';
        const ext = isPython ? '.py' : '.js';
        const tempId = `${Date.now()}_${Math.floor(Math.random() * 9999)}`;
        const tempDir = path.join(__dirname, '../temp');
        const filepath = path.join(tempDir, `code_${tempId}${ext}`);

        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        let wrappedCode = code;

        // Only inject a test-call if a specific function name is declared in the challenge
        if (input !== undefined && input !== null && input !== '' && functionName) {
            if (isPython) {
                // Check if student already calls print(functionName(...))
                if (!code.includes(`print(${functionName}`)) {
                    wrappedCode += `\n\n# Auto test call\ntry:\n    _r_ = ${functionName}(${input})\n    if _r_ is not None: print(_r_)\nexcept Exception as e: print(f"ERROR: {e}")`;
                }
            } else {
                if (!code.includes(`console.log(${functionName}`)) {
                    wrappedCode += `\n\n// Auto test call\ntry {\n  const _r_ = typeof ${functionName} !== 'undefined' ? ${functionName}(${input}) : undefined;\n  if (_r_ !== undefined) console.log(_r_);\n} catch(e) { console.log('ERROR:', e.message); }`;
                }
            }
        }

        fs.writeFileSync(filepath, wrappedCode, 'utf-8');

        // Use python3 on Linux/Mac, python on Windows
        const pyCmd = process.platform === 'win32' ? 'python' : 'python3';
        const command = isPython ? `${pyCmd} "${filepath}"` : `node "${filepath}"`;

        exec(command, { timeout: 6000 }, (error, stdout, stderr) => {
            try { if (fs.existsSync(filepath)) fs.unlinkSync(filepath); } catch (_) {}

            if (error?.killed) return reject(new Error('⏱ Time Limit Exceeded (6s)'));
            if (stderr && !stderr.includes('DeprecationWarning') && !stderr.includes('ExperimentalWarning')) {
                return reject(new Error(stderr.slice(0, 300)));
            }
            resolve(stdout);
        });
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// findLesson — search all weeks → modules → lessons
// ─────────────────────────────────────────────────────────────────────────────
function findLesson(course, lessonId) {
    for (const week of (course.weeks || [])) {
        for (const mod of (week.modules || [])) {
            const found = mod.lessons.find(l => l._id.toString() === lessonId);
            if (found) return { lesson: found, module: mod };
        }
    }
    return { lesson: null, module: null };
}
