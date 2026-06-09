import { formatApiError } from "./errors";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://simulazione-backendd.onrender.com"
    : "http://127.0.0.1:8000");

export { formatApiError };

export async function apiRequest(path, options = {}) {
  const { token, body, headers = {}, ...rest } = options;

  const config = {
    ...rest,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, config);
  } catch {
    throw new Error("Impossibile contattare il server. Verifica la connessione.");
  }

  const contentType = response.headers.get("content-type");
  const data = contentType?.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(formatApiError(data) || `Errore del server (${response.status}).`);
  }

  return data;
}
