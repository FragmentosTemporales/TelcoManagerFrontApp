import axios from 'axios';
import { store } from '../store/store';
import { setLogout } from '../slices/authSlice';

const baseUrl = import.meta.env.VITE_BASE_URL;

const client = axios.create({
  baseURL: baseUrl,
});

// request interceptor: attach token and check expiry
client.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    const exp = Number(localStorage.getItem('token_expires_at')) || 0;
    if (token) {
      // if expired, dispatch logout and reject
      if (Date.now() > exp) {
        store.dispatch(setLogout());
        return Promise.reject(new Error('token_expired'));
      }
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
}, (error) => Promise.reject(error));

export default client;
