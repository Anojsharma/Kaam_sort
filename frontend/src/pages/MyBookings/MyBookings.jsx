import { useState } from "react";
import { useUser, useClerk } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { deleteUserByClerkId } from "../../api/userApi";
import "./MyBookings.css";

const MyBookings = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const { bookings, cancelBooking, updateBooking } = useAppContext();
  const [deleting, setDeleting] = useState(false);

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

  const handleDeleteAccount = async () => {
    if (!user) return;

    const confirmDelete = window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      setDeleting(true);

      // 1. Delete from MongoDB
      await deleteUserByClerkId(user.id);
      console.log("✅ User deleted from MongoDB");

      // 2. Delete Clerk account
      await user.delete();
      console.log("✅ Clerk account deleted");

      // 3. Sign out and redirect
      await signOut();
      navigate("/", { replace: true });

    } catch (err) {
      console.error("❌ Delete account error:", err);
      
      // If MongoDB delete worked but Clerk failed, still try to sign out
      if (err.message?.includes("Clerk") || err.status === 401) {
        try {
          await signOut();
          navigate("/", { replace: true });
        } catch {}
      } else {
        alert("Error deleting account: " + (err?.message || "Unknown error"));
      }
    } finally {
      setDeleting(false);
    }
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

      {/* Account Management Section */}
      <div className="account-management" style={{ marginTop: "50px", paddingTop: "20px", borderTop: "1px solid #ddd", textAlign: "center" }}>
        <h3 style={{ color: "#d9534f", marginBottom: "10px" }}>Danger Zone</h3>
        <p style={{ color: "#666", marginBottom: "15px", fontSize: "14px" }}>Permanently delete your account and all associated data.</p>
        <button 
          onClick={handleDeleteAccount} 
          disabled={deleting}
          style={{
            backgroundColor: "#d9534f",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: deleting ? "not-allowed" : "pointer",
            fontWeight: "bold",
            transition: "background 0.3s"
          }}
          onMouseOver={(e) => !deleting && (e.currentTarget.style.backgroundColor = "#c9302c")}
          onMouseOut={(e) => !deleting && (e.currentTarget.style.backgroundColor = "#d9534f")}
        >
          {deleting ? "Deleting..." : "Delete Account"}
        </button>
      </div>

    </div>
  );
};

export default MyBookings;