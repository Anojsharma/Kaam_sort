import Booking from "../models/Booking.js";
import Provider from "../models/Provider.js";

// ✅ CREATE BOOKING
export const createBooking = async (req, res, next) => {
  try {
    const { userId, providerId, date, serviceLocation, notes } = req.body;

    if (!userId || !providerId || !date || !serviceLocation) {
      return res.status(400).json({ message: "Missing required booking fields" });
    }

    // Verify provider exists
    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    const booking = await Booking.create({
      userId,
      providerId,
      date,
      serviceLocation,
      notes: notes || "",
    });

    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
};

// ✅ GET USER BOOKINGS (Populated with Provider info)
export const getUserBookings = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({ userId })
      .populate("providerId", "name category price image phone location")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

// ✅ GET PROVIDER BOOKINGS
export const getProviderBookings = async (req, res, next) => {
  try {
    const { providerId } = req.params;

    const bookings = await Booking.find({ providerId })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

// ✅ UPDATE BOOKING STATUS
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "accepted", "rejected", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (err) {
    next(err);
  }
};
