import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_DB_URI);
    console.log(`MONGODB Connected : ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectMongoDB;
