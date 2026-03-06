const mongoose = require('mongoose');
const dotenv = require('dotenv');
const University = require('../models/University');
const College = require('../models/College');

dotenv.config({ path: '../.env' });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Clear existing data
    await University.deleteMany();
    await College.deleteMany();

    // Create Universities
    const uni1 = await University.create({
      name: 'Savitribai Phule Pune University',
      state: 'Maharashtra',
      country: 'India'
    });

    const uni2 = await University.create({
      name: 'Mumbai University',
      state: 'Maharashtra',
      country: 'India'
    });

    // Create Colleges for SPPU
    await College.create([
      { name: 'PCCOE', university: uni1._id, city: 'Pune' },
      { name: 'VIT Pune', university: uni1._id, city: 'Pune' },
      { name: 'COEP Pune', university: uni1._id, city: 'Pune' }
    ]);

    // Create Colleges for Mumbai University
    await College.create([
      { name: 'VJTI Mumbai', university: uni2._id, city: 'Mumbai' }
    ]);

    console.log('Sample data seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
