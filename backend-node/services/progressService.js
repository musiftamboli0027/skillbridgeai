const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Submission = require('../models/Submission');
const User = require('../models/User');

// Helper: Check if a lesson is completed based on type
async function isLessonCompleted(enrollment, lesson, courseId) {
    const completionRecord = enrollment.completedLessons.find(c => c.lessonId.toString() === lesson._id.toString());
    if (!completionRecord) return false;

    if (lesson.type === 'quiz' || lesson.type === 'coding') {
        const submission = await Submission.findOne({
            user: enrollment.user,
            lesson: lesson._id,
            status: 'passed'
        });
        return !!submission;
    }

    return true;
}

exports.updateStart = async (userId, courseId) => {
    await Enrollment.findOneAndUpdate(
        { user: userId, course: courseId },
        { lastAccessed: Date.now() }
    );
};

exports.markLessonComplete = async (userId, courseId, lessonId, moduleId) => {
    const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (!enrollment) throw new Error('Enrollment not found');

    // Idempotency check
    const alreadyCompleted = enrollment.completedLessons.find(c => c.lessonId.toString() === lessonId);
    if (!alreadyCompleted) {
        enrollment.completedLessons.push({
            lessonId,
            moduleId,
            completedAt: new Date()
        });

        // Calculate Overall Progress
        const course = await Course.findById(courseId);
        if (course) {
            let totalLessons = 0;
            course.weeks.forEach(w => {
                w.modules.forEach(m => {
                    totalLessons += m.lessons.length;
                });
            });

            if (totalLessons > 0) {
                enrollment.overallProgress = Math.round((enrollment.completedLessons.length / totalLessons) * 100);
            }
        }
        await enrollment.save();

        // Sync to User document
        await User.updateOne(
            { _id: userId, "enrolledCourses.course": courseId },
            { $set: { "enrolledCourses.$.progress": enrollment.overallProgress } }
        );
    }

    // Check for Module Completion/Unlock
    return await exports.checkModuleUnlock(enrollment, courseId, moduleId);
};

exports.updateVideoProgress = async (userId, courseId, lessonId, secondsWatched) => {
    const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (!enrollment) return;

    if (!enrollment.videoWatchTime) {
        enrollment.videoWatchTime = new Map();
    }

    const lessonKey = lessonId.toString();
    const current = enrollment.videoWatchTime.get(lessonKey) || 0;

    if (secondsWatched > current) {
        enrollment.videoWatchTime.set(lessonKey, secondsWatched);
        enrollment.lastAccessed = Date.now();
        enrollment.currentLesson = lessonId;
        await enrollment.save();
    }
};

exports.checkModuleUnlock = async (enrollment, courseId, currentModuleId) => {
    const course = await Course.findById(courseId);
    if (!course) return { unlocked: false };

    let currentModule = null;
    let nextModule = null;

    const allModules = [];
    course.weeks.sort((a, b) => a.order - b.order).forEach(week => {
        if (week.modules) {
            week.modules.sort((a, b) => a.order - b.order).forEach(mod => {
                allModules.push(mod);
            });
        }
    });

    for (let i = 0; i < allModules.length; i++) {
        if (allModules[i]._id.toString() === currentModuleId.toString()) {
            currentModule = allModules[i];
            if (i + 1 < allModules.length) {
                nextModule = allModules[i + 1];
            }
            break;
        }
    }

    if (!currentModule) return { unlocked: false, message: 'Module not found' };

    // Verify ALL Lessons in Current Module are Completed
    const allLessons = currentModule.lessons || [];
    const requiredLessonIds = allLessons.map(l => l._id.toString());
    const completedLessonIds = enrollment.completedLessons.map(c => c.lessonId.toString());
    const missingLessons = requiredLessonIds.filter(id => !completedLessonIds.includes(id));

    if (missingLessons.length === 0) {
        if (nextModule) {
            const alreadyUnlocked = enrollment.unlockedModules.some(u => u.moduleId.toString() === nextModule._id.toString());
            if (!alreadyUnlocked) {
                enrollment.unlockedModules.push({
                    moduleId: nextModule._id,
                    unlockedAt: new Date()
                });
                enrollment.currentModule = nextModule._id;
                await enrollment.save();
                return { unlocked: true, nextModuleId: nextModule._id };
            }
        } else {
            // COURSE COMPLETED!
            if (!enrollment.certificateIssued) {
                enrollment.status = 'completed';
                enrollment.completionDate = new Date();
                enrollment.certificateIssued = true;
                enrollment.certificateUrl = `https://skillbridge.ai/certificates/${enrollment._id}`;
                enrollment.overallProgress = 100;
                await enrollment.save();

                // Sync to User document
                await User.updateOne(
                    { _id: enrollment.user, "enrolledCourses.course": courseId },
                    { $set: { "enrolledCourses.$.progress": 100 } }
                );

                return { unlocked: false, message: 'Course completed! Certificate issued.', certificateIssued: true };
            }
        }
    }

    return { unlocked: false, remaining: missingLessons.length };
};
