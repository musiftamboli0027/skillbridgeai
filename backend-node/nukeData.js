const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Enrollment = require('./models/Enrollment');
const Payment = require('./models/Payment');
const Invoice = require('./models/Invoice');

const nukeUserData = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected successfully.');

        console.log('Deleting Users...');
        await User.deleteMany({});

        console.log('Deleting Enrollments...');
        await Enrollment.deleteMany({});

        console.log('Deleting Payments...');
        await Payment.deleteMany({});

        console.log('Deleting Invoices...');
        await Invoice.deleteMany({});

        console.log('All user-related data (emails, enrollments, payments) has been cleared.');
        process.exit(0);
    } catch (error) {
        console.error('Error during cleanup:', error);
        process.exit(1);
    }
};

nukeUserData();
