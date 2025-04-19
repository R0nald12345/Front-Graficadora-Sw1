
interface interfaceProps {
    open: boolean,
    onClose:()=>void;

}


const ModalCrearProyecto = ({
    open,
    onClose,
  }: interfaceProps)  => {

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/60 bg-opacity-70 z-10 flex items-center justify-center">
                <div className="max-w-lg w-11/12 max-h-[90vh] bg-white shadow-2xl rounded-2xl p-5">
                    <div className="flex justify-end">
                        <button
                            className="bg-red-500 hover:bg-red-700 px-5 py-1 rounded-md font-bold"
                            onClick={onClose}
                        >
                            X
                        </button>
                    </div>

                    <h2 className="text-3xl font-bold text-center">
                        Crear Nuevo Tipo Colegio
                    </h2>

                    <form
                        className="mt-5"
                        // onSubmit={(e) => {
                        //     e.preventDefault();
                        //     handleNuevoTipoColegio();
                        // }}
                    >
                        <div>
                            <h3 className="font-semibold mt-2">Nombre de Tipo Colegio</h3>
                            <input
                                className="rounded-md border-2 border-gray-400 w-full p-2 mt-1 outline-none"
                                type="text"
                                name="nombre"
                                // value={nombre}
                                // onChange={onInputChange}
                            ></input>
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 font-semibold mt-5 text-white py-2 px-5 rounded-xl"
                                // onClick={ }
                            >
                                Agregar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ModalCrearProyecto