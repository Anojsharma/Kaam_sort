import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
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
  );
}

export default App;