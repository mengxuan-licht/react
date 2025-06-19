import axios from 'axios';
import { getToken, setToken, removeToken } from './auth';
import { tokenManager } from './tokenManager';
import { API_CONFIG } from '../config';

const Request = () => {
  const instance = axios.create({
    baseURL: API_CONFIG.baseURL,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  instance.interceptors.request.use(config => {
    const token = getToken();
    if (token) config.headers.Authorization = token;
    else delete config.headers.Authorization;
    return config;
  });

  instance.interceptors.response.use(
    response => {
      if (response.data && response.data.token) {
        setToken(response.data.token);
        tokenManager.reset();
      }
      return response;
    },
    error => {
      if (error.response) {
        const expired = tokenManager.checkTokenExpiry(error.response);
        if (expired) {
          alert('登入已過期，請重新登入');
          removeToken();
          window.location.reload();
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default Request;
