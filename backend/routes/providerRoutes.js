import express from "express";
import {
  createProvider,
  getAllProviders,
  getProviderByClerkId,
  updateProviderProfile,
  deleteProviderByClerkId,
  sendOtp,
  verifyOtp,
} from "../controllers/providerController.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/", createProvider);
router.get("/", getAllProviders);
router.get("/:clerkUserId", getProviderByClerkId);
router.patch("/:clerkUserId", updateProviderProfile);
router.delete("/:clerkUserId", deleteProviderByClerkId);

export default router;