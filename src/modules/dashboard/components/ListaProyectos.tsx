import { useEffect, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth"
import { proyectoService } from "../services/proyectoService";
import Lista from "./ListadoProyecto/Lista"
import { Proyecto } from "../types/proyecto.types";
import ModalCrearProyecto from "./modal/ModalCrearProyecto";


interface HeaderProps {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
}


const ListaProyectos = ({openModal, setOpenModal}: HeaderProps) => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const getListProject = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token") || "";
      const userId = typeof user?.id === 'string' ? parseInt(user.id, 10) : user?.id || 0;

      const response = await proyectoService.getProyectosByIdUsuario({
        id: userId,
        token
      });

      setProyectos(response);
    } catch (error) {
      console.error("Error getListProject ListaProyectos.tsx:", error);
     
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      getListProject();
      console.log(proyectos);
    }
  }, [user]);

  return (
    <>
      <ModalCrearProyecto
        open = {openModal}
        onClose = {() => setOpenModal(!openModal)}
        proyectos = {proyectos}
        setProyectos={setProyectos}
        // tipoColegio = {datoTipoColegios}
        // setTipoColegio={setTipoColegios}
      />
      <section className="flex flex-col justify-center w-[80%] mx-auto mt-5">
        <h4 className="mx-auto text-center  text-2xl font-semibold text-white ">Mis Proyectos</h4>
        <div className="w-full flex bg-white rounded-2xl">
          <h4 className="font-semibold text-start w-[30%] px-3 py-2">
            Nombre
          </h4>
          <h4 className="font-semibold text-start w-[50%] px-3 py-2">
            Descripcion
          </h4>
          <h4 className="font-semibold text-center w-[20%] px-3 py-2">
            Acciones
          </h4>
        </div>

        <ul className="overflow-y-auto scrollbar-hide bg-white/50">
          {isLoading ? (
            <div className="text-center py-4">Cargando...</div>
          ) : proyectos.length > 0 ? (
            proyectos.map((proyecto) => (
              <Lista
                key={proyecto.id}
                proyecto={proyecto}
                setProyectos={setProyectos}
                proyectos={proyectos}
              />
            ))
          ) : (
            <div className="text-center py-4">No hay proyectos disponibles</div>
          )}
        </ul>
      </section>
    </>
  );
};

export default ListaProyectos;