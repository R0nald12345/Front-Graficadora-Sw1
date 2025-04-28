import { useEffect, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { Proyecto } from "../types/proyecto.types";
import { proyectoService } from "../services/proyectoService";
import ListaInvitado from "./ListadoProyecto/ListaInvitado";



const ListaProyectoInvitado = () => {
  const [proyectosInvitado, setProyectosInvitado] = useState<Proyecto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const getListProjectInvitate = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token") || "";
      const userId = typeof user?.id === 'string' ? parseInt(user.id, 10) : user?.id || 0;

      const response = await proyectoService.getProyectoByIdUsuarioForInvitate({
        id: userId,
        token
      });

      setProyectosInvitado(response);
    } catch (error) {
      console.error("Error getListProject ListaProyectos.tsx:", error);
     
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
        getListProjectInvitate();
    }
  }, [user]);

  return (
    <>
      <section className="flex flex-col justify-center w-[80%] mx-auto mt-5">
        <h4 className="mx-auto text-center  text-2xl font-semibold ">Invitado</h4>
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

        <ul className="overflow-y-auto scrollbar-hide bg-amber-400">
          {isLoading ? (
            <div className="text-center py-4">Cargando...</div>
          ) : proyectosInvitado.length > 0 ? (
            proyectosInvitado.map((proyecto) => (
              <ListaInvitado
                key={proyecto.id}
                nombreProyecto={proyecto.nombre}
                descripcionProyecto={proyecto.descripcion|| ""}
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

export default ListaProyectoInvitado;