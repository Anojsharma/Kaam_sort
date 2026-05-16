import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "@clerk/react";
import { syncUser } from "./api/userApi";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import ProviderAuth from "./pages/ProviderAuth/ProviderAuth";
import ProviderDashboard from "./pages/ProviderDashboard/ProviderDashboard";
import Search from "./pages/Search/Search";
import ProviderDetails from "./pages/ProviderDetails/ProviderDetails";
import Booking from "./pages/Booking/Booking";
import MyBookings from "./pages/MyBookings/MyBookings";
import Footer from "./components/Footer/Footer";
import Onboarding from "./pages/Onboarding/Onboarding";
import AuthRedirect from "./pages/AuthRedirect/AuthRedirect";
import NetworkErrorBoundary from "./components/NetworkErrorBoundary/NetworkErrorBoundary";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
function App() {
  const { user, isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    const sync = async () => {
      if (isLoaded && isSignedIn && user) {
        const role = user.unsafeMetadata?.role;
        // Also sync if no role yet, they might just be created.
        // Actually onboarding sets the role and syncs, but it's safe to sync anytime.
        if (role === "user") {
          try {
            await syncUser({
              clerkUserId: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              firstName: user.firstName,
              lastName: user.lastName,
              imageUrl: user.imageUrl
            });
          } catch (err) {
            console.error("Global sync failed:", err);
          }
        }
      }
    };
    sync();
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded) {
    return <LoadingScreen message="Starting Kaam Sorted..." />;
  }

  return (
    <NetworkErrorBoundary>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/provider-auth" element={<ProviderAuth />} />
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />
          <Route path="/provider/:id" element={<ProviderDetails />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/auth" element={<AuthRedirect />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </NetworkErrorBoundary>
  );
}

export default App;