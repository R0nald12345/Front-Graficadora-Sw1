import { Navigate, Route, Routes } from "react-router-dom"
import Dashboard from "../components/Dashboard"

const DashboardRoutes = () => {
  return (
    <Routes>

        <Route path="/" element={<Dashboard/>}/>
        <Route path="*" element={<Navigate to="/dashboard" replace /> }/>        
        
    </Routes>

  )
}

export default DashboardRoutes