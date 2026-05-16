import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5001"}/api/bookings`;

export const createBooking = async (bookingData) => {
  try {
    const response = await axios.post(API_URL, bookingData);
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const getUserBookings = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    throw error;
  }
};

export const updateBookingStatus = async (id, status) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw error;
  }
};

export const updateBookingDate = async (id, date) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/date`, { date });
    return response.data;
  } catch (error) {
    console.error("Error updating booking date:", error);
    throw error;
  }
};

export const getProviderBookings = async (providerId) => {
  try {
    const response = await axios.get(`${API_URL}/provider/${providerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching provider bookings:", error);
    throw error;
  }
};
