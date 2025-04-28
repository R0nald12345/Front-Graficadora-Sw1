import { FaMagnifyingGlass } from "react-icons/fa6";
import { SlArrowDown } from "react-icons/sl";
import ModalCrearProyecto from "./modal/ModalCrearProyecto";
import { useState } from "react";
import { Navigate } from "react-router-dom";


interface HeaderProps {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
}

const Header = ({ setOpenModal, openModal }: HeaderProps) => {

  const userName = localStorage.getItem("userName") || "";
  const letra = userName.charAt(0).toUpperCase();

  return (
    <>



      <header>

        <section className="flex justify-between  mx-auto rounded-md  px-5 ">

          <div className="flex w-[60%]  mt-3 gap-2" >
            <p className="bg-blue-700 rounded-full font-semibold text-white px-3 py-1">{letra}</p>
            <p className="font-semibold text-2xl">{userName}</p>
            <SlArrowDown className="mt-3 text-black font-extrabold" />
          </div>


          <button
            className=" w-[30%] bg-green-700 text-white  rounded-lg py-3"
            onClick={() => setOpenModal(!openModal)}
          >
            + Proyecto
          </button>



        </section>

      </header>



    </>
  )
}

export default Header