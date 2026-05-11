import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/react";
import "./Onboarding.css";

const Onboarding = () => {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, user } = useUser();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      navigate("/");
    }
  }, [isLoaded, isSignedIn, navigate]);

  const handleRoleSelect = async (selectedRole) => {
    if (!user) return;

    try {
      setSaving(true);

      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          role: selectedRole,
          providerVerified:
            selectedRole === "provider"
              ? user.unsafeMetadata?.providerVerified || false
              : false
        }
      });

      await user.reload();

   if (selectedRole === "user") {
  navigate("/");
} else {
  navigate("/provider-auth"); 
}
    } catch (error) {
      console.error("Failed to save role:", error);
      alert("Failed to save role. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="onboarding">
      <h1>Welcome 👋</h1>
      <p>What do you want to do?</p>

      <div className="options">
        <button
          className="user-btn"
          onClick={() => handleRoleSelect("user")}
          disabled={saving}
        >
          {saving ? "Saving..." : "Find Services"}
        </button>

        <button
          className="provider-btn"
          onClick={() => handleRoleSelect("provider")}
          disabled={saving}
        >
          {saving ? "Saving..." : "Become a Provider"}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;