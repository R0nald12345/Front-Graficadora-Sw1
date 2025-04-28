import { useState } from "react";
import { useAuth } from "../../../auth/hooks/useAuth";
import { proyectoService } from "../../services/proyectoService";
import Swal from "sweetalert2";
import { Proyecto } from "../../types/proyecto.types";

interface interfaceProps {
    open: boolean;
    onClose: () => void;
    proyectos: Proyecto[];
    setProyectos: React.Dispatch<React.SetStateAction<Proyecto[]>>;
}

const ModalCrearProyecto = ({
    open,
    onClose,
    proyectos,
    setProyectos,
}: interfaceProps) => {
    const { user } = useAuth();
    const [nombre, setNombre] = useState<string>("");
    const [descripcion, setDescripcion] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const handleNuevoProyecto = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El nombre del proyecto es obligatorio',
            });
            return;
        }
    
        try {
            setIsLoading(true);
            const token = localStorage.getItem("token") || "";
            const userId = typeof user?.id === 'string' ? parseInt(user.id, 10) : user?.id || 0;
    
            const response  = await proyectoService.createProyecto(
                {
                    nombre,
                    descripcion,
                    usuarioId: userId
                },
                token
            );
    
            const nuevoProyecto: Proyecto = {
                id: response.id,
                nombre: response.nombre,
                descripcion: response.descripcion,
                usuarioProyectos: [{
                    id: 0,
                    rol: "ADMIN",
                    usuario: {
                        id: userId,
                        email: user?.email || "",
                        nombre: user?.nombre || "",
                        password: ""
                    }
                }]
            };
    
            setProyectos([...proyectos, nuevoProyecto]);
    
            Swal.fire({
                icon: 'success',
                title: 'Proyecto Creado',
                text: 'El proyecto ha sido creado correctamente',
            });

           
    
            // Limpiar formulario y cerrar modal
            setNombre("");
            setDescripcion("");
            onClose();
            // onProjectCreated?.();
    
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo crear el proyecto',
            });
            console.error("Error al crear el proyecto:", error);
        } finally {
            setIsLoading(false);
        }
    }

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
                    Crear Nuevo Proyecto
                </h2>

                <form className="mt-5" onSubmit={handleNuevoProyecto}>
                    <div>
                        <h3 className="font-semibold mt-2">Nombre del Proyecto</h3>
                        <input
                            className="rounded-md border-2 border-gray-400 w-full p-2 mt-1 outline-none"
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <h3 className="font-semibold mt-2">Descripción</h3>
                        <input
                            className="rounded-md border-2 border-gray-400 w-full p-2 mt-1 outline-none"
                            type="text"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 font-semibold mt-5 text-white py-2 px-5 rounded-xl disabled:bg-green-400"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creando...' : 'Crear Proyecto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModalCrearProyecto;