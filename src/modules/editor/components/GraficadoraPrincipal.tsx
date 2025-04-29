// Importaciones necesarias para el componente
import React, { useEffect } from "react";
import { useShapes } from "../hooks/useShapes";
import { useEditor } from "../../../sockets/hooks/useEditor";
import { EditorSocketService } from "../../../sockets/EditorSocketService";
import { ShapeAttributes } from "../types/ShapeAttributes";
import SidebarGraficadora from "./sidebar/SidebarGraficadora";
import Toolbar from "./toolbar/Toolbar";
import SidebarDetalles from "./sidebar/SidebarDetalles";
import Canvas from "./canvas/Canvas";
// ...existing imports...

// Interface que define las props que recibe el componente
interface GraficadoraPrincipalProps {
  proyectoId: number; // ID único del proyecto actual
}

const GraficadoraPrincipal: React.FC<GraficadoraPrincipalProps> = ({ proyectoId }) => {
  // Hook personalizado que maneja toda la lógica de las formas
  const {
    shapes,          // Array de todas las formas en el canvas
    selectedId,      // ID de la forma seleccionada actualmente
    isTextMode,      // Modo de edición de texto activo/inactivo
    addShape,        // Función para añadir nueva forma
    updateShape,     // Función para actualizar una forma existente
    selectShape,     // Función para seleccionar una forma
    deselectShape,   // Función para deseleccionar una forma
    deleteShape,     // Función para eliminar una forma
    handleCanvasClick, // Manejador de clicks en el canvas
    selectedIds,     // Array de IDs de formas seleccionadas (selección múltiple)
    moveForward,     // Mover forma hacia adelante en el z-index
    moveBackward,    // Mover forma hacia atrás en el z-index
    groupShapes,     // Agrupar formas seleccionadas
    ungroupShapes,   // Desagrupar formas
    setShapes,       // Actualizar todas las formas
    setSelectedId,   // Actualizar ID seleccionado
  } = useShapes(proyectoId);

  // Instancia del servicio de sockets para comunicación en tiempo real
  const socketService = EditorSocketService.getInstance();

  // Hook personalizado para manejar la sincronización del editor
  const { emitCanvasUpdate, subscribeToUpdates } = useEditor(proyectoId);

  // Efecto para emitir cambios cuando se modifican las formas
  useEffect(() => {
    if (shapes.length > 0) {
      emitCanvasUpdate(shapes);
    }
  }, [shapes, emitCanvasUpdate]);

  // Efecto para escuchar cambios de otros usuarios
  useEffect(() => {
    const cleanup = subscribeToUpdates(setShapes);
    return cleanup;
  }, [subscribeToUpdates, setShapes]);

  // Efecto para manejar la conexión/desconexión de sockets
  useEffect(() => {
    socketService.joinEditorRoom(proyectoId);

    const handleBeforeUnload = () => {
      socketService.disconnect();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      handleBeforeUnload();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [proyectoId]);

  // Función para manejar la carga de imágenes
  const handleAddImage = async (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;

      img.onload = () => {
        // Crear nueva forma de tipo imagen
        const imageShape = new ShapeAttributes({
          type: 'image',
          x: 100,
          y: 100,
          width: Number(img.width),
          height: Number(img.height),
          image: img,
          src: e.target?.result as string,
          draggable: true,
          rotation: 0,
          zIndex: shapes.length,
        });

        // Actualizar estado con la nueva imagen
        setShapes([...shapes, imageShape]);
        setSelectedId(imageShape.id);
      };
    };

    reader.readAsDataURL(file);
  };


  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        <section className="w-[15%] h-full">
        <SidebarGraficadora 
          onToolSelect={addShape}
          shapes={shapes}
          selectedId={selectedId}
          onSelectShape={selectShape}
          onDeleteShape={deleteShape}
          onMoveForward={moveForward}
          onMoveBackward={moveBackward}
          onGroupShapes={groupShapes}
          onUngroupShapes={ungroupShapes}
        />
        </section>


        <section className="w-[70%] h-full">
          {/* Área principal del canvas */}
          <Canvas
            shapes={shapes}
            selectedId={selectedId}
            selectedIds={selectedIds}
            isTextMode={isTextMode}
            onSelectShape={selectShape}
            onDeselectShape={deselectShape}
            onUpdateShape={updateShape}
            onAddShape={addShape}
            onDeleteShape={deleteShape}
            onMoveForward={moveForward}
            onMoveBackward={moveBackward}
            onGroupShapes={groupShapes}
            onUngroupShapes={ungroupShapes}
            onCanvasClick={handleCanvasClick}
          />
        </section>

        {/* Barra lateral derecha con detalles de la forma seleccionada */}
        <section className="w-[15%] h-full">
          <SidebarDetalles
            selectedShape={shapes.find(shape => shape.id === selectedId)}
            onUpdateShape={updateShape}
          />
        </section>
      </div>

      {/* Barra de herramientas inferior */}
      <Toolbar
        shapes={shapes}  // Añade esta prop
        onAddShape={addShape}
        selectedId={selectedId}
        selectedIds={selectedIds}
        onDeleteShape={() => selectedId && deleteShape(selectedId)}
        onDuplicateShape={() => {
          if (selectedId) {
            const shapeToCopy = shapes.find(shape => shape.id === selectedId);
            if (shapeToCopy) {
              addShape(shapeToCopy.type);
            }
          }
        }}
        onRotateShape={() => {
          if (selectedId) {
            const shape = shapes.find(shape => shape.id === selectedId);
            if (shape) {
              updateShape(selectedId, { rotation: (shape.rotation + 90) % 360 });
            }
          }
        }}
        onMoveForward={() => selectedId && moveForward(selectedId)}
        onMoveBackward={() => selectedId && moveBackward(selectedId)}
        onAddImage={handleAddImage}
      />
    </div>
  );
};

export default GraficadoraPrincipal;











