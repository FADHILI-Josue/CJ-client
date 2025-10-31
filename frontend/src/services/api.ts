import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { useDevice } from '../hooks/useDevice';

const { deviceId } = useDevice();

const apiClient = axios.create({
    // @ts-ignore
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
    headers: {
        'Content-Type': 'application/json',
        'Device-ID': deviceId,
    },
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);

export default apiClient;