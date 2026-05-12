import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5001"}/api/users`;

export const syncUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/sync`, userData);
    return response.data;
  } catch (error) {
    console.error("Error syncing user:", error);
    throw error;
  }
};

export const deleteUserByClerkId = async (clerkUserId) => {
  try {
    const response = await axios.delete(`${API_URL}/${clerkUserId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
