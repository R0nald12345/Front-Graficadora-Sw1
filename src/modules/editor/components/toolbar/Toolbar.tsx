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
  onDeleteShape?: () => void;
  onDuplicateShape?: () => void;
  onRotateShape?: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onAddShape,
  selectedId,
  onDeleteShape,
  onDuplicateShape,
  onRotateShape
}) => {
  // Verifica si hay una figura seleccionada
  const hasSelection = !!selectedId;

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
          <IoTriangleOutline className="text-white"/>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Toolbar;