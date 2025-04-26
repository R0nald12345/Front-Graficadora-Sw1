

// GraficadoraPrincipal.tsx (refactorizado)
import React from "react";
import { useShapes } from "../hooks/useShapes";
import SidebarGraficadora from "./sidebar/SidebarGraficadora";
import Toolbar from "./toolbar/Toolbar";
import SidebarDetalles from "./sidebar/SidebarDetalles";
import Canvas from "./canvas/Canvas";
import { ShapeAttributes } from "../types/ShapeAttributes";

const GraficadoraPrincipal: React.FC = () => {
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
    groupShapes,
    ungroupShapes,
    setShapes,
    setSelectedId,
    setSelectedIds
  } = useShapes();


  const handleAddImage = async (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      
      img.onload = () => {
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
        
        setShapes([...shapes, imageShape]);
        setSelectedId(imageShape.id);
        setSelectedIds([imageShape.id]);
      };
    };
    
    reader.readAsDataURL(file);
  };


  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        <section className="w-[15%] h-full">
          <SidebarGraficadora onToolSelect={addShape} />
        </section>

        <section className="w-[70%] h-full">
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
        // para trabajar con la imagen 
        onAddImage={handleAddImage}
      />
    </div>
  );
};

export default GraficadoraPrincipal;











