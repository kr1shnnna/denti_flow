
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// =========================
// Admin Login
// =========================

export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

// =========================
// Get Patients
// =========================

export const getPatients = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/users/patients", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};


// =========================
// Get Admin Appointments
// =========================

export const getAdminAppointments = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/appointments/admin", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};



// =========================
// Get Doctors
// =========================

export const getDoctors = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/doctors", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// =========================
// Create Doctor
// =========================

export const createDoctor = async (doctorData) => {
  const token = localStorage.getItem("token");

  const response = await api.post("/doctors", doctorData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// =========================
// Update Doctor Availability
// =========================

export const updateDoctorAvailability = async (
  doctorId,
  availability
) => {
  const token = localStorage.getItem("token");

  const response = await api.patch(
    `/doctors/${doctorId}/availability`,
    {
      availability,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


export default api;
