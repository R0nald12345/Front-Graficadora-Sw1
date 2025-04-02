import { useForm } from "react-hook-form";
import { LoginForm } from "../../../types/indexLogin";

const Login = () => {
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = (data: LoginForm) => {
    console.log("Datos enviados:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto p-4 border rounded-lg shadow-lg">
      
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

      {/* Botón de envío */}
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 w-full">
        Iniciar Sesión
      </button>

    </form>
  );
};

export default Login;
