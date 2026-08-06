import axios from "axios";

// Base URL is configurable via VITE_API_URL for deployment.
// Defaults to the deployed (Render) backend so the production bundle
// always points to the live API. For local development, set VITE_API_URL
// to http://localhost:5000/api via a frontend/.env.local file.
const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "https://launchboard-backend.onrender.com/api",
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
