import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message;

        // For file upload errors, show more specific message
        if (error.response?.status === 413) {
            toast.error('File size exceeds 5MB limit');
        } else if (error.response?.status === 400 && message.includes('file')) {
            toast.error(message);
        }
        // Don't show toast for 401 (unauthorized) to avoid spamming
        else if (error.response?.status !== 401) {
            toast.error(message || 'Something went wrong!');
        }

        // If token is expired or invalid, redirect to login
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;