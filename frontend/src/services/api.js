import axios from "axios";

// Base URL is configurable via VITE_API_URL for deployment.
// Defaults to local backend during development.
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
