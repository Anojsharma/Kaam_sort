import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/react";
import { getProviderByClerkId } from "../../api/providerApi";

const AuthRedirect = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserFlow = async () => {
      if (!isLoaded) return;

      if (!isSignedIn) {
        navigate("/");
        return;
      }

      // ✅ FIX: get role from Clerk ONLY
      const role = user?.unsafeMetadata?.role;

      if (!role) {
        navigate("/onboarding");
        return;
      }

      if (role === "user") {
        navigate("/");
        return;
      }

      if (role === "provider") {
        try {
          const data = await getProviderByClerkId(user.id);

          if (data) {
            navigate("/provider-dashboard");
          } else {
            navigate("/provider-auth");
          }

        } catch (err) {
          navigate("/provider-auth");
        }
      }
    };

    checkUserFlow();
  }, [isLoaded, isSignedIn, user, navigate]);

  return <h2>Checking user...</h2>;
};

export default AuthRedirect;