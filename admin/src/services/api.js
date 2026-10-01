
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

export default api;