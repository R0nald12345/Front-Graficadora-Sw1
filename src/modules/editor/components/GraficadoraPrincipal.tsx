import React, { useRef, useState } from "react";
import SidebarGraficadora from "./sidebar/SidebarGraficadora";
import { Stage, Layer, Rect, Circle, Text, Line, Transformer } from "react-konva";
import SidebarDetalles from "./sidebar/SidebarDetalles";

const GraficadoraPrincipal = () => {
  const [selectedId, setSelectedId] = useState(null); // Estado para rastrear el objeto seleccionado
  const transformerRef = useRef(null); // Referencia al Transformer
  const rectRef = useRef(null); // Referencia al Rectángulo

  const handleSelect = (e) => {
    setSelectedId(e.target.name()); // Establece el ID del objeto seleccionado
  };

  const handleDeselect = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null); // Deselecciona si se hace clic fuera del objeto
    }
  };

  return (
    <>
      <section className="flex">
        <section className="w-[13%]">
          <SidebarGraficadora />
        </section>

        <section className="w-[74%]">
          <Stage
            width={window.innerWidth}
            height={window.innerHeight}
            onMouseDown={handleDeselect} // Deseleccionar al hacer clic fuera
          >
            <Layer>
              <Text text="Pizarra" fontSize={15} />
              <Rect
                x={20}
                y={50}
                width={100}
                height={100}
                fill="red"
                name="rect1" // Nombre único para identificar el objeto
                draggable
                onClick={handleSelect} // Seleccionar al hacer clic
                ref={rectRef}
              />
              <Circle x={200} y={100} radius={50} fill="green" draggable />
              <Line
                points={[25, 300, 130, 300]} // Coordenadas [x1, y1, x2, y2]
                stroke="black" // Color de la línea
                strokeWidth={10} // Grosor de la línea
                draggable
              />
              {/* Transformer para redimensionar */}
              {selectedId === "rect1" && (
                <Transformer
                  ref={transformerRef}
                  nodes={[rectRef.current]} // Vincula el Transformer al Rectángulo
                  boundBoxFunc={(oldBox, newBox) => {
                    // Limita el tamaño mínimo del rectángulo
                    if (newBox.width < 20 || newBox.height < 20) {
                      return oldBox;
                    }
                    return newBox;
                  }}
                />
              )}
            </Layer>
          </Stage>
        </section>

        <section className="w-[13%]">
          <SidebarDetalles/>
        </section>
      </section>
    </>
  );
};

export default GraficadoraPrincipal;