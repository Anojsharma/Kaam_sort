import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createProvider, getProviderByClerkId, sendProviderOtp, verifyProviderOtp } from "../../api/providerApi";
import { useUser } from "@clerk/react";
import { useAppContext } from "../../context/AppContext";
import "./ProviderAuth.css";

const ProviderAuth = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const { refreshProviders } = useAppContext();

  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(true);

  // OTP States
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // ✅ Check if user already has a provider profile
  useEffect(() => {
    const checkExisting = async () => {
      if (!isLoaded || !user) {
        setChecking(false);
        return;
      }
      try {
        const existing = await getProviderByClerkId(user.id);
        if (existing) {
          // User already has a provider profile, redirect to dashboard
          navigate("/provider-dashboard", { replace: true });
          return;
        }
      } catch (err) {
        // 404 means no provider found — that's expected, show the form
        console.log("No existing provider found, showing registration form");
      }
      setChecking(false);
    };
    checkExisting();
  }, [isLoaded, user, navigate]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    category: "",
    experience: "",
    price: "",
    location: "",
    about: "",
    image: ""
  });

  if (!isLoaded || checking) {
    return (
      <div className="provider-auth-container">
        <p style={{ textAlign: "center", padding: "40px" }}>Loading...</p>
      </div>
    );
  }

  if (!user) {
    navigate("/");
    return null;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ IMAGE UPLOAD (Base64)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image too large. Max 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSendOtp = async () => {
    if (!form.phone || form.phone.length < 10) {
      alert("Please enter a valid phone number including country code (e.g., +1234567890)");
      return;
    }

    try {
      setSubmitting(true);
      await sendProviderOtp(form.phone);
      setOtpSent(true);
      alert("OTP Sent! (If Twilio is not configured, check your backend terminal for the code)");
    } catch (err) {
      alert("Failed to send OTP: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter the OTP");
      return;
    }

    try {
      setVerifying(true);
      await verifyProviderOtp(form.phone, otp);
      setOtpVerified(true);
      alert("Phone verified successfully! You can now save your profile.");
    } catch (err) {
      alert("Invalid or expired OTP: " + (err.response?.data?.message || err.message));
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Login first");
      return;
    }

    if (!otpVerified) {
      alert("Please verify your phone number first");
      return;
    }

    try {
      setSubmitting(true);

      await createProvider({
        clerkUserId: user.id,
        ...form
      });

      await refreshProviders();

      navigate("/provider-dashboard");

    } catch (err) {
      console.error("Provider creation error:", err);
      const errorMsg =
        err?.response?.data?.message || err?.message || "Unknown error";
      alert(`Error creating provider: ${errorMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="provider-auth-container">
      <form className="provider-form" onSubmit={handleSubmit}>
        <h2>Complete Your Profile</h2>

        <div className="form-grid">
          <input name="name" placeholder="Name" onChange={handleChange} required disabled={otpVerified} />
          
          <input 
            name="phone" 
            placeholder="Phone (e.g. +1234567890)" 
            onChange={handleChange} 
            required 
            disabled={otpSent || otpVerified} 
          />
          
          <input name="category" placeholder="Category" onChange={handleChange} required disabled={otpVerified} />
          <input name="experience" type="number" placeholder="Experience" onChange={handleChange} required disabled={otpVerified} />
          <input name="price" type="number" placeholder="Price" onChange={handleChange} required disabled={otpVerified} />
          <input name="location" placeholder="Location" onChange={handleChange} required disabled={otpVerified} />
        </div>

        <textarea name="about" placeholder="About" onChange={handleChange} disabled={otpVerified} />

        <input type="file" accept="image/*" onChange={handleImageUpload} disabled={otpVerified} />

        {form.image && <img src={form.image} width={100} alt="Provider Preview" style={{ marginBottom: "15px" }} />}

        {!otpVerified ? (
          <div className="otp-section" style={{ marginTop: "15px", padding: "15px", background: "#f9f9f9", borderRadius: "8px" }}>
            {!otpSent ? (
              <button 
                type="button" 
                onClick={handleSendOtp} 
                disabled={submitting || !form.phone}
                style={{ width: "100%", padding: "10px", background: "#2563eb", color: "white", border: "none", borderRadius: "4px" }}
              >
                {submitting ? "Sending OTP..." : "Send OTP"}
              </button>
            ) : (
              <div style={{ display: "flex", gap: "10px" }}>
                <input 
                  type="text" 
                  placeholder="Enter OTP" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)} 
                  style={{ flex: 1, padding: "10px" }}
                />
                <button 
                  type="button" 
                  onClick={handleVerifyOtp} 
                  disabled={verifying}
                  style={{ padding: "10px 20px", background: "#10b981", color: "white", border: "none", borderRadius: "4px" }}
                >
                  {verifying ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <button type="submit" disabled={submitting} style={{ marginTop: "20px" }}>
            {submitting ? "Saving..." : "Save Profile"}
          </button>
        )}
      </form>
    </div>
  );
};

export default ProviderAuth;