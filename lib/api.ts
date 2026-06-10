import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  // ← QUITA withCredentials, ya no necesitas cookies httpOnly
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isRestoreSession = error.config?.url?.includes("/users/me");
    if (error.response?.status === 401 && !isRestoreSession) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);