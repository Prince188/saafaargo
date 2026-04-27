import axios from 'axios';
import { showError, showSuccess } from './toastConfig';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Request interceptor
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        showError('Request failed. Please check your connection.');
        return Promise.reject(error);
    }
);

// Response interceptor
API.interceptors.response.use(
    (response) => {
        // You can show success messages based on response status
        if (response.config.method === 'post') {
            showSuccess('Created successfully!');
        } else if (response.config.method === 'put') {
            showSuccess('Updated successfully!');
        } else if (response.config.method === 'delete') {
            showSuccess('Deleted successfully!');
        }
        return response;
    },
    (error) => {
        // Handle different error status codes
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    showError(error.response.data.message || 'Bad request');
                    break;
                case 401:
                    showError('Session expired. Please login again.');
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    break;
                case 403:
                    showError('You don\'t have permission to perform this action');
                    break;
                case 404:
                    showError('Resource not found');
                    break;
                case 500:
                    showError('Server error. Please try again later.');
                    break;
                default:
                    showError(error.response.data.message || 'Something went wrong');
            }
        } else if (error.request) {
            showError('Network error. Please check your internet connection.');
        } else {
            showError('An unexpected error occurred');
        }
        return Promise.reject(error);
    }
);

export default API;