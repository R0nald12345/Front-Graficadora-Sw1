// GraficadoraPrincipal.tsx
import { Layer, Stage, Transformer } from "react-konva";
import { useShapes } from "../hooks/useShapes";
import SidebarGraficadora from "./sidebar/SidebarGraficadora";
import Toolbar from "./toolbar/Toolbar";
import SidebarDetalles from "./sidebar/SidebarDetalles";
import ShapeRenderer from "./canvas/ShapeRenderer";
import { useCanvas } from "../hooks/useCanvas";

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
    handleCanvasClick,  // Asegúrate de pasar el manejador de clic
  } = useShapes(); // Llama al hook para manejar las figuras en el lienzo

  const {
    stageRef,
    layerRef,
    transformerRef,
    handleStageClick
  } = useCanvas({ selectedId, shapes, onSelect: selectShape, onDeselect: deselectShape });

  return (
    <div className="flex flex-col  h-screen">
      <div className="flex flex-1  overflow-hidden">
        <section className="w-[15%] h-full">
          <SidebarGraficadora onToolSelect={addShape} />
        </section>

        <section className="w-[70%]  h-full">
          <Stage
            ref={stageRef}
            width={window.innerWidth * 0.74}
            height={window.innerHeight - 80}
            onMouseDown={handleCanvasClick} // Usar la nueva función de manejo de clic
            className=" shadow-md "
            style={{ cursor: isTextMode ? 'text' : 'default' }} // Cambiar el cursor en modo texto
          >
            <Layer ref={layerRef}>
              {shapes.map((shape) => (
                <ShapeRenderer
                  key={shape.id}
                  shape={shape}
                  isSelected={selectedId === shape.id}
                  onSelect={selectShape}
                  onUpdate={updateShape}
                  handleStageClick={handleStageClick}  // Pasar el handleStageClick aquí
                />
              ))}

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
      />
    </div>
  );
};

export default GraficadoraPrincipal;
