const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const College = require('../models/College');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const fixData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    // Find all colleges
    // We use find().lean() to see the raw data regardless of schema
    const colleges = await College.find({}).lean();
    console.log(`Found ${colleges.length} colleges.`);

    let updatedCount = 0;
    for (const college of colleges) {
      // Check if university exists (old field)
      const universityVal = college.university || college.universityId;

      if (universityVal) {
          // Update the document to ensure universityId is set and university is removed
          await College.updateOne(
            { _id: college._id },
            { 
              $set: { universityId: universityVal },
              $unset: { university: "" } 
            }
          );
          updatedCount++;
      }
    }

    console.log(`Successfully updated ${updatedCount} colleges.`);
    process.exit(0);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

fixData();
