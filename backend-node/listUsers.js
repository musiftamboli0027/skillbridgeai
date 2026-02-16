const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const users = await User.find({}).select('email role');
        console.log('--- ALL USERS ---');
        users.forEach(u => console.log(`${u.email}: ${u.role}`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listUsers();
