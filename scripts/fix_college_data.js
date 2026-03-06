const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../backend-node/.env') });

const fixData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    const College = require('../backend-node/models/College');

    // Find all colleges
    const colleges = await College.find({});
    console.log(`Found ${colleges.length} colleges.`);

    let updatedCount = 0;
    for (const college of colleges) {
      // Check if universityId is missing but university is present
      // Note: We use toObject() to see raw fields if renaming in schema caused issues
      const rawDoc = college.toObject();
      const universityVal = rawDoc.university || rawDoc.universityId;

      if (universityVal) {
          // Force update the document with universityId
          await College.updateOne(
            { _id: college._id },
            { $set: { universityId: universityVal }, $unset: { university: "" } }
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
