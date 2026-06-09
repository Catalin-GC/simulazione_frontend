import { apiRequest } from "./client";

function buildQuery(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.append(key, value);
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

export function getRimborsi(token, filters = {}) {
  return apiRequest(`/api/rimborsi/${buildQuery(filters)}`, { token });
}

export function getRimborso(token, id) {
  return apiRequest(`/api/rimborsi/${id}/`, { token });
}

export function createRimborso(token, data) {
  return apiRequest("/api/rimborsi/", { method: "POST", token, body: data });
}

export function updateRimborso(token, id, data) {
  return apiRequest(`/api/rimborsi/${id}/`, { method: "PUT", token, body: data });
}

export function deleteRimborso(token, id) {
  return apiRequest(`/api/rimborsi/${id}/`, { method: "DELETE", token });
}

export function approvaRimborso(token, id) {
  return apiRequest(`/api/rimborsi/${id}/approva/`, { method: "PUT", token });
}

export function rifiutaRimborso(token, id, motivazione_rifiuto = "") {
  return apiRequest(`/api/rimborsi/${id}/rifiuta/`, {
    method: "PUT",
    token,
    body: { motivazione_rifiuto },
  });
}

export function liquidaRimborso(token, id) {
  return apiRequest(`/api/rimborsi/${id}/liquida/`, { method: "PUT", token });
}
