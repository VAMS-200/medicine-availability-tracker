import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://medicine-tracker-backend-jekt.onrender.com/api",
});


// Attach token from localStorage to every request (if present)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("mat_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------- Auth APIs ----------
export const registerStore = (data) => api.post("/auth/register", data);
export const loginStore = (data) => api.post("/auth/login", data);
export const getCurrentStore = () => api.get("/auth/me");

// ---------- Inventory APIs ----------
export const getInventory = () => api.get("/inventory");
export const getMedicineById = (id) => api.get(`/inventory/${id}`);
export const createMedicine = (data) => api.post("/inventory", data);
export const updateMedicine = (id, data) => api.put(`/inventory/${id}`, data);
export const deleteMedicine = (id) => api.delete(`/inventory/${id}`);

// ---------- Public Search ----------
export const searchMedicines = (medicineName, pincode) =>
  api.get(`/public/search?medicineName=${medicineName}&pincode=${pincode}`);


export default api;
