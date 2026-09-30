
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// =========================
// Get logged-in doctor
// =========================

export const getMyDoctorProfile = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/doctors/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// =========================
// Get doctor's appointments
// =========================

export const getDoctorAppointments = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/appointments/doctor", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// =========================
// Update appointment status
// =========================

export const updateAppointmentStatus = async (
  appointmentId,
  status
) => {
  const token = localStorage.getItem("token");

  const response = await api.patch(
    `/appointments/${appointmentId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// =========================
// Update my availability
// =========================

export const updateMyDoctorAvailability = async (
  availability
) => {
  const token = localStorage.getItem("token");

  const response = await api.patch(
    "/doctors/me/availability",
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



// =========================
// Get doctor notifications
// =========================

export const getDoctorNotifications = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/notifications", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// =========================
// Mark notification as read
// =========================

export const markNotificationAsRead = async (
  notificationId
) => {
  const token = localStorage.getItem("token");

  const response = await api.patch(
    `/notifications/${notificationId}/read`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// =========================
// Mark all notifications as read
// =========================

export const markAllNotificationsAsRead = async () => {
  const token = localStorage.getItem("token");

  const response = await api.patch(
    "/notifications/read-all",
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

