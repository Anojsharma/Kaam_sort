import React, { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import { getProviderByClerkId, deleteProviderByClerkId } from "../../api/providerApi";
import { useAppContext } from "../../context/AppContext";
import "./ProviderDashboard.css";

const ProviderDashboard = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const { refreshProviders } = useAppContext();
  const [provider, setProvider] = useState(null);
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