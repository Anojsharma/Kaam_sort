import { createContext, useContext, useState, useEffect } from "react";
import { getProviders } from "../api/providerApi";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [providers, setProviders] = useState([]);
  const [providersLoading, setProvidersLoading] = useState(true);
  const [providersError, setProvidersError] = useState(null);

  const [filters, setFilters] = useState({
    category: null
  });

  const [bookings, setBookings] = useState([]);

  // ✅ Load bookings
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("bookings")) || [];
      setBookings(data);
    } catch {
      setBookings([]);
    }
  }, []);

  const addBooking = (booking) => {
    const updated = [...bookings, booking];
    setBookings(updated);
    localStorage.setItem("bookings", JSON.stringify(updated));
  };

  const cancelBooking = (id) => {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    localStorage.setItem("bookings", JSON.stringify(updated));
  };

  const updateBooking = (updatedBooking) => {
    const updated = bookings.map((b) =>
      b.id === updatedBooking.id ? updatedBooking : b
    );

    setBookings(updated);
    localStorage.setItem("bookings", JSON.stringify(updated));
  };

  // ✅ Fetch providers (REAL backend only)
  const fetchProviders = async () => {
    setProvidersLoading(true);
    setProvidersError(null);

    try {
      const data = await getProviders();

      if (Array.isArray(data)) {
        setProviders(data);
      } else {
        throw new Error("Invalid API response");
      }

    } catch (err) {
      console.error("❌ Fetch providers failed:", err.message);
      setProvidersError("Failed to load providers");
      setProviders([]); // ❗ do NOT fallback to dummy
    } finally {
      setProvidersLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const safeFetch = async () => {
      await fetchProviders();
      if (!isMounted) return;
    };

    safeFetch();

    return () => {
      isMounted = false;
    };
  }, []);

  // ✅ Refresh (after create/delete)
  const refreshProviders = async () => {
    await fetchProviders();
  };

  return (
    <AppContext.Provider
      value={{
        providers,
        providersLoading,
        providersError,
        filters,
        setFilters,
        bookings,
        addBooking,
        cancelBooking,
        updateBooking,
        refreshProviders
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);