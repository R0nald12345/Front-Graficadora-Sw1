import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../modules/auth/hooks/useAuth"

const PublicRoute = ()=>{
    const { isAuthenticated} = useAuth();
    //Si esta Autenticado Redirige al Dashboard
    if( isAuthenticated ){
        return <Navigate to="/dashboard" replace />;
    }

    // Renderiza las rutas públicas
    return <Outlet/>
}

export default PublicRoute;