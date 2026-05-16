import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useState } from "react";
import { useUser } from "@clerk/react";
import { createBooking } from "../../api/bookingApi";
import "./Booking.css";

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { providers } = useAppContext();
  const { user, isSignedIn } = useUser();

  // ✅ FIX: Handle both MongoDB _id (string) and dummy id (number)
  const provider = providers.find(
    (p) => String(p._id) === String(id) || String(p.id) === String(id)
  );

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [serviceLocation, setServiceLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!provider) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <h2>Provider not found</h2>
        <button
          onClick={() => navigate("/search")}
          style={{
            marginTop: 16,
            padding: "10px 24px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer"
          }}
        >
          Browse Services
        </button>
      </div>
    );
  }

  const providerId = provider._id || provider.id;

  // 🔥 HANDLE BOOKING
  const handleBooking = async () => {
    if (!isSignedIn) {
      alert("Please log in to book a service");
      return;
    }

    if (!date || !time || !serviceLocation) {
      alert("Please fill in all details including location");
      return;
    }

    // convert time to 24hr
    const [hourMin, modifier] = time.split(" ");
    let [hours, minutes] = hourMin.split(":");

    if (modifier === "PM" && hours !== "12") {
      hours = parseInt(hours) + 12;
    }
    if (modifier === "AM" && hours === "12") {
      hours = 0;
    }

    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(hours, minutes, 0);

    const now = new Date();

    // ❌ prevent past booking
    if (selectedDateTime < now) {
      alert("Cannot book past time ❌");
      return;
    }

    setIsSubmitting(true);

    try {
      await createBooking({
        userId: user.id,
        providerId: providerId,
        date: selectedDateTime.toISOString(),
        serviceLocation,
      });

      alert("Booking Confirmed ✅");
      navigate("/my-bookings");
    } catch (err) {
      alert("Error creating booking: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="booking-page">
      <h1>Book {provider.name}</h1>

      <div className="booking-card">
        <img
          src={
            provider.image && provider.image.startsWith("data:")
              ? provider.image
              : provider.image || "https://via.placeholder.com/300"
          }
          alt={provider.name || "Provider"}
        />

        <div>
          <h2>{provider.name}</h2>
          <p>{provider.category}</p>
          <p>₹{provider.price}</p>
        </div>
      </div>

      <div className="booking-form">
        <label>Service Location (Address)</label>
        <input
          type="text"
          value={serviceLocation}
          onChange={(e) => setServiceLocation(e.target.value)}
          placeholder="e.g. 123 Main St, Apartment 4B"
        />

        <label>Select Date</label>
        <input
          type="date"
          value={date}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setDate(e.target.value)}
        />

        <label>Select Time</label>
        <select value={time} onChange={(e) => setTime(e.target.value)}>
          <option value="">Choose time</option>
          <option>10:00 AM</option>
          <option>12:00 PM</option>
          <option>2:00 PM</option>
          <option>4:00 PM</option>
        </select>

        <button onClick={handleBooking} className="confirm-btn" disabled={isSubmitting}>
          {isSubmitting ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
};

export default Booking;