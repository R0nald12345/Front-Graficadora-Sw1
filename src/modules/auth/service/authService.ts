import axios from 'axios';
import { AuthResponse, LoginForm, RegisterForm } from '../types/auth.types';

//Me creo  una instancia de Axios con la URL base
const API_URL = import.meta.env.VITE_API_URL;


// Servicio de autenticación

export const authService = {
    async login(credentials: LoginForm) {
      try {
        const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, credentials);
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        return response.data;
      } catch (error) {
        // throw this.handleError(error);
        console.error('Error en login authService:', error);
      }
    },
  
    async register(userData: RegisterForm) {
      try {
        const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, userData);
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        return response.data;
      } catch (error) {
        console.error('Error en register authService:', error);
      }
    },
  
    logout(): void {
      localStorage.removeItem('token');
    },
  
    // private handleError(error: any): Error {
    //   if (axios.isAxiosError(error)) {
    //     return new Error(error.response?.data?.message || 'Error en la autenticación');
    //   }
    //   return new Error('Error inesperado');
    // }
  };