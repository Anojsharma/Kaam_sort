import express from "express";
import { syncUser, deleteUser } from "../controllers/userController.js";

const router = express.Router();

// ✅ Sync user from frontend
router.post("/sync", syncUser);

// ✅ Delete user from frontend (manual fallback for local dev)
router.delete("/:clerkUserId", deleteUser);

export default router;
