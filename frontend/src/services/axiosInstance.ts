/**
 * axiosInstance.ts — Configured Axios HTTP Client
 *
 * Provides a pre-configured Axios instance with:
 *  - Base URL from environment variable
 *  - Default JSON content-type header
 *  - Request interceptor: attaches Firebase ID Token for authenticated requests
 *  - Response interceptor: normalizes errors
 *
 * Import this instance (not raw axios) in all service modules.
 */

import axios from 'axios';
import { auth } from '../firebase/firebase';

// Use env var if set, otherwise fall back to Render in production and localhost in dev
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? 'https://codealpha-backend-tfvk.onrender.com'
    : 'http://localhost:5000');

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60_000, // 60 seconds to accommodate Render free tier spin-up
});

// ── Request Interceptor ───────────────────────────────────────────────────────
// If a Firebase user is currently signed in, attach their fresh ID Token
// as a Bearer token. The token is refreshed automatically by the Firebase SDK.
axiosInstance.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      // forceRefresh = false → returns cached token unless close to expiry
      const token = await user.getIdToken(false);
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response Interceptor ──────────────────────────────────────────────────────
// Normalize error shape for consistent handling across the app.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Unexpected error occurred.';
    return Promise.reject(new Error(message));
  },
);

export default axiosInstance;
