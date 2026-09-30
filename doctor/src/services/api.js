
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getMyDoctorProfile = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/doctors/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getDoctorAppointments = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/appointments/doctor", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};




export default api;

