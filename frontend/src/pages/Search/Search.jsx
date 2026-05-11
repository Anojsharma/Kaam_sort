import { useLocation, useNavigate } from "react-router-dom";
import "./Search.css";
import { useAppContext } from "../../context/AppContext";

export default function Search() {
  const { providers, providersLoading } = useAppContext();
  const locationHook = useLocation();
  const navigate = useNavigate();

  // ✅ Always safe array
  const safeProviders = Array.isArray(providers) ? providers : [];

  const queryParams = new URLSearchParams(locationHook.search);

  const category = queryParams.get("cat") || "";
  const location = queryParams.get("location") || "";

  // ✅ SAFE FILTERING
  const filteredProviders = safeProviders.filter((p) => {
    const matchCategory = category
      ? p.category?.toLowerCase().includes(category.toLowerCase())
      : true;

    const matchLocation = location
      ? p.location?.toLowerCase().includes(location.toLowerCase())
      : true;

    return matchCategory && matchLocation;
  });

  // ✅ HANDLE BOTH Mongo (_id) + dummy (id)
  const getProviderId = (p) => p?._id || p?.id || "";

  // ✅ BULLETPROOF IMAGE HANDLER
  const getImageSrc = (img) => {
    if (!img) return "https://via.placeholder.com/300";

    // Cloudinary / normal URL
    if (img.startsWith("http")) return img;

    // base64 image
    if (img.startsWith("data:image")) return img;

    // anything else → fallback
    return "https://via.placeholder.com/300";
  };

  return (
    <div className="search-page">
      <h1 className="search-title">
        {category ? `${category} Services` : "All Services"}
        {location && (
          <span className="location-text"> in {location}</span>
        )}
      </h1>

      {/* ✅ LOADING */}
      {providersLoading ? (
        <h2 className="loading">Loading providers...</h2>
      ) : filteredProviders.length === 0 ? (
        <div className="no-result">
          <h3>No providers found 😕</h3>
          <p>Try changing your search or location</p>
        </div>
      ) : (
        <div className="providers-grid">
          {filteredProviders.map((p) => {
            const id = getProviderId(p);

            return (
              <div
                key={id}
                className="provider-card"
                onClick={() => navigate(`/provider/${id}`)}
              >
                {/* ✅ IMAGE */}
                <img
                  src={getImageSrc(p.image)}
                  alt={p.name || "provider"}
                  className="provider-img"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300";
                  }}
                />

                {/* ✅ CONTENT */}
                <div className="provider-content">
                  <h3 className="provider-name">
                    {p.name || "Unknown"}
                  </h3>

                  <p className="provider-category">
                    {p.category || "N/A"}
                  </p>

                  <div className="provider-bottom">
                    <span className="price">
                      ₹{p.price || 0}
                    </span>
                    <span className="rating">
                      ⭐ {p.rating || 4.5}
                    </span>
                  </div>

                  <p className="provider-location">
                    📍 {p.location || "Unknown"}
                  </p>

                  <button
                    className="book-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/booking/${id}`);
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}