export interface LoginForm {
    email: string;
    password: string;
  }
  
  export interface RegisterForm extends LoginForm {
    name: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: {
      id: string;
      nombre: string;
      email: string;
    };
  }