import { useState, useEffect } from 'react';
import { Layer, Stage, Transformer, Line } from "react-konva";
import { useCanvas } from "../../hooks/useCanvas";
import { useContextMenu } from "../../hooks/useContextMenu";
import { useSelection } from "../../hooks/useSelection";
import SelectionRect from "./SelectionReact";
import ShapeRenderer from "./ShapeRenderer";
import ContextMenu from "./ContextMenu";

interface CanvasProps {
  shapes: any[];
  selectedId: string | null;
  selectedIds: string[];
  isTextMode: boolean;
  onSelectShape: (id: string, isMultiSelect?: boolean) => void;
  onDeselectShape: () => void;
  onUpdateShape: (id: string, newAttrs: any) => void;
  onAddShape: (type: string, x?: number, y?: number) => void;
  onDeleteShape: (id: string) => void;
  onMoveForward: (id: string) => void;
  onMoveBackward: (id: string) => void;
  onGroupShapes: (ids: string[]) => void;
  onUngroupShapes: (id: string) => void;
  onCanvasClick: (e: any) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  shapes,
  selectedId,
  selectedIds,
  isTextMode,
  onSelectShape,
  onDeselectShape,
  onUpdateShape,
  onAddShape,
  onDeleteShape,
  onMoveForward,
  onMoveBackward,
  onGroupShapes,
  onUngroupShapes,
  onCanvasClick
}) => {
  // Estado para el zoom y la posición
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [stageSize, setStageSize] = useState({
    width: 5000,
    height: 5000
  });

  // Referencias y eventos del canvas
  const {
    stageRef,
    layerRef,
    transformerRef,
    handleStageClick
  } = useCanvas({
    selectedId,
    shapes,
    onSelect: onSelectShape,
    onDeselect: onDeselectShape
  });

  // Selección por área
  const {
    isSelecting,
    selectionArea,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useSelection({
    stageRef,
    onDeselectShape,
    onCanvasClick,
    onSelectShapesInArea: (x1, y1, x2, y2) => {
      const selectedShapes = shapes.filter(shape => {
        const shapeX = shape.x;
        const shapeY = shape.y;
        const shapeWidth = shape.width;
        const shapeHeight = shape.height;
        
        return (
          shapeX >= Math.min(x1, x2) &&
          shapeX + shapeWidth <= Math.max(x1, x2) &&
          shapeY >= Math.min(y1, y2) &&
          shapeY + shapeHeight <= Math.max(y1, y2)
        );
      });
      
      selectedShapes.forEach(shape => onSelectShape(shape.id, true));
    }
  });

  // Menú contextual
  const {
    contextMenu,
    handleContextMenu,
    closeContextMenu
  } = useContextMenu();

  // Manejador del wheel para zoom
  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    
    const scaleBy = 1.1;
    const stage = stageRef.current;
    const oldScale = scale;

    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    setScale(newScale);
    setPosition({
      x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
    });
  };

  return (
    <div className="relative w-full h-full overflow-auto">
      <div 
        className="absolute w-full h-full"
        style={{ 
          width: stageSize.width,
          height: stageSize.height,
          backgroundColor: '#f0f0f0',
          overflow: 'auto'
        }}
      >
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onContextMenu={handleContextMenu}
          onClick={closeContextMenu}
          onWheel={handleWheel}
          draggable
          x={position.x}
          y={position.y}
          scale={{ x: scale, y: scale }}
          className="shadow-md bg-gray-100"
          style={{ cursor: isTextMode ? 'text' : 'default' }}
        >
          {/* Grid background */}
          <Layer>
            <GridBackground width={stageSize.width} height={stageSize.height} />
          </Layer>

          {/* Main layer with shapes */}
          <Layer ref={layerRef}>
            {shapes.map((shape) => (
              <ShapeRenderer
                key={shape.id}
                shape={shape}
                isSelected={selectedId === shape.id || selectedIds.includes(shape.id)}
                onSelect={(id, isMultiSelect) => onSelectShape(id, isMultiSelect)}
                onUpdate={onUpdateShape}
                handleStageClick={handleStageClick}
              />
            ))}

            <SelectionRect
              isSelecting={isSelecting}
              x={Math.min(selectionArea.x1, selectionArea.x2)}
              y={Math.min(selectionArea.y1, selectionArea.y2)}
              width={Math.abs(selectionArea.x2 - selectionArea.x1)}
              height={Math.abs(selectionArea.y2 - selectionArea.y1)}
            />

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
          <ContextMenu
            x={contextMenu.x + (stageRef.current?.container().offsetLeft || 0)}
            y={contextMenu.y + (stageRef.current?.container().offsetTop || 0)}
            selectedId={selectedId}
            selectedIds={selectedIds}
            shapes={shapes}
            onClose={closeContextMenu}
            onMoveForward={onMoveForward}
            onMoveBackward={onMoveBackward}
            onGroupShapes={onGroupShapes}
            onUngroupShapes={onUngroupShapes}
          />
        )}
      </div>
    </div>
  );
};

// Componente para el fondo cuadriculado
const GridBackground: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const gridSize = 20;
  const lines = [];

  // Crear líneas verticales
  for (let i = 0; i < width; i += gridSize) {
    lines.push(
      <Line
        key={`v${i}`}
        points={[i, 0, i, height]}
        stroke="#ddd"
        strokeWidth={0.5}
      />
    );
  }

  // Crear líneas horizontales
  for (let i = 0; i < height; i += gridSize) {
    lines.push(
      <Line
        key={`h${i}`}
        points={[0, i, width, i]}
        stroke="#ddd"
        strokeWidth={0.5}
      />
    );
  }

  return <>{lines}</>;
};

export default Canvas;