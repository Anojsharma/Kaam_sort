import React, { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import { getProviderByClerkId, deleteProviderByClerkId } from "../../api/providerApi";
import { getProviderBookings, updateBookingStatus } from "../../api/bookingApi";
import { useAppContext } from "../../context/AppContext";
import "./ProviderDashboard.css";

const ProviderDashboard = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const { refreshProviders } = useAppContext();
  const [provider, setProvider] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded) return;

      if (!user) {
        navigate("/");
        return;
      }

      try {
        setLoading(true);
        const data = await getProviderByClerkId(user.id);

        if (data && data._id) {
          setProvider(data);
          // Fetch incoming bookings for this provider
          try {
            const bData = await getProviderBookings(data._id);
            setBookings(bData);
          } catch(err) {
            console.error("Failed to fetch bookings", err);
          }
        } else {
          // No provider profile found — redirect to create one
          navigate("/provider-auth");
        }
      } catch (err) {
        console.error("❌ Dashboard fetch error:", err.message);

        // 404 means provider doesn't exist yet
        if (err.response?.status === 404) {
          navigate("/provider-auth");
        } else {
          setError("Failed to load dashboard. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoaded, user, navigate]);

  // ✅ DELETE ACCOUNT: MongoDB → Clerk → Sign Out → Redirect
  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      setDeleting(true);

      // 1. Delete from MongoDB
      await deleteProviderByClerkId(user.id);
      console.log("✅ Provider deleted from MongoDB");

      // 2. Refresh providers list in UI
      await refreshProviders();

      // 3. Delete Clerk account
      await user.delete();
      console.log("✅ Clerk account deleted");

      // 4. Sign out and redirect
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
      }

      alert("Error deleting account: " + (err?.message || "Unknown error"));
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  // ✅ HANDLE BOOKING STATUS CHANGE
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      // Update local state
      setBookings(prev => 
        prev.map(b => b._id === bookingId ? { ...b, status: newStatus } : b)
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // ✅ LOADING STATE
  if (!isLoaded || loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2 className="loading">Loading dashboard...</h2>
      </div>
    );
  }

  // ✅ ERROR STATE
  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2>⚠️ {error}</h2>
        <button
          onClick={() => window.location.reload()}
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
          Retry
        </button>
      </div>
    );
  }

  if (!provider) return null;

  return (
    <div className="dashboard">

      {/* TOP PROFILE */}
      <div className="profile-card">
        <img
          src={
            provider.image && provider.image.startsWith("data:")
              ? provider.image
              : provider.image || "https://via.placeholder.com/80"
          }
          alt={provider.name || "Provider"}
        />

        <div>
          <h2>{provider.name}</h2>
          <p>{provider.category}</p>
          <span>📍 {provider.location}</span>
        </div>

        <div className="profile-actions">
          <button className="edit-btn">Edit Profile</button>
          <button
            className="delete-btn"
            onClick={() => setShowConfirm(true)}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="stats">
        <div className="stat">
          <h3>₹{provider.price}</h3>
          <p>Service Price</p>
        </div>

        <div className="stat">
          <h3>{provider.experience}</h3>
          <p>Years Experience</p>
        </div>

        <div className="stat">
          <h3>4.5 ⭐</h3>
          <p>Rating</p>
        </div>
      </div>

      {/* MAIN SECTION */}
      <div className="main-grid">

        <div className="card">
          <h3>About You</h3>
          <p>{provider.about || "No description added"}</p>
        </div>

        <div className="card">
          <h3>Contact</h3>
          <p>📞 {provider.phone}</p>
          <p>📍 {provider.location}</p>
        </div>

      </div>

      {/* INCOMING BOOKINGS SECTION */}
      <div className="bookings-section" style={{ marginTop: "30px" }}>
        <h2>Incoming Bookings</h2>
        {bookings.length === 0 ? (
          <p style={{ color: "#666", marginTop: "10px" }}>No bookings yet.</p>
        ) : (
          <div className="bookings-list" style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "15px" }}>
            {bookings.map((b) => (
              <div key={b._id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h4>Service Date: {new Date(b.date).toLocaleString()}</h4>
                  <p><strong>Location:</strong> {b.serviceLocation}</p>
                  <p><strong>Status:</strong> <span style={{ fontWeight: "bold", color: b.status === "pending" ? "#eab308" : b.status === "completed" ? "#10b981" : "#ef4444" }}>{b.status.toUpperCase()}</span></p>
                  {b.notes && <p><strong>Notes:</strong> {b.notes}</p>}
                </div>
                <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
                  {b.status === "pending" && (
                    <>
                      <button onClick={() => handleStatusChange(b._id, "completed")} style={{ background: "#10b981", color: "white", border: "none", padding: "8px 12px", borderRadius: "4px", cursor: "pointer" }}>Mark Completed</button>
                      <button onClick={() => handleStatusChange(b._id, "cancelled")} style={{ background: "#ef4444", color: "white", border: "none", padding: "8px 12px", borderRadius: "4px", cursor: "pointer" }}>Reject / Cancel</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* ✅ DELETE CONFIRMATION MODAL */}
      {showConfirm && (
        <div className="modal-overlay" onClick={() => !deleting && setShowConfirm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <h3>Delete Your Account?</h3>
            <p>
              This will permanently delete your provider profile from the
              platform and your Clerk account. This action <strong>cannot be undone</strong>.
            </p>
            <div className="modal-actions">
              <button
                className="modal-cancel"
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="modal-delete"
                onClick={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Yes, Delete Everything"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProviderDashboard;