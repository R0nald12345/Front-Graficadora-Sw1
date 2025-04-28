import { RiDeleteBin5Line } from "react-icons/ri";
import { BiEditAlt } from "react-icons/bi";
import { IoEyeSharp } from "react-icons/io5";
import { Proyecto } from "../../types/proyecto.types";
import { useState } from "react";
import { useAuth } from "../../../auth/hooks/useAuth";

interface ListaInvitadoProps {
    nombreProyecto: string;
    descripcionProyecto: string;

    }


const ListaInvitado = ({nombreProyecto, descripcionProyecto}: ListaInvitadoProps) => {
 
 
//   const [open, setOpen] = useState(false);


//   const { user } = useAuth();

  
  return (
    <>



      <li className="w-full flex bg-white mt-5 rounded-2xl">
        <h4 className="font-semibold text-start w-[30%] px-3 py-2">
          {nombreProyecto}
        </h4>
        <h4 className="font-semibold text-start w-[50%] px-3 py-2">
          {descripcionProyecto}
        </h4>

        <div className="font-semibold flex justify-center w-[20%] py-2">
          <IoEyeSharp
            // onClick={() => changeRutaEditarFormulario(id)}
            className="text-3xl p-1 rounded-xl bg-blue-950 text-white cursor-pointer"
          />
        

        </div>

      </li>
    </>
  )
}

export default ListaInvitado