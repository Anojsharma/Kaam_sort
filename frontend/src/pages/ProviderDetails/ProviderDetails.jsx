import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import "./ProviderDetails.css";

const ProviderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { providers } = useAppContext();

  // ✅ FIX: Handle both MongoDB _id (string) and dummy id (number)
  const provider = providers.find(
    (p) => String(p._id) === String(id) || String(p.id) === String(id)
  );

  if (!provider) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <h2>Provider not found</h2>
        <p style={{ color: "#64748b", marginTop: 8 }}>
          This provider may have been removed or doesn't exist.
        </p>
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

  return (
    <div className="provider-details">

      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="details-card">

        <img
          src={
            provider.image && provider.image.startsWith("data:")
              ? provider.image
              : provider.image || "https://via.placeholder.com/300"
          }
          alt={provider.name || "Provider"}
          className="details-img"
        />

        <div className="details-info">
          <h2>{provider.name}</h2>
          <p className="category">{provider.category}</p>

          <p>⭐ {provider.rating || 4.5} ({provider.reviews || 0} reviews)</p>
          <p><strong>Experience:</strong> {provider.experience} years</p>
          <p><strong>Location:</strong> {provider.location}</p>

          <p className="price">₹{provider.price}</p>

          <p className="about">{provider.about || "No description available."}</p>

          <button
            className="book-btn"
            onClick={() => navigate(`/booking/${providerId}`)}
          >
            Book Now
          </button>

        </div>
      </div>
    </div>
  );
};

export default ProviderDetails;