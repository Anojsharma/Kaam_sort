import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { SignUpButton, UserButton, useUser } from "@clerk/react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn, isLoaded, user } = useUser();

  const [menuOpen, setMenuOpen] = useState(false);

  const role = user?.unsafeMetadata?.role || "";
  const isProvider = role === "provider";

  // ✅ ONLY REDIRECT IF NO ROLE
  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      if (!role && location.pathname !== "/onboarding") {
        navigate("/onboarding");
      }
    }
  }, [isSignedIn, isLoaded, role, navigate, location.pathname]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div
        className="navbar-left"
        onClick={() => {
          navigate("/");
          closeMenu();
        }}
      >
        <img src={assets.logo} alt="" className="logo" />
        <h2 className="brand">KaamSorted</h2>
      </div>

      <button className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? "✕" : "☰"}
      </button>

      <ul className={`navbar-menu ${menuOpen ? "active" : ""}`}>
        <li>
          <Link to="/" onClick={closeMenu}>Home</Link>
        </li>

        {!isProvider ? (
          <>
            <li>
              <Link to="/search" onClick={closeMenu}>Services</Link>
            </li>
            <li>
              <Link to="/my-bookings" onClick={closeMenu}>My Bookings</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/provider-dashboard" onClick={closeMenu}>Dashboard</Link>
            </li>
            <li>
              <Link to="/my-bookings" onClick={closeMenu}>Bookings</Link>
            </li>
          </>
        )}

        <div className="mobile-auth">
          {!isSignedIn ? (
            <SignUpButton mode="modal">
              <button className="signup-btn">Create Account</button>
            </SignUpButton>
          ) : (
            <UserButton afterSignOutUrl="/" />
          )}
        </div>
      </ul>

      <div className="navbar-right">
        {!isSignedIn ? (
          <SignUpButton mode="modal">
            <button className="signup-btn">Create Account</button>
          </SignUpButton>
        ) : (
          <UserButton afterSignOutUrl="/" />
        )}
      </div>
    </nav>
  );
};

export default Navbar;