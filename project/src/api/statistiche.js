import { apiRequest } from "./client";

function buildQuery(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.append(key, value);
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

export function getStatistiche(token, filters = {}) {
  return apiRequest(`/api/statistiche/rimborsi/${buildQuery(filters)}`, { token });
}
