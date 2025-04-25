// GraficadoraPrincipal.tsx
import { Layer, Rect, Stage, Transformer } from "react-konva";
import { useShapes } from "../hooks/useShapes";
import SidebarGraficadora from "./sidebar/SidebarGraficadora";
import Toolbar from "./toolbar/Toolbar";
import SidebarDetalles from "./sidebar/SidebarDetalles";
import ShapeRenderer from "./canvas/ShapeRenderer";
import { useCanvas } from "../hooks/useCanvas";
import { useState } from "react";
import Konva from "konva";

const GraficadoraPrincipal = () => {
  const {
    shapes,
    selectedId,
    isTextMode,
    addShape,
    updateShape,
    selectShape,
    deselectShape,
    deleteShape,
    handleCanvasClick,
    selectedIds,
    selectShapesInArea,
    moveForward,
    moveBackward,
    groupShapes, // Asegúrate de que esta función esté expuesta desde useShapes
    ungroupShapes, // Asegúrate de que esta función esté expuesta desde useShapes
  } = useShapes(); // Llama al hook para manejar las figuras en el lienzo



  // Para implementar la selección por arrastre
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionArea, setSelectionArea] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 });


  // Añade estos estados para el menú contextual
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
  }>({
    visible: false,
    x: 0,
    y: 0
  });

 // Añade esta función para manejar el menú contextual
 const handleContextMenu = (e: Konva.KonvaEventObject<MouseEvent>) => {
  e.evt.preventDefault();
  const stage = e.target.getStage();
  if (!stage) return;

  const pos = stage.getPointerPosition();
  if (!pos) return;

  setContextMenu({
    visible: true,
    x: pos.x,
    y: pos.y
  });
};



  // Añade esta función para cerrar el menú contextual
  const closeContextMenu = () => {
    setContextMenu({
      visible: false,
      x: 0,
      y: 0
    });
  };




  const {
    stageRef,
    layerRef,
    transformerRef,
    handleStageClick
  } = useCanvas({ selectedId, shapes, onSelect: selectShape, onDeselect: deselectShape });





  // Modifica el evento onMouseDown del Stage
  const handleMouseDown = (e: any) => {
    if (e.target === e.target.getStage()) {
      // Comienza la selección por área
      const pos = e.target.getStage().getPointerPosition();
      setIsSelecting(true);
      setSelectionArea({
        x1: pos.x,
        y1: pos.y,
        x2: pos.x,
        y2: pos.y
      });
      deselectShape();
    }
    handleCanvasClick(e);
  };


  // Añade el evento onMouseMove al Stage
  const handleMouseMove = (e: any) => {
    if (!isSelecting) return;

    const pos = e.target.getStage().getPointerPosition();
    setSelectionArea(prev => ({
      ...prev,
      x2: pos.x,
      y2: pos.y
    }));
  };


  // Añade el evento onMouseUp al Stage
 
   const handleMouseUp = (e: any) => {
    if (!isSelecting) return;

    const pos = e.target.getStage().getPointerPosition();
    setSelectionArea(prev => ({
      ...prev,
      x2: pos.x,
      y2: pos.y
    }));

    // Determina qué figuras están dentro del área seleccionada
    selectShapesInArea(selectionArea.x1, selectionArea.y1, pos.x, pos.y);
    setIsSelecting(false);
  };



  // Añade este componente para dibujar el área de selección// Añade este componente para dibujar el área de selección
 const SelectionRect = () => {
    if (!isSelecting) return null;

    return (
      <Rect
        x={Math.min(selectionArea.x1, selectionArea.x2)}
        y={Math.min(selectionArea.y1, selectionArea.y2)}
        width={Math.abs(selectionArea.x2 - selectionArea.x1)}
        height={Math.abs(selectionArea.y2 - selectionArea.y1)}
        fill="rgba(0, 161, 255, 0.3)"
        stroke="#00A1FF"
        strokeWidth={1}
      />
    );
  };


  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        <section className="w-[15%] h-full">
          <SidebarGraficadora onToolSelect={addShape} />
        </section>

        <section className="w-[70%] h-full">
          <Stage
            ref={stageRef}
            width={window.innerWidth * 0.74}
            height={window.innerHeight - 80}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onContextMenu={handleContextMenu}
            onClick={closeContextMenu}
            className="shadow-md bg-black"
            style={{ cursor: isTextMode ? 'text' : 'default' }}
          >
            <Layer ref={layerRef}>
              {shapes.map((shape) => (
                <ShapeRenderer
                  key={shape.id}
                  shape={shape}
                  isSelected={selectedId === shape.id || selectedIds.includes(shape.id)}
                  onSelect={(id, isMultiSelect) => selectShape(id, isMultiSelect)}
                  onUpdate={updateShape}
                  handleStageClick={handleStageClick}
                />
              ))}

              <SelectionRect />

              <Transformer
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => {
                  if (newBox.width < 5 || newBox.height < 5) {
                    return oldBox;
                  }
                  return newBox;
                }}
              />
            </Layer>
          </Stage>

          {contextMenu.visible && (
            <div
              className="absolute bg-white shadow-lg rounded-md z-50"
              style={{
                left: contextMenu.x + stageRef.current?.container().offsetLeft,
                top: contextMenu.y + stageRef.current?.container().offsetTop
              }}
            >
              <ul className="py-2">
                {selectedId && (
                  <>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {
                      moveForward(selectedId);
                      closeContextMenu();
                    }}>
                      Traer al frente
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {
                      moveBackward(selectedId);
                      closeContextMenu();
                    }}>
                      Enviar al fondo
                    </li>
                    <li className="border-t my-1"></li>
                  </>
                )}
                {selectedIds.length > 1 && (
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {
                    groupShapes(selectedIds);
                    closeContextMenu();
                  }}>
                    Agrupar
                  </li>
                )}
                {selectedId && shapes.find(s => s.id === selectedId)?.type === 'group' && (
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {
                    ungroupShapes(selectedId);
                    closeContextMenu();
                  }}>
                    Desagrupar
                  </li>
                )}
              </ul>
            </div>
          )}
        </section>

        <section className="w-[15%] h-full">
          <SidebarDetalles
            selectedShape={shapes.find(shape => shape.id === selectedId)}
            onUpdateShape={updateShape}
          />
        </section>
      </div>

      <Toolbar
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
      />
    </div>
  );
};

export default GraficadoraPrincipal;