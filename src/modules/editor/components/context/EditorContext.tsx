
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
  
  return (
    <EditorContext.Provider value={{
      ...shapeHook
    }}>
      {children}
    </EditorContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditorContext debe ser usado dentro de un EditorProvider');
  }
  return context;
};