import { Navigate, Route, Routes } from "react-router-dom"
import { lazy, Suspense } from "react"

const Login = lazy(() => import('../components/Login'))
// const Register = lazy(() => import('../page/LoginPage')); 
// const ForgotPassword = lazy(() => import('../components/ForgotPassword')); 

// Componente de carga
const LoadingComponent = () => <div>Cargando...</div>;

const AuthRoutes = () => {
    return (
        <Routes>

            <Route path="/login" element={
                <Suspense fallback={<LoadingComponent />}>
                    <Login />
                </Suspense>
            } />

            {/* Añade otras rutas según sea necesario */}
            {/* <Route path="/register" element={
                <Suspense fallback={<LoadingComponent />}>
                    <Register />
                </Suspense>
            } />
            <Route path="/forgot-password" element={
                <Suspense fallback={<LoadingComponent />}>
                    <ForgotPassword />
                </Suspense>
            } /> */}


            <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
    )
}

export default AuthRoutes;