import Header from "./Header"
import ListaProyectos from "./ListaProyectos"


const Dashboard = () => {

  

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
          <Header/>

          <ListaProyectos/>
        </div>
      </div>
    
    </>
  )
}

export default Dashboard