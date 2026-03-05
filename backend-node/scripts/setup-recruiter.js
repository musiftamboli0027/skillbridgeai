require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOne({ name: 'Musif Tamboli' }); // finding by name since email may not be matched exactly
    if(user) {
      user.role = 'recruiter';
      user.recruiterProfile = {
        companyName: 'NextGen AI',
        companyWebsite: 'https://nextgen.ai',
        isVerified: true,
        verificationStatus: 'Approved'
      };
      await user.save();
      console.log('Successfully elevated user to Verified Recruiter!');
    } else {
      console.log('User not found. Try another email.');
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
};

run();
