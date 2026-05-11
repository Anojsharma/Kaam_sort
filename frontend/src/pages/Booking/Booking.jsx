import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useState } from "react";
import "./Booking.css";

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { providers, addBooking } = useAppContext();

  // ✅ FIX: Handle both MongoDB _id (string) and dummy id (number)
  const provider = providers.find(
    (p) => String(p._id) === String(id) || String(p.id) === String(id)
  );

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

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
  const handleBooking = () => {
    if (!date || !time) {
      alert("Select date and time");
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

    const booking = {
      id: Date.now(),
      providerId: providerId,
      providerName: provider.name,
      category: provider.category,
      price: provider.price,
      image: provider.image,
      date,
      time
    };

    // ✅ use context
    addBooking(booking);

    alert("Booking Confirmed ✅");

    navigate("/");
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

        <button onClick={handleBooking} className="confirm-btn">
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default Booking;