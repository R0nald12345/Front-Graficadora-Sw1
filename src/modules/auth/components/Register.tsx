import { useForm } from "react-hook-form";
import { RegisterForm } from "../types/auth.types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

const Register = () => {
    const { register: registerUser, isLoading } = useAuth();
    const navigate = useNavigate();
  
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<RegisterForm>();
  
    const onSubmit = async (data: RegisterForm) => {
      try {
        await registerUser(data);
        navigate('/login');
      } catch (error) {
        console.error(error);
      }
    };
  
    return (
        <div
          className="w-full h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
          style={{
            backgroundImage: "url('/ImagenFondo.jpg')",
            backgroundSize: 'contain',
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
    
          <div className="relative z-10 p-8 w-96 bg-white rounded-md shadow-lg">
            <h2 className="font-semibold text-3xl text-center mb-6">Registro</h2>
    
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Nombre */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  placeholder="Ingrese su nombre"
                  {...register("name", {
                    required: "El nombre es obligatorio",
                    minLength: {
                      value: 2,
                      message: "El nombre debe tener al menos 2 caracteres",
                    },
                  })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Correo</label>
                <input
                  type="email"
                  placeholder="Ingrese su correo"
                  {...register("email", {
                    required: "El correo es obligatorio",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Ingrese un correo válido",
                    },
                  })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>
    
              {/* Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                <input
                  type="password"
                  placeholder="Ingrese su contraseña"
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                    minLength: {
                      value: 6,
                      message: "La contraseña debe tener al menos 6 caracteres",
                    },
                  })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>
    
              {/* Botón de envío */}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 
                          transition duration-200 disabled:bg-blue-300"
                disabled={isLoading}
              >
                {isLoading ? 'Registrando...' : 'Registrarse'}
              </button>

              {/* Link para ir al login */}
              <p className="text-center mt-4 text-sm text-gray-600">
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login" className="text-blue-500 hover:text-blue-700">
                  Inicia sesión aquí
                </Link>
              </p>
            </form>
          </div>
        </div>
    );
};
  
export default Register;