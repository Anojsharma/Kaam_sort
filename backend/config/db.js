import mongoose from "mongoose";
import dns from "dns";

// ✅ Force Google DNS to bypass local network DNS issues
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    console.log("⏳ Retrying in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
