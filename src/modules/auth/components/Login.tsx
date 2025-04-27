import { useForm } from "react-hook-form";
import { LoginForm } from "../../../types/indexLogin";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login,isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      // Los errores ya son manejados por useAuth con SweetAlert
      console.error(error);
    }
  };


  return (
    <>
      <div
        className="w-full h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
        style={{
          backgroundImage: "url('../../../../public/ImagenFondo.jpg')",
          backgroundSize: 'contain',
        }}
      >
        {/* Overlay opcional para oscurecer ligeramente la imagen */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Contenido del formulario */}
        <div className="relative z-10 p-8 w-1/3 bg-white rounded-md shadow-lg">
          <h2 className="font-semibold text-3xl text-center">Inicia Sesión</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-3 max-w-sm mx-auto p-4 border bg-white rounded-lg shadow-lg">
            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium">Correo</label>
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
                className="w-full p-2 border rounded"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium">Contraseña</label>
              <input
                type="password"
                placeholder="Contraseña"
                {...register("password", {
                  required: "La contraseña es obligatoria",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                  },
                })}
                className="w-full p-2 border rounded"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            {/* Mensaje de error general */}
            {errors.root && <p className="text-red-500 text-sm mb-4">{errors.root.message}</p>}

            {/* Botón de envío */}
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;