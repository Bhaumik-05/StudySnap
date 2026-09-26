import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/*
 * Access token lives only in memory.
 * It is provided by AuthContext.
 */
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

/*
 * Separate client for refreshing the access token.
 *
 * We intentionally don't use `api` here because `api`
 * has the 401 interceptor below. Otherwise a failed
 * refresh could trigger another refresh indefinitely.
 */
const refreshClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

/*
 * Attach access token to protected requests.
 */
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/*
 * Prevent multiple requests from refreshing the token
 * simultaneously.
 */
let refreshPromise = null;

async function refreshAccessToken() {
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

/*
 * If a protected request returns 401:
 *
 * 1. Refresh access token using HTTP-only cookie.
 * 2. Store new access token in memory.
 * 3. Retry the original request once.
 */
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry ||
      originalRequest?.url === "/auth/refresh"
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

export default api;