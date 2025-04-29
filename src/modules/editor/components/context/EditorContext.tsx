
// context/EditorContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useShapes } from '../../hooks/useShapes';
import { ShapeAttributes } from '../../types/ShapeAttributes';


// Define la interfaz para el contexto
interface EditorContextProps {
  shapes: ShapeAttributes[];
  selectedId: string | null;
  selectedIds: string[];
  isTextMode: boolean;
  setIsTextMode: (mode: boolean) => void;
  addShape: (type: string, x?: number, y?: number) => void;
  updateShape: (id: string, newAttrs: Partial<ShapeAttributes>) => void;
  updateText: (id: string, newText: string) => void;
  selectShape: (id: string, isMultiSelect?: boolean) => void;
  deselectShape: () => void;
  deleteShape: (id: string) => void;
  moveForward: (id: string) => void;
  moveBackward: (id: string) => void;
  groupShapes: (ids: string[]) => void;
  ungroupShapes: (id: string) => void;
  handleCanvasClick: (e: any) => void;
  selectShapesInArea: (x1: number, y1: number, x2: number, y2: number) => void;
}

// Crea el contexto
const EditorContext = createContext<EditorContextProps | undefined>(undefined);

// Proveedor del contexto
export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const shapeHook = useShapes();
  
  // Agregar las funciones que faltan
  const updateText = (id: string, newText: string) => {
    shapeHook.updateShape(id, { text: newText });
  };

  const selectShapesInArea = (x1: number, y1: number, x2: number, y2: number) => {
    const shapesEnArea = shapeHook.shapes.filter(shape => {
      // Calcular si la figura está dentro del área seleccionada
      return shape.x >= Math.min(x1, x2) &&
             shape.x + shape.width <= Math.max(x1, x2) &&
             shape.y >= Math.min(y1, y2) &&
             shape.y + shape.height <= Math.max(y1, y2);
    });
    // Establecer los IDs seleccionados
    shapeHook.setSelectedIds(shapesEnArea.map(shape => shape.id));
  };
  
  return (
    <EditorContext.Provider value={{
      ...shapeHook,
      updateText,
      selectShapesInArea
    }}>
      {children}
    </EditorContext.Provider>
  );
};