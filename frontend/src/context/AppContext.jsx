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
        refreshProviders
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);