import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Access token lives only in memory (never localStorage) and is set by
// AuthContext once login/refresh succeeds.
let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function clearAccessToken() {
  accessToken = null;
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Separate client for the refresh call itself so the 401 interceptor
// below never tries to refresh a failed refresh (would loop forever).
const refreshClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// De-duplicate concurrent refresh attempts so a burst of 401s only
// triggers one call to /auth/refresh.
let refreshPromise = null;

function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post("/auth/refresh")
      .then((response) => {
        const newToken = response.data.data.accessToken;
        setAccessToken(newToken);
        return newToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

// Routes that should never trigger a silent refresh-and-retry, because
// a 401 from them is a real, final answer (bad credentials, or the
// refresh call itself failing).
const NO_REFRESH_PATHS = ["/auth/login", "/auth/register", "/auth/refresh"];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const url = originalRequest?.url || "";
    const isExemptPath = NO_REFRESH_PATHS.some((path) => url.includes(path));

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry ||
      isExemptPath
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newToken = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      clearAccessToken();
      return Promise.reject(refreshError);
    }
  },
);

/**
 * Extracts a human-readable message from an API error, falling back to
 * a generic message for network failures with no response at all.
 */
export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message === "Network Error") {
    return "Could not reach the server. Check your connection and try again.";
  }
  return fallback;
}

export default api;
