const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const admins = [
    {
        name: 'Alex Chen',
        email: 'student@university.edu',
        password: 'password',
        role: 'student',
        isVerified: true
    },
    {
        name: 'Prof. Sarah Kim',
        email: 'admin@university.edu',
        password: 'password',
        role: 'university_admin',
        isVerified: true
    },
    {
        name: 'System Administrator',
        email: 'super@skillbridge.ai',
        password: 'password',
        role: 'super_admin',
        isVerified: true
    }
];

const seedAdmins = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        for (const adminData of admins) {
            const userExists = await User.findOne({ email: adminData.email });
            if (userExists) {
                console.log(`User ${adminData.email} already exists. Updating role...`);
                userExists.role = adminData.role;
                userExists.name = adminData.name;
                userExists.isVerified = true;
                // Update password if they exist
                const salt = await bcrypt.genSalt(10);
                userExists.password = await bcrypt.hash(adminData.password, salt);
                await userExists.save();
                console.log(`User ${adminData.email} updated successfully!`);
            } else {
                console.log(`Creating user ${adminData.email}...`);
                await User.create(adminData);
                console.log(`User ${adminData.email} created successfully!`);
            }
        }

        console.log('Admin seeding completed!');
        process.exit();
    } catch (err) {
        console.error('Seeding Failed:', err);
        process.exit(1);
    }
};

seedAdmins();
