const mongoose = require('mongoose');

const connectDB = async () => {
  const url = process.env.DATABASE_URL || 'mongodb://localhost:27017/noobsyte';
  try {
    const maskedUrl = url.replace(/:([^:@]+)@/, ':****@');
    console.log(`📡 Database connection attempt string: ${maskedUrl}`);
    const conn = await mongoose.connect(url, { serverSelectionTimeoutMS: 8000 });
    console.log(`MongoDB Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    console.log(`⚠️ Falling back to local MongoDB...`);
    try {
      const conn = await mongoose.connect('mongodb://127.0.0.1:27017/noobsyte');
      console.log(`MongoDB Database Connected (Local Fallback): ${conn.connection.host}`);
    } catch (localError) {
      console.error(`Local Database Connection Error: ${localError.message}`);
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      } else {
        console.warn('⚠️ Development warning: Database is offline. Running without active DB connection.');
      }
    }
  }
};

module.exports = connectDB;
