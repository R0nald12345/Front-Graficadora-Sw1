import React, { useState, useEffect, createContext, useContext } from 'react';

//tipos
interface User {
  id:number;
  email: string;
  nombre: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    user: any | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<any | null>(null);

    // Verifica si hay un token almacenado al cargar la aplicación
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsAuthenticated(true);
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            setUser(userData);
        }
    }, []);


    const login = async (email: string, password: string) => {
        try {
            // Aquí conectarías con tu API para autenticar
            // Por ahora simulamos una autenticación exitosa
            const fakeUserData = { id: 1, email, name: 'Usuario Demo' };
            const fakeToken = 'token-demo-123456';

            localStorage.setItem('authToken', fakeToken);
            localStorage.setItem('userData', JSON.stringify(fakeUserData));
            setIsAuthenticated(true);
            setUser(fakeUserData);

            return Promise.resolve();
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    };


    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
          {children}
        </AuthContext.Provider>
      );
    };
    
    export const useAuth = () => {
      const context = useContext(AuthContext);
      if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
      }
      return context;
    };
    