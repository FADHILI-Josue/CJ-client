import apiClient from './api';

export interface RegisterData {
    email: string;
    fullName: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        fullName: string;
    };
}

export const authService = {
    async register(data: RegisterData): Promise<{ message: string }> {
        const response = await apiClient.post('/auth/register', data);
        return response.data;
    },

    async login(data: LoginData): Promise<AuthResponse> {
        const response = await apiClient.post('/auth/login', data);
        return response.data;
    },
};