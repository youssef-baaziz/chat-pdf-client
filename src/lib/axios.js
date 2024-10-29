import axios from 'axios';
import { createApp } from 'vue';

const HTTP = axios.create({
  baseURL: 'http://127.0.0.1:5054',
  headers: {
    common: {
      'X-Requested-With': 'XMLHttpRequest',
    },
  },
  withCredentials: true,
});

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

// Create a Vue application instance
const app = createApp({});

// Make HTTP globally available in your Vue 3 app
app.config.globalProperties.$axios = HTTP;
HTTP.defaults.showLoader = true;
HTTP.defaults.withCredentials = true;

export { HTTP };
