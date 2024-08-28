import mongoose from "mongoose";

const MONGO_URI =
  "mongodb+srv://lucas:40925810@node-projects.mhuvm.mongodb.net/?retryWrites=true&w=majority&appName=node-projects";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
