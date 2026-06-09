import { apiRequest } from "./client";

export function getCategorie(token) {
  return apiRequest("/api/categorie-spesa/", { token });
}
