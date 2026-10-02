
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// =========================
// Authentication
// =========================

export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);

  return response.data;
};

// =========================
// Doctors
// =========================

export const getDoctors = async () => {
  const response = await api.get("/doctors");

  return response.data;
};

// =========================
// Appointments
// =========================

// Get available slots for a particular doctor and date
export const getAvailableSlots = async (doctorId, date) => {
  const response = await api.get(
    `/appointments/available-slots/${doctorId}`,
    {
      params: {
        date,
      },
    }
  );

  return response.data;
};

// Create a new appointment
export const createAppointment = async (appointmentData) => {
  const token = localStorage.getItem("token");

  const response = await api.post(
    "/appointments",
    appointmentData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Get logged-in patient's appointments
export const getMyAppointments = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/appointments/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Cancel patient's appointment
export const cancelAppointment = async (appointmentId) => {
  const token = localStorage.getItem("token");

  const response = await api.patch(
    `/appointments/${appointmentId}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export default api;
