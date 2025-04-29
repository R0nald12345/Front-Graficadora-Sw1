// import Dashboard from "./modules/dashboard/components/Dashboard"
// import DashboardRoutes from "./modules/dashboard/routes"
// import Login from "./modules/auth/components/Login"
// import GraficadoraPrincipal from "./modules/editor/components/GraficadoraPrincipal"
// import GraficadoraPrincipal from "./modules/editor/components/GraficadoraPrincipal"
import GraficadoraPrincipal from "./modules/editor/components/GraficadoraPrincipal"
// import AppRoutes from "./routers"
// import AppRoutes from "./routers"

function App() {
 
  const proyectoId = 1;

  return (
    <>
      {/* <AppRoutes/> */}
      <GraficadoraPrincipal proyectoId={proyectoId} />  
      {/* <DashboardRoutes/> */}
      {/* <Dashboard/> */}
      {/* <Login/> */}

    </>
  )
}

export default App
