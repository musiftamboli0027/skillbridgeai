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

    let xpRewardValue = 0;

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

            // Sync to User document
            const user = await User.findById(userId);
            if (user) {
                // Reward XP based on lesson type
                const lesson = course.weeks.flatMap(w => w.modules).flatMap(m => m.lessons).find(l => l._id.toString() === lessonId);
                let xpReward = 10; // Default
                if (lesson) {
                    if (lesson.type === 'coding') xpReward = 100;
                    else if (lesson.type === 'quiz') xpReward = 50;
                    else if (lesson.type === 'project') xpReward = 500;
                    else if (lesson.type === 'visualizer') xpReward = 30;
                }

                user.xp += xpReward;
                xpRewardValue = xpReward;

                // Update Rank logic
                if (user.xp > 10000) user.rank = 'Legend';
                else if (user.xp > 5000) user.rank = 'Master';
                else if (user.xp > 2000) user.rank = 'Expert';
                else if (user.xp > 1000) user.rank = 'Specialist';
                else if (user.xp > 500) user.rank = 'Apprentice';

                // Check for badges
                if (enrollment.overallProgress === 100 && !user.badges.some(b => b.name === `Master of ${course.title}`)) {
                    user.badges.push({ name: `Master of ${course.title}`, icon: '🏆' });
                }

                await user.save();
            }
        }
        await enrollment.save();

        await User.updateOne(
            { _id: userId, "enrolledCourses.course": courseId },
            { $set: { "enrolledCourses.$.progress": enrollment.overallProgress } }
        );
    }

    // Check for Module Completion/Unlock
    const unlockResult = await exports.checkModuleUnlock(enrollment, courseId, moduleId);
    return { ...unlockResult, xpReward: xpRewardValue };
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
