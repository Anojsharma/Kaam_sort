import express from "express";
import { syncUser } from "../controllers/userController.js";

const router = express.Router();

// ✅ Sync user from frontend
router.post("/sync", syncUser);

export default router;
