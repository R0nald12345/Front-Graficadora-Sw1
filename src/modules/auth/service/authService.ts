import axios from 'axios';

//Me creo  una instancia de Axios con la URL base
const API_URL = import.meta.env.VITE_API_URL;

//interfaces
interface RegisterData{
    email: string;
    password: string;
    nombre: string;
}

interface LoginData{
    email: string;
    password: string;
}

interface AuthResponse{
    user: {
        id: number;
        email: string;
        name: string;
    };
    token: string;
}

// Servicio de autenticación
const AuthService = {
    //Registro de Usuario
    register: async (data:RegisterData): Promise<AuthResponse> =>{
        try {
            const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, data);
            return response.data;
        }catch(error:any){
            if(error.response){
                throw new Error(error.response.data.message || 'Error en el registro');
            }
        }
        throw console.error('Error en el registro desde authService');
        
    },

    //inicio sesion
    login: async(data:LoginData):Promise<AuthResponse>=>{
        try{
            const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, data);
            return response.data;
        }catch(error:any){
            if(error){
                throw new Error(error.response.data.message || 'Error en el login');
            }
            throw console.error('Error en el login desde authService');
        }
    }

};

export default AuthService;