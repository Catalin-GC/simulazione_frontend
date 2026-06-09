import { apiRequest } from "./client";

export function login(email, password) {
  return apiRequest("/api/auth/login/", {
    method: "POST",
    body: { email, password },
  });
}

export function register(userData) {
  return apiRequest("/api/auth/register/", {
    method: "POST",
    body: userData,
  });
}

export function getMe(token) {
  return apiRequest("/api/auth/me/", { token });
}
