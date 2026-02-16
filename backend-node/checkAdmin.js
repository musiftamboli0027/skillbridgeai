const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'skillbridge'
        });
        console.log(`Connected to MongoDB`);

        const users = await User.find({});
        console.log(`Total Users: ${users.length}`);

        for (const u of users) {
            console.log(`- ${u.name} (${u.email}) [Role: ${u.role}]`);
            if (u.email === 'vishalwaghmare7083@gmail.com') {
                console.log('Promoting Vishal to Admin...');
                u.role = 'admin';
                await u.save();
                console.log('User promoted successfully!');
            }
        }

        process.exit();
    } catch (err) {
        console.error('Check Failed:', err);
        process.exit(1);
    }
};

checkAdmin();
