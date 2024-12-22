import axiosInstance from '../http/axios';
import { AuthCredentials, AuthResponse } from '@/domain/auth/types';

export const authApi = {
  signIn: async (credentials: AuthCredentials) => {
    const response = await axiosInstance.post<AuthResponse>('/auth/signin', credentials);
    return response.data;
  },

  signUp: async (credentials: AuthCredentials) => {
    const response = await axiosInstance.post<AuthResponse>('/auth/signup', credentials);
    return response.data;
  },
};