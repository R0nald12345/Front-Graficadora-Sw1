import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../modules/auth/hooks/useAuth'
import PublicRoute from './PublicRoute'
import ProtectedRoute from './ProtectedRoute'


const LoadingFallback = () => <div>Cargando....</div>

// Carga diferida de los módulos
const AuthRoutes = lazy(() => import('../modules/auth/routes/index'))
const DashboardRoutes = lazy(() => import('../modules/dashboard/routes'))
const EditorRoutes = lazy(() => import('../modules/editor/routes'))


const AppRoutes = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                        {/* Rutas públicas */}
                        <Route element={<PublicRoute />}>
                            <Route path="/auth/*" element={<AuthRoutes />} />
                        </Route>


                        {/* Rutas protegidas */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/dashboard/*" element={<DashboardRoutes />} />
                            <Route path="/editor/*" element={<EditorRoutes />} />
                        </Route>

                        {/* Ruta por defecto */}
                        <Route path="*" element={<Navigate to="/auth/login" replace />} />

                    </Routes>
                </Suspense>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default AppRoutes