import axios from "axios";

import { store } from "@/stores/store";
import { logout } from "@/stores/slices/authSlice";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  // Adjust this line to match your actual state structure.
  // For example, if the token is under notes, use: store.getState().notes.token
  // If you intended to have an 'auth' slice, make sure it's added to your root reducer.
  const token = (store.getState() as any).auth?.token;

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

// Auto logout if token expires (401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
    }

    return Promise.reject(error);
  }
);

export default apiClient;
