import axios from 'axios';
import { ROUTES } from '../constants/routes';

const baseURL = import.meta.env?.VITE_API_URL || 'http://localhost:3001';

export const AUTH_TOKEN_KEY = 'crud_full_token';
export const AUTH_USER_KEY = 'crud_full_user';

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// FormData yuborilganda Content-Type ni olib tashlash — brauzer boundary bilan multipart qo‘yadi
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      if (!window.location.pathname.startsWith(ROUTES.LOGIN)) {
        window.location.href = ROUTES.LOGIN;
      }
    }
    return Promise.reject(err);
  }
);

export const apiForm = (url: string, formData: FormData, method: 'post' | 'patch' = 'post') => {
  return api.request({
    url,
    method,
    data: formData,
  });
};
