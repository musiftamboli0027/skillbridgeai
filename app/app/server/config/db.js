import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-interview', {
      // These options are no longer needed in Mongoose 6+, but kept for compatibility
      // useNewUrlParser: true,
      // useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Don't exit the process, just log the error
    // This allows the server to run without MongoDB for demo purposes
    console.log('Running without MongoDB connection. Some features may be limited.');
  }
};

export default connectDB;
