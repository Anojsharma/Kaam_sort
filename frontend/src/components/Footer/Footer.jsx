import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* LEFT */}
        <div className="footer-brand">
          <div className="footer-logo-wrap">
            <img src={assets.logo} alt="KaamSorted logo" className="footer-logo" />
            <h2>KaamSorted</h2>
          </div>
          <p>
            KaamSorted helps users find trusted local service providers for
            everyday needs like plumbing, cleaning, electrical work, and more.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-column">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/search">Services</Link>
          <Link to="/my-bookings">My Bookings</Link>
          <Link to="/onboarding">Become a Provider</Link>
        </div>

        {/* SERVICES */}
        <div className="footer-column">
          <h3>Popular Services</h3>
          <Link to="/search?cat=plumber">Plumber</Link>
          <Link to="/search?cat=electrician">Electrician</Link>
          <Link to="/search?cat=cleaner">Cleaner</Link>
          <Link to="/search?cat=carpenter">Carpenter</Link>
        </div>

        {/* CONTACT */}
        <div className="footer-column">
          <h3>Contact</h3>
          <p>Jamshedpur, India</p>
          <p>support@kaamsorted.com</p>
          <p>+91 98765 43210</p>

          <div className="footer-socials">
            <a href="/" aria-label="Instagram">📷</a>
            <a href="/" aria-label="Facebook">📘</a>
            <a href="/" aria-label="LinkedIn">💼</a>
            <a href="/" aria-label="Twitter">🐦</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 KaamSorted. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;