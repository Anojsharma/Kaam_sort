import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import "./MyBookings.css";

const MyBookings = () => {
  const { bookings, cancelBooking, updateBooking } = useAppContext();

  const [editId, setEditId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const handleUpdate = (booking) => {
    if (!newDate || !newTime) {
      alert("Select date and time");
      return;
    }

    const updatedBooking = {
      ...booking,
      date: newDate,
      time: newTime
    };

    updateBooking(updatedBooking);

    setEditId(null);
    alert("Booking Updated ✅");
  };

  return (
    <div className="my-bookings">
      <h1>My Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings yet</p>
      ) : (
        <div className="booking-list">
          {bookings.map((b) => (
            <div key={b.id} className="booking-card">

              <img src={b.image} alt="" className="booking-img" />

              <div className="booking-details">
                <h3>{b.providerName}</h3>
                <p>{b.category}</p>

                {editId === b.id ? (
                  <>
                    <input
                      type="date"
                      value={newDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setNewDate(e.target.value)}
                    />

                    <select
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                    >
                      <option value="">Select time</option>
                      <option>10:00 AM</option>
                      <option>12:00 PM</option>
                      <option>2:00 PM</option>
                      <option>4:00 PM</option>
                    </select>

                    <button
                      className="save-btn"
                      onClick={() => handleUpdate(b)}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <p><strong>Date:</strong> {b.date}</p>
                    <p><strong>Time:</strong> {b.time}</p>
                  </>
                )}

                <p className="price">₹{b.price}</p>
              </div>

              <div className="actions">
                {editId === b.id ? (
                  <button
                    className="cancel-btn"
                    onClick={() => setEditId(null)}
                  >
                    Cancel
                  </button>
                ) : (
                  <>
                    <button
                      className="edit-btn"
                      onClick={() => {
                        setEditId(b.id);
                        setNewDate(b.date);
                        setNewTime(b.time);
                      }}
                    >
                      Change Time
                    </button>

                    <button
                      className="cancel-btn"
                      onClick={() => cancelBooking(b.id)}
                    >
                      Cancel Booking
                    </button>
                  </>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;