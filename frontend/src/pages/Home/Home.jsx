import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/react";
import "./Home.css";

const userSlides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    title: "Quick Home Services",
    desc: "Book trusted professionals for cleaning, repair, and more."
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80",
    title: "Expert AC Repair",
    desc: "Fast, affordable, and reliable repair services at your doorstep."
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80",
    title: "Trusted Electricians",
    desc: "Safe installation, wiring, and repair by experienced providers."
  }
];

const providerSlides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    title: "Grow Your Service Business",
    desc: "Reach more customers and turn your skills into steady income."
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    title: "Manage Requests Smoothly",
    desc: "Track bookings, update your profile, and stay organized in one place."
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80",
    title: "Build Trust and Reputation",
    desc: "Get discovered by customers and grow your professional profile."
  }
];

const Home = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [location, setLocation] = useState("");
  const [service, setService] = useState("");

  const role = user?.unsafeMetadata?.role || "user";
  const isProvider = role === "provider";
  const activeSlides = isProvider ? providerSlides : userSlides;

  useEffect(() => {
    setCurrentSlide(0);
  }, [isProvider]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeSlides.length]);

  const handleHeroSearch = () => {
    const params = new URLSearchParams();

    if (service.trim()) {
      params.append("cat", service.trim());
    }

    if (location.trim()) {
      params.append("location", location.trim());
    }

    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-left">
          <span className="hero-badge">
            {isProvider ? "Provider Workspace" : "Trusted Local Services"}
          </span>

          <h1>
            {isProvider
              ? "Manage and Grow Your Service Business"
              : "Find Trusted Services Near You"}
          </h1>

          <p>
            {isProvider
              ? "Update your profile, manage bookings, and build a strong professional presence on KaamSorted."
              : "Electrician, Plumber, Cleaner, Carpenter — all in one place with verified professionals and easy booking."}
          </p>

          {!isProvider && (
            <div className="hero-search">
              <div className="search-box">
                <div className="search-input">
                  <span>📍</span>
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="divider"></div>

                <div className="search-input">
                  <span>🔍</span>
                  <input
                    type="text"
                    placeholder="Search service (plumber, electrician...)"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                  />
                </div>

                <button className="search-btn" onClick={handleHeroSearch}>
                  Search
                </button>
              </div>
            </div>
          )}

          <div className="hero-buttons">
            {isProvider ? (
              <>
                <button
                  onClick={() => navigate("/provider-dashboard")}
                  className="primary-btn"
                >
                  Go to Dashboard
                </button>

                <button
                  onClick={() => navigate("/my-bookings")}
                  className="secondary-btn"
                >
                  View Bookings
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/search")}
                  className="primary-btn"
                >
                  Find Services
                </button>

                <button
                  onClick={() => navigate("/onboarding")}
                  className="secondary-btn"
                >
                  Become a Provider
                </button>
              </>
            )}
          </div>
        </div>

        <div className="hero-right">
          <div className="slider-card">
            <img
              src={activeSlides[currentSlide].image}
              alt={activeSlides[currentSlide].title}
              className="slider-image"
            />

            <div className="slider-overlay">
              <h2>{activeSlides[currentSlide].title}</h2>
              <p>{activeSlides[currentSlide].desc}</p>
            </div>

            <div className="slider-dots">
              {activeSlides.map((item, index) => (
                <span
                  key={item.id}
                  className={`dot ${currentSlide === index ? "active" : ""}`}
                  onClick={() => setCurrentSlide(index)}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {!isProvider && (
        <>
          <section className="categories">
            <h2>Popular Services</h2>

            <div className="category-grid">
              <div
                onClick={() => navigate("/search?cat=plumber")}
                className="card"
              >
                🛠 <span>Plumber</span>
              </div>

              <div
                onClick={() => navigate("/search?cat=electrician")}
                className="card"
              >
                ⚡ <span>Electrician</span>
              </div>

              <div
                onClick={() => navigate("/search?cat=cleaner")}
                className="card"
              >
                🧹 <span>Cleaner</span>
              </div>

              <div
                onClick={() => navigate("/search?cat=carpenter")}
                className="card"
              >
                🪵 <span>Carpenter</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/search")}
              className="primary-btn1"
            >
              More Services
            </button>
          </section>

          <section className="how">
            <h2>How It Works</h2>

            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <h3>Search</h3>
                <p>Find the service you need in seconds.</p>
              </div>

              <div className="step">
                <div className="step-number">2</div>
                <h3>Book</h3>
                <p>Select your provider and choose your time slot.</p>
              </div>

              <div className="step">
                <div className="step-number">3</div>
                <h3>Relax</h3>
                <p>Get your work done hassle-free at your doorstep.</p>
              </div>
            </div>
          </section>

          <section className="provider">
            <h2>Earn by Offering Services</h2>
            <p>
              Join as a provider, build your profile, and start getting bookings.
            </p>

            <button
              onClick={() => navigate("/onboarding")}
              className="primary-btn provider-main-btn"
            >
              Join as Provider
            </button>
          </section>
        </>
      )}

      {isProvider && (
        <section className="provider-home-panel">
          <h2>Your Provider Tools</h2>

          <div className="provider-home-grid">
            <div
              className="provider-home-card"
              onClick={() => navigate("/provider-dashboard")}
            >
              <h3>Edit Profile</h3>
              <p>Update your details, pricing, category, and photo.</p>
            </div>

            <div
              className="provider-home-card"
              onClick={() => navigate("/my-bookings")}
            >
              <h3>Check Bookings</h3>
              <p>See upcoming service requests and manage customer bookings.</p>
            </div>

            <div
              className="provider-home-card"
              onClick={() => navigate("/search")}
            >
              <h3>See Marketplace</h3>
              <p>View how customers browse service providers in the app.</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;