import axios from "axios";

const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://leafora-smart-restaurant.onrender.com";

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;