const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load models
const path = require('path');
const University = require('../models/University');
const College = require('../models/College');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const universityName = "Punyashlok Ahilyadevi Holkar University, Solapur";
    
    // Check if university exists
    let university = await University.findOne({ name: universityName });
    if (!university) {
      university = await University.create({
        name: universityName,
        location: "Solapur, Maharashtra"
      });
      console.log(`Created University: ${universityName}`);
    } else {
      console.log(`University exists: ${universityName}`);
    }

    const colleges = [
      "N.B. Navale Sinhgad College of Engineering, Solapur",
      "SKN Sinhgad College of Engineering, Korti (Pandharpur)",
      "Nagesh Karajgi Orchid College of Engineering & Technology (NKOCET), Solapur",
      "Vidya Vikas Pratishthan Institute of Engineering and Technology, Solapur",
      "Bharat-Ratna Indira Gandhi College of Engineering (BIGCE), Solapur",
      "Karmayogi Engineering College, Solapur",
      "Fabtech Technical Campus, Solapur",
      "Brahmdevdada Mane Institute of Technology (BMIT), Solapur",
      "Sahakar Maharashi Shankarrao Mohite-Patil Institute of Technology & Research (SMSMPITR), Solapur",
      "Maeer's MIT College of Railway Engineering and Research, Barshi"
    ];

    for (const collegeName of colleges) {
      const existingCollege = await College.findOne({ 
        name: collegeName, 
        universityId: university._id 
      });

      if (!existingCollege) {
        await College.create({
          name: collegeName,
          universityId: university._id,
          location: collegeName.includes('Solapur') ? 'Solapur' : (collegeName.includes('Pandharpur') ? 'Pandharpur' : (collegeName.includes('Barshi') ? 'Barshi' : ''))
        });
        console.log(`Added College: ${collegeName}`);
      } else {
        console.log(`College exists: ${collegeName}`);
      }
    }

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (err) {
    console.error(`Error seeding data: ${err.message}`);
    process.exit(1);
  }
};

seedData();
