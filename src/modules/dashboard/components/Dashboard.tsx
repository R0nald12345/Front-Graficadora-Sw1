import { useState } from "react";
import Header from "./Header"
import ListaProyectos from "./ListaProyectos"
import ListaInvitado from "./ListadoProyecto/ListaInvitado";
import ListaProyectoInvitado from "./ListaProyectoInvitado";


const Dashboard = () => {

  const [openModal, setOpenModal] = useState(false);

  return (
    <>
    


      <div 
        className="w-full h-screen bg-cover bg-center bg-no-repeat relative"
        style={{ 
          backgroundImage: "url('../../../../public/ImagenFondo.jpg')",
          backgroundSize: 'contain',
        }}
      >
        {/* Overlay opcional para oscurecer ligeramente la imagen */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Contenido del dashboard */}
        <div className="relative z-10 p-8 w-[70%] mx-auto">
          
          {/* Agrega aquí el resto del contenido */}
          <Header
          openModal={openModal}
          setOpenModal={setOpenModal}
          />

          <ListaProyectos
          openModal={openModal}
          setOpenModal={setOpenModal}
          />

          <ListaProyectoInvitado/>
        </div>
      </div>
    
    </>
  )
}

export default Dashboard