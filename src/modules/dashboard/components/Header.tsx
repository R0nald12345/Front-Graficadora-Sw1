import { FaMagnifyingGlass } from "react-icons/fa6";
import { SlArrowDown } from "react-icons/sl";
import ModalCrearProyecto from "./modal/ModalCrearProyecto";
import { useState } from "react";
import { Navigate } from "react-router-dom";

const Header = () => {

  
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <ModalCrearProyecto
        open = {openModal}
        onClose = {() => setOpenModal(!openModal)}
        // tipoColegio = {datoTipoColegios}
        // setTipoColegio={setTipoColegios}
      />


      <header>

        <section className="flex justify-between  mx-auto rounded-md  px-5 ">

          <div className="flex w-[60%]  mt-3 gap-2" >
            <p className="bg-blue-700 rounded-full font-semibold text-white px-3 py-1">R</p>
            <p className="font-semibold text-2xl">Ronald Camino Puma</p>
            <SlArrowDown className="mt-3 text-black font-extrabold"/>
          </div>

          <section className="flex justify-between  gap-5 w-[40%]">
              
              <div className="flex w-[70%] px-2 bg-gray-300 border border-black rounded-xl gap-2">
                <FaMagnifyingGlass className="mt-4" />

                <input
                  className="w-full font-semibold  bg-gray-300 outline-none"
                  type="text"
                  placeholder="Buscar"
                  // onChange={handleFiltroCambio}
                />
              </div>


              <button
                className=" w-[30%] bg-green-700 text-white  rounded-lg py-3"
                onClick={() => setOpenModal(!openModal)}
              >
                + Proyecto
              </button>

          </section>


        </section>

      </header>



    </>
  )
}

export default Header