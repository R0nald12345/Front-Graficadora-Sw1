import { RiDeleteBin5Line } from "react-icons/ri";
import { BiEditAlt } from "react-icons/bi";
import { IoEyeSharp } from "react-icons/io5";
import Swal from 'sweetalert2'
import { Proyecto } from "../../types/proyecto.types";
import { FC, useState } from "react";
import { useAuth } from "../../../auth/hooks/useAuth";
import { proyectoService } from "../../services/proyectoService";
import ModalEditarProyecto from "../modal/ModalEditarProyecto";
import { useNavigate } from "react-router-dom";

interface ListaProps {
  proyecto: Proyecto;
  setProyectos: (proyectos: Proyecto[]) => void;
  proyectos: Proyecto[];
}

const Lista: FC<ListaProps> = ({ proyecto, setProyectos, proyectos }) => {

  const navigate = useNavigate();
  const { id, nombre, descripcion } = proyecto;
  const [open, setOpen] = useState(false);


  const { user } = useAuth();

  const handleDelete = async () => {
    try {
      const result = await Swal.fire({
        title: "Deseas Eliminar Proyecto?",
        text: "Si eliminas no podrás recuperarlo!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, quiero Eliminar!",
      });
      if (result.isConfirmed) {

        const token = localStorage.getItem("token") || "";
        const userId = typeof user?.id === 'string' ? parseInt(user.id, 10) : user?.id || 0;

        const response = await proyectoService.deleteProyectoByIdUsuario({
          id: id,
          usuarioId: userId,
          token,
        });

        setProyectos(proyectos.filter((element) => element.id !== id));

        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "Se elimino correctamente",
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar",
      });
    }

  };





  return (
    <>

      <ModalEditarProyecto
        open={open}
        onClose={() => setOpen(!open)}
        proyectos={proyectos}
        setProyectos={setProyectos}
        proyecto={proyecto}
      // id={id}
      // nombre={nombre}
      // descripcion={descripcion}


      />


      <li className="w-full flex bg-white mt-5 rounded-2xl">
        <h4 className="font-semibold text-start w-[30%] px-3 py-2">
          {nombre}
        </h4>
        <h4 className="font-semibold text-start w-[50%] px-3 py-2">
          {descripcion}
        </h4>

        <div className="font-semibold flex justify-around w-[20%] py-2">
          <IoEyeSharp
            onClick={() => navigate(`/dashboard/proyecto/${id}`)}
            className="text-3xl p-1 rounded-xl bg-blue-950 text-white cursor-pointer"
          />
          <BiEditAlt
            onClick={() => setOpen(!open)}
            className="text-3xl p-1 rounded-xl bg-green-900 text-white cursor-pointer"
          />


          {/* <div className='w-1/2 flex justify-end gap-2'> */}
          {/* <ImWhatsapp className="text-3xl text-green-600" /> */}
          <RiDeleteBin5Line
            onClick={handleDelete}
            className="text-3xl text-red-700 cursor-pointer"
          />

        </div>

      </li>
    </>
  )
}

export default Lista