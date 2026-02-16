const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');

const deleteAllUsers = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected successfully.');

        console.log('Deleting all users...');
        const result = await User.deleteMany({});
        console.log(`Deleted ${result.deletedCount} users.`);

        console.log('Process completed.');
        process.exit(0);
    } catch (error) {
        console.error('Error deleting users:', error);
        process.exit(1);
    }
};

deleteAllUsers();
