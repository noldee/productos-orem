import Cookies from "js-cookie";
import { api } from "./api";

const TOKEN_KEY = "access_token";

// ── Token ──────────────────────────────────────
export const saveToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, {
    expires: 7,
    secure: true, // siempre true cuando sameSite es "none"
    sameSite: "none", // ← este es el cambio clave
    path: "/",
  });
};

export const getToken = () => Cookies.get(TOKEN_KEY);

export const removeToken = () => {
  Cookies.remove(TOKEN_KEY, { path: "/", sameSite: "none", secure: true });
};
// ── Auth ───────────────────────────────────────
export async function login(email: string, password: string) {
  const { data } = await api.post("/auth/login", { email, password });
  saveToken(data.access_token);

  const { data: me } = await api.get("/users/me", {
    headers: { Authorization: `Bearer ${data.access_token}` },
  });

  return { access_token: data.access_token, user: me };
}

export async function register(email: string, password: string, name?: string) {
  const { data } = await api.post("/auth/register", { email, password, name });
  return data;
}

export function logout() {
  removeToken();
}

export function isAuthenticated() {
  return !!getToken();
}
