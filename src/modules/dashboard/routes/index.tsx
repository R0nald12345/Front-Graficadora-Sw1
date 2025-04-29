import { Navigate, Route, Routes } from "react-router-dom"
import Dashboard from "../components/Dashboard"
import GraficadoraPrincipal from "../../editor/components/GraficadoraPrincipal"

const DashboardRoutes = () => {
  return (
    <Routes>

        <Route path="/" element={<Dashboard/>}/>
        <Route path="/proyecto/:id" element={<GraficadoraPrincipal />} />
        <Route path="*" element={<Navigate to="/dashboard" replace /> }/>        
        
    </Routes>

  )
}

export default DashboardRoutes