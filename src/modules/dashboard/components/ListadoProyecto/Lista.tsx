import { RiDeleteBin5Line } from "react-icons/ri";
import { BiEditAlt } from "react-icons/bi";
import { IoEyeSharp } from "react-icons/io5";
import Swal from 'sweetalert2'

const Lista = () => {

    const handleEliminar = async () => {
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
            // const response = await deleteUEid(id);
            // setDatosUnidadEducativa(
            //   datosUnidadEducativa.filter((element) => element.id !== id)
            // );
            // console.log(response);
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
        // Swal.fire({
        //     title: "Drag me!",
        //     icon: "success",
        //     draggable: true
        //   });
      };

    return (
        <li className="w-full flex bg-white mt-5 rounded-2xl">
            <h4 className="font-semibold text-start w-[70%] px-3 py-2">
                Proyecto 1
            </h4>

            <div className="font-semibold flex justify-around w-[30%] py-2">
                <IoEyeSharp
                    // onClick={() => changeRutaEditarFormulario(id)}
                    className="text-3xl p-1 rounded-xl bg-blue-950 text-white cursor-pointer"
                />
                <BiEditAlt
                    // onClick={() => changeRutaEditarFormulario(id)}
                    className="text-3xl p-1 rounded-xl bg-green-900 text-white cursor-pointer"
                />


                {/* <div className='w-1/2 flex justify-end gap-2'> */}
                {/* <ImWhatsapp className="text-3xl text-green-600" /> */}
                <RiDeleteBin5Line
                    onClick={ handleEliminar}
                    className="text-3xl text-red-700 cursor-pointer"
                />
               
            </div>

        </li>
    )
}

export default Lista