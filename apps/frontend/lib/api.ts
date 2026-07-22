const CSRF_COOKIE_NAME = "csrftoken";
const CSRF_HEADER_NAME = "X-CSRFToken";
const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown, message?: string) {
    super(message ?? `API request failed with status ${status}`);
    this.status = status;
    this.body = body;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method ?? "GET").toUpperCase();
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (MUTATING_METHODS.has(method)) {
    const csrfToken = getCookie(CSRF_COOKIE_NAME);
    if (csrfToken) {
      headers.set(CSRF_HEADER_NAME, csrfToken);
    }
  }

  const response = await fetch(`/api${path}`, {
    ...options,
    method,
    headers,
    credentials: "same-origin",
    cache: "no-store",
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const isJson = response.headers.get("Content-Type")?.includes("application/json");
  const body = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new ApiError(response.status, body);
  }

  return body as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "POST", body: data !== undefined ? JSON.stringify(data) : undefined }),
  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "PATCH", body: data !== undefined ? JSON.stringify(data) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
