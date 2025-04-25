
import { TfiText } from "react-icons/tfi";
import { IoTriangleOutline } from "react-icons/io5";

import {
  Square,
  Circle,
  Star,
  Minus,
  Trash2,
  Copy,
  RotateCw
} from 'lucide-react';

// Define las props que recibe el componente
interface ToolbarProps {
  onAddShape: (type: string) => void;
  selectedId?: string | null;
  selectedIds?: string[]; // Añadido selectedIds a la interfaz
  onDeleteShape?: () => void;
  onDuplicateShape?: () => void;
  onRotateShape?: () => void;
  onMoveForward?: () => void;
  onMoveBackward?: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onAddShape,
  selectedId,
  selectedIds = [], // Asignamos un valor por defecto
  onDeleteShape,
  onDuplicateShape,
  onRotateShape,
  onMoveForward,
  onMoveBackward
}) => {

  // Verifica si hay una figura seleccionada
  const hasSelection = !!selectedId || selectedIds.length > 0;

  return (
    <div className="border-t border-gray-200 bg-gris-semi-oscuro  p-2 flex items-center justify-between sticky bottom-0 w-full">
      {/* Herramientas de creación de figuras */}
      <div className="flex items-center space-x-2">
        <button
          className="p-2 rounded text-white hover:bg-gray-100 hover:text-black"
          onClick={() => onAddShape('rectangle')}
          title="Añadir Rectángulo"
        >
          <Square size={20} />
        </button>

        <button
          className="p-2 rounded text-white hover:bg-gray-100 hover:text-black"
          onClick={() => onAddShape('circle')}
          title="Añadir Círculo"
        >
          <Circle size={20} />
        </button>

        <button
          className="p-2 rounded text-white hover:bg-gray-100 hover:text-black"
          onClick={() => onAddShape('star')}
          title="Añadir Estrella"
        >
          <Star size={20} />
        </button>

        {/* triangulo */}
        <button
          className="p-2 rounded hover:bg-gray-100"
          onClick={() => onAddShape('triangle')} // Llamar a la función onAddShape con 'triangle' como tipo
          title="Añadir Triángulo"
        >
          <IoTriangleOutline className="text-white" />
        </button>

        <button
          className="p-2 rounded text-white hover:bg-gray-100 hover:text-black"
          onClick={() => onAddShape('line')}
          title="Añadir Línea"
        >
          <Minus size={20} />
        </button>

        <button
          className="p-2 rounded text-white hover:bg-gray-100 "
          onClick={() => onAddShape('text')}
          title="Añadir Texto"
        >
          <TfiText className="text-white font-bold" />
        </button>
      </div>

      {/* Herramientas de edición */}
      <div className="flex items-center space-x-2">
        {hasSelection && (
          <>
            {onDeleteShape && (
              <button
                className="p-2 rounded  hover:bg-gray-100 text-red-500"
                onClick={onDeleteShape}
                title="Eliminar"
              >
                <Trash2 size={20} />
              </button>
            )}

            {onDuplicateShape && (
              <button
                className="p-2 rounded hover:bg-gray-100"
                onClick={onDuplicateShape}
                title="Duplicar"
              >
                <Copy size={20} />
              </button>
            )}

            {onRotateShape && (
              <button
                className="p-2 rounded hover:bg-gray-100"
                onClick={onRotateShape}
                title="Rotar"
              >
                <RotateCw size={20} />
              </button>
            )}

            {/* Botones para manejo de capas */}
            {onMoveForward && (
              <button
                className="p-2 rounded hover:bg-gray-100 text-white hover:text-black"
                onClick={onMoveForward}
                title="Traer al frente"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="8" y="6" width="12" height="12" rx="2" />
                  <rect x="4" y="4" width="8" height="8" rx="2" />
                  <path d="M18 16v2" />
                  <path d="M18 4v6" />
                </svg>
              </button>
            )}

            {onMoveBackward && (
              <button
                className="p-2 rounded hover:bg-gray-100 text-white hover:text-black"
                onClick={onMoveBackward}
                title="Enviar al fondo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="6" width="12" height="12" rx="2" />
                  <rect x="12" y="4" width="8" height="8" rx="2" />
                  <path d="M6 18v2" />
                  <path d="M6 4v6" />
                </svg>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Toolbar;