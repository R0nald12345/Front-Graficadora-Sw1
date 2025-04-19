import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../modules/auth/hooks/useAuth";


const ProtectedRoute = () => {
    const {isAuthenticated} = useAuth();

    //Si no esta Autenticado Redirige al Login
    if( !isAuthenticated ){
        return <Navigate to="/auth/login" replace />;
    }

    // Renderiza las rutas hijas si está autenticado
    return  <Outlet/>   

}

export default ProtectedRoute