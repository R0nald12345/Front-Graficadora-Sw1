// ContextMenu.tsx

interface ContextMenuProps {
  x: number;
  y: number;
  selectedId: string | null;
  selectedIds: string[];
  shapes: any[];
  onClose: () => void;
  onMoveForward: (id: string) => void;
  onMoveBackward: (id: string) => void;
  onGroupShapes: (ids: string[]) => void;
  onUngroupShapes: (id: string) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  selectedId,
  selectedIds,
  shapes,
  onClose,
  onMoveForward,
  onMoveBackward,
  onGroupShapes,
  onUngroupShapes
}) => {
  // Verificar si la forma seleccionada es un grupo
  const isGroup = selectedId && shapes.find(s => s.id === selectedId)?.type === 'group';

  return (
    <div
      className="absolute bg-white shadow-lg rounded-md z-50"
      style={{ left: x, top: y }}
    >
      <ul className="py-2">
        {selectedId && (
          <>
            <li 
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
              onClick={() => {
                onMoveForward(selectedId);
                onClose();
              }}
            >
              Traer al frente
            </li>
            <li 
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
              onClick={() => {
                onMoveBackward(selectedId);
                onClose();
              }}
            >
              Enviar al fondo
            </li>
            <li className="border-t my-1"></li>
          </>
        )}
        {selectedIds.length > 1 && (
          <li 
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
            onClick={() => {
              onGroupShapes(selectedIds);
              onClose();
            }}
          >
            Agrupar
          </li>
        )}
        {isGroup && (
          <li 
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
            onClick={() => {
              onUngroupShapes(selectedId);
              onClose();
            }}
          >
            Desagrupar
          </li>
        )}
      </ul>
    </div>
  );
};

export default ContextMenu;