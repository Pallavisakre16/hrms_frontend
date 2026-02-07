// frontend/src/api.js
import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE || "https://hrms-backend-pqxp.onrender.com";

const api = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 10000
});

// 🔐 Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  // OAuth2 expects x-www-form-urlencoded
  login: (username, password) => {
    const data = new URLSearchParams();
    data.append("username", username);
    data.append("password", password);

    return axios.post(`${BASE}/admin/login`, data, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
  },

  logout: () => {
    localStorage.removeItem("access_token");
  }
};

export const employees = {
  list: () => api.get("/employees"),
  create: (payload) => api.post("/employees", payload),
  delete: (id) => api.delete(`/employees/${id}`)
};

export const attendance = {
  mark: (payload) => api.post("/attendance", payload),
  listAll: (params) => api.get("/attendance", { params }),
  listByEmployee: (id, params) => api.get(`/employees/${id}/attendance`, { params }),
  presentDays: () => api.get("/present-days"),
  presentDaysForEmployee: (id) => api.get(`/employees/${id}/present-days`),
  dashboard: () => api.get("/dashboard")
};

export default api;
