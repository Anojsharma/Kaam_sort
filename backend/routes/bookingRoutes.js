import express from "express";
import {
  createBooking,
  getUserBookings,
  getProviderBookings,
  updateBookingStatus,
  updateBookingDate,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/user/:userId", getUserBookings);
router.get("/provider/:providerId", getProviderBookings);
router.patch("/:id", updateBookingStatus);
router.patch("/:id/date", updateBookingDate);

export default router;
