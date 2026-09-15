import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URL || '';
    if (!mongoURI) {
      throw new Error('MONGODB_URL is not defined in environment variables');
    }

    const conn = await mongoose.connect(mongoURI, {
      dbName: 'hadab_atelier',
    });

    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error('[MongoDB] Connection error:', error);
    process.exit(1);
  }
};
