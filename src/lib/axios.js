import axios from 'axios';
import { createApp } from 'vue';
import store from '../store';  // Vuex store

// Create an Axios instance
const HTTP = axios.create({
  baseURL: 'http://127.0.0.1:5052',  // Flask backend URL
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,  // Include cookies for cross-origin requests if needed
});

// Request interceptor
HTTP.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
HTTP.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log("!originalRequest._retry",!originalRequest._retry);
    console.log("error.response.statusy",error.response.status);
    console.log("token",error.response && error.response.status === 401 && !originalRequest._retry);
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;  // Mark this request as retried

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          // Send the refresh token request to the server
          const { data } = await axios.post('http://127.0.0.1:5052/refresh', null, {
            headers: { Authorization: `Bearer ${refreshToken}` },
            withCredentials: true  // Ensure that cookies are sent with the request if needed
          });

          const newAccessToken = data.access_token;

          // Update the access token in local storage
          localStorage.setItem('authToken', newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // Retry the original request with the new access token
          return HTTP(originalRequest);
        } catch (refreshError) {
          console.error('Refresh token expired or invalid:', refreshError);

          // If refresh fails, you can dispatch an action to handle the user state (logout or redirect)
          store.dispatch('setActiveComponent', true);
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

// Create a Vue application instance
const app = createApp({});

// Register the store if you're using Vuex
app.use(store);

// Make HTTP globally available in your Vue 3 app
app.config.globalProperties.$axios = HTTP;

// Optional Axios defaults
HTTP.defaults.withCredentials = true;

export { HTTP };
