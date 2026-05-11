import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import providerRoutes from "./routes/providerRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

// ✅ Connect MongoDB
connectDB();

const app = express();

// ✅ CORS
app.use(cors());

// ✅ WEBHOOK FIRST (needs raw body, before JSON parser)
app.use("/webhook", webhookRoutes);

// ✅ JSON PARSER
app.use(express.json({ limit: "10mb" }));

// TEST
app.get("/test", (req, res) => {
  res.send("Backend working ✅");
});

// ✅ ROUTES
app.use("/api/providers", providerRoutes);
app.use("/api/bookings", bookingRoutes);

// ✅ ERROR HANDLER MIDDLEWARE (Must be at the very end)
app.use(errorHandler);

// START
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});

// ✅ Handle port-in-use
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use!`);
    console.error(`💡 Fix: Open a NEW terminal and run:`);
    console.error(`   npx kill-port ${PORT}`);
    console.error(`   Then restart: npm run dev`);
  } else {
    console.error("❌ Server error:", err);
  }
});

// ✅ Prevent unhandled errors from crashing the server
process.on("unhandledRejection", (err) => {
  console.error("⚠️ Unhandled Rejection:", err.message || err);
});

process.on("uncaughtException", (err) => {
  console.error("⚠️ Uncaught Exception:", err.message || err);
});

// ✅ Export the app for Vercel Serverless deployment
export default app;