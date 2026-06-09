const API_BASE_URL = "http://127.0.0.1:8000";

export function formatApiError(data) {
  if (!data) return "Errore sconosciuto.";
  if (typeof data === "string") return data;
  if (data.detail) return data.detail;

  return Object.entries(data)
    .map(([field, messages]) => {
      const text = Array.isArray(messages) ? messages.join(" ") : messages;
      return `${field}: ${text}`;
    })
    .join(" ");
}

export async function apiRequest(path, options = {}) {
  const { token, body, headers = {}, ...rest } = options;

  const config = {
    ...rest,
    headers: {
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

  const response = await fetch(`${API_BASE_URL}${path}`, config);
  const contentType = response.headers.get("content-type");
  const data = contentType?.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(formatApiError(data) || `Errore ${response.status}`);
  }

  return data;
}
