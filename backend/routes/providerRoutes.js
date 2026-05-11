import express from "express";
import {
  createProvider,
  getAllProviders,
  getProviderByClerkId,
  updateProviderProfile,
  deleteProviderByClerkId,
} from "../controllers/providerController.js";

const router = express.Router();

router.post("/", createProvider);
router.get("/", getAllProviders);
router.get("/:clerkUserId", getProviderByClerkId);
router.patch("/:clerkUserId", updateProviderProfile);
router.delete("/:clerkUserId", deleteProviderByClerkId);

export default router;