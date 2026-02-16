const mongoose = require('mongoose');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');

/**
 * Enrolls a student in a course and handles initial content unlocking.
 */
exports.enrollStudent = async (userId, courseId, paymentData = {}) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Check if course exists
        const course = await Course.findById(courseId).session(session);
        if (!course) {
            throw new Error('Course not found');
        }

        // 2. Check existing enrollment
        const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId }).session(session);
        if (existingEnrollment) {
            await session.commitTransaction();
            return existingEnrollment;
        }

        // 3. Identify First Module to Unlock
        // Logic: Unlocks the first module of the first week.
        let firstModuleId = null;
        let firstWeekId = null;

        if (course.weeks && course.weeks.length > 0) {
            // Find week with lowest order
            const sortedWeeks = course.weeks.sort((a, b) => a.order - b.order);
            const firstWeek = sortedWeeks[0];
            firstWeekId = firstWeek._id;

            if (firstWeek.modules && firstWeek.modules.length > 0) {
                // Find module with lowest order in that week
                const sortedModules = firstWeek.modules.sort((a, b) => a.order - b.order);
                firstModuleId = sortedModules[0]._id;
            }
        }

        // 4. Create Enrollment Record
        const enrollment = new Enrollment({
            user: userId,
            course: courseId,
            amount: paymentData.amount || course.price,
            paymentId: paymentData.paymentId || 'MANUAL_ENTRY',
            paymentStatus: paymentData.status || 'completed',
            status: 'active',
            // Initial Unlock
            unlockedModules: firstModuleId ? [{ moduleId: firstModuleId }] : [],
            currentWeek: firstWeekId,
            currentModule: firstModuleId
        });

        await enrollment.save({ session });

        // 5. Update User's Enrolled List (redundant sync)
        // We only store the ID here to keep the user doc light
        await User.findByIdAndUpdate(userId, {
            $addToSet: {
                enrolledCourses: {
                    course: courseId,
                    enrolledAt: new Date()
                }
            }
        }, { session });

        // 6. Update Course Student Count
        await Course.findByIdAndUpdate(courseId, {
            $inc: { enrolledStudents: 1 }
        }, { session });

        await session.commitTransaction();
        return enrollment;

    } catch (error) {
        await session.abortTransaction();
        console.error(`Enrollment Failed: ${error.message}`);
        throw error;
    } finally {
        session.endSession();
    }
};
