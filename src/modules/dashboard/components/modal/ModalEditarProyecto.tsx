import { useState } from "react";
import { useAuth } from "../../../auth/hooks/useAuth";
import Swal from "sweetalert2";
import { Proyecto } from "../../types/proyecto.types";
import { proyectoService } from "../../services/proyectoService";


interface interfaceProps {
    open: boolean;
    onClose: () => void;
    proyectos: Proyecto[];
    setProyectos: (proyectos: Proyecto[]) => void;
    proyecto: Proyecto;
}

const ModalEditarProyecto = ({
    open,
    onClose,
    proyectos,
    setProyectos,
    proyecto,
}: interfaceProps) => {


    const { user } = useAuth();
    const { id, nombre, descripcion } = proyecto;

    const [nombreP, setNombreP] = useState<string>(nombre);
    const [descripcionP, setDescripcionP] = useState<string>(descripcion || "");



    const [isLoading, setIsLoading] = useState(false);



    const handleUdapte = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const token = localStorage.getItem("token") || "";
            const userId = typeof user?.id === 'string' ? parseInt(user.id, 10) : user?.id || 0;

            const response = await proyectoService.updateProyectoByIdUsuario({
                id: id,
                nombre: nombreP,
                descripcion: descripcionP,
                usuarioId: userId,
                token,
            });

            // Corrige el map para que retorne el elemento actualizado
            const updateProyecto = proyectos.map((element) =>
                element.id === id
                    ? { ...element, nombre: nombreP, descripcion: descripcionP }
                    : element
            );

            setProyectos(updateProyecto);

            onClose(); // Cierra el modal después de actualizar

            Swal.fire({
                icon: "success",
                title: "Actualizado",
                text: "Se ah Actualizado correctamente",
            });


        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo eliminar",
            });
        } finally {
            setIsLoading(false);
        }
    };






    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/60 bg-opacity-70 z-10 flex items-center justify-center">
            <div className="max-w-lg w-11/12 max-h-[90vh] bg-white shadow-2xl rounded-2xl p-5">
                <div className="flex justify-end">
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded-md font-bold"
                        onClick={onClose}
                    >
                        X
                    </button>
                </div>

                <h2 className="text-3xl font-bold text-center">
                    Actualizar Proyecto
                </h2>

                <form className="mt-5" onSubmit={(e) => handleUdapte(e)}>
                    <div>
                        <h3 className="font-semibold mt-2">Nombre del Proyecto</h3>
                        <input
                            className="rounded-md border-2 border-gray-400 w-full p-2 mt-1 outline-none"
                            type="text"
                            value={nombreP}
                            onChange={(e) => setNombreP(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <h3 className="font-semibold mt-2">Descripción</h3>
                        <input
                            className="rounded-md border-2 border-gray-400 w-full p-2 mt-1 outline-none"
                            type="text"
                            value={descripcionP}
                            onChange={(e) => setDescripcionP(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 font-semibold mt-5 text-white py-2 px-5 rounded-xl disabled:bg-green-400"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Actualizando...' : 'Actualizar Proyecto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModalEditarProyecto;