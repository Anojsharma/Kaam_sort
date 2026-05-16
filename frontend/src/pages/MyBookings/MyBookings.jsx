import { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import { deleteUserByClerkId } from "../../api/userApi";
import { getUserBookings, updateBookingStatus, updateBookingDate } from "../../api/bookingApi";
import "./MyBookings.css";

const MyBookings = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const [editId, setEditId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const fetchBookings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getUserBookings(user.id);
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleUpdate = async (booking) => {
    if (!newDate || !newTime) {
      alert("Select date and time");
      return;
    }

    const [hourMin, modifier] = newTime.split(" ");
    let [hours, minutes] = hourMin.split(":");

    if (modifier === "PM" && hours !== "12") hours = parseInt(hours) + 12;
    if (modifier === "AM" && hours === "12") hours = 0;

    const selectedDateTime = new Date(newDate);
    selectedDateTime.setHours(hours, minutes, 0);

    if (selectedDateTime < new Date()) {
      alert("Cannot set past time ❌");
      return;
    }

    try {
      await updateBookingDate(booking._id, selectedDateTime.toISOString());
      setEditId(null);
      alert("Booking Updated ✅");
      fetchBookings();
    } catch (err) {
      alert("Error updating booking: " + (err.response?.data?.message || err.message));
    }
  };

  const handleCancelBooking = async (id) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmCancel) return;

    try {
      await updateBookingStatus(id, "cancelled");
      alert("Booking Cancelled ✅");
      fetchBookings();
    } catch (err) {
      alert("Error cancelling booking");
    }
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

  if (loading) {
    return <div style={{ textAlign: "center", padding: "50px" }}>Loading bookings...</div>;
  }

  return (
    <div className="my-bookings">
      <h1>My Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings yet</p>
      ) : (
        <div className="booking-list">
          {bookings.map((b) => {
            const bDate = new Date(b.date);
            const displayDate = bDate.toLocaleDateString("en-CA"); // YYYY-MM-DD
            const displayTime = bDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

            return (
            <div key={b._id} className={`booking-card ${b.status === 'cancelled' ? 'cancelled-booking' : ''}`}>

              <img 
                src={(b.providerId?.image && typeof b.providerId.image === 'string' && b.providerId.image.trim() !== "") 
                  ? b.providerId.image 
                  : "https://ui-avatars.com/api/?name=" + (b.providerId?.name ? b.providerId.name.replace(/ /g, "+") : "Unknown+Provider") + "&background=random"} 
                alt="Provider" 
                className="booking-img" 
              />

              <div className="booking-details">
                <h3 style={{ textTransform: "capitalize" }}>{b.providerId?.name || "Unknown Provider (Deleted Account)"}</h3>
                <p>{b.providerId?.category || "N/A"}</p>

                {editId === b._id ? (
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
                    <p><strong>Date:</strong> {displayDate}</p>
                    <p><strong>Time:</strong> {displayTime}</p>
                    {b.serviceLocation && <p><strong>Location:</strong> {b.serviceLocation}</p>}
                    <p><strong>Status:</strong> <span style={{ textTransform: "capitalize", color: b.status === 'cancelled' ? 'red' : 'green' }}>{b.status}</span></p>
                  </>
                )}

                <p className="price">₹{b.providerId?.price || 0}</p>
              </div>

              <div className="actions">
                {b.status !== "cancelled" && (
                  <>
                    {editId === b._id ? (
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
                            setEditId(b._id);
                            setNewDate(displayDate);
                            setNewTime(displayTime);
                          }}
                        >
                          Change Time
                        </button>

                        <button
                          className="cancel-btn"
                          onClick={() => handleCancelBooking(b._id)}
                        >
                          Cancel Booking
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>

            </div>
          )})}
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