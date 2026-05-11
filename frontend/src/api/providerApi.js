import axios from "axios";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:5001"}/api/providers`;

// ✅ CREATE PROVIDER
export const createProvider = async (data) => {
  const res = await axios.post(API, data);
  return res.data;
};

// ✅ GET ALL PROVIDERS
export const getProviders = async () => {
  const res = await axios.get(API);
  return res.data;
};

// ✅ GET PROVIDER BY CLERK ID
export const getProviderByClerkId = async (clerkUserId) => {
  const res = await axios.get(`${API}/${clerkUserId}`);
  return res.data;
};

// ✅ DELETE PROVIDER
export const deleteProviderByClerkId = async (clerkUserId) => {
  const res = await axios.delete(`${API}/${clerkUserId}`);
  return res.data;
};