import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const syncUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/sync`, userData);
    return response.data;
  } catch (error) {
    console.error("Error syncing user:", error);
    throw error;
  }
};
