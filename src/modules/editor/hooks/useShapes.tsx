//Para el manejo y metodos de las formas(mover, actualiar, eliminar, etc.)

import { useState } from 'react'
import { ShapeAttributes } from '../types/ShapeAttributes'
import { createShape } from '../services/shapeFactory';

//ME ayuda para hacer las gestiones de mis Figuras

// Hook personalizado para manejar las figuras en el lienzo
export const useShapes = () => {
  // Estado para almacenar todas las figuras
  const [shapes, setShapes] = useState<ShapeAttributes[]>([]);

  // Estado para rastrear la figura seleccionada (por su ID)
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [isTextMode, setIsTextMode] = useState(false);

  // Función para agregar una nueva figura al lienzo
// Modificar addShape para manejar el triángulo
const addShape = (type: string, x: number, y: number) => {
  if (type === "text") {
    const newShape = new ShapeAttributes({
      type: "text",
      x: x,
      y: y,
      fill: "#FFFF00", // Amarillo por defecto
      stroke: "",
      strokeWidth: 0,
      width: 200,
      height: 50,
      draggable: true,
      rotation: 0,
      fontSize: 24,
      fontFamily: "Arial",
    });
    setShapes([...shapes, newShape]);
    setSelectedId(newShape.id);
  } else if (type === "triangle") {
    // Crear un triángulo con los atributos por defecto
    const newShape = new ShapeAttributes({
      type: "triangle",
      x: x,
      y: y,
      fill: "#FFFF00", // Amarillo por defecto
      stroke: "#000", // Bordes negros
      strokeWidth: 2, // Grosor del borde
      width: 100, // Base del triángulo
      height: 100, // Altura del triángulo
      draggable: true,
      rotation: 0,
    });
    setShapes([...shapes, newShape]);
    setSelectedId(newShape.id);
  } else {
    // Crear otras figuras como círculo, cuadrado, etc.
    const newShape = createShape(type);
    setShapes([...shapes, newShape]);
    setSelectedId(newShape.id);
  }
};


  // Función para actualizar los atributos de una figura existente
  const updateShape = (id: string, newAttrs: Partial<ShapeAttributes>) => {
    setShapes(
      shapes.map((shape) => {
        if (shape.id === id) {
          return shape.cloneWith(newAttrs); // Clona la figura y actualiza sus atributos
        }
        return shape; // Devuelve las figuras que no se actualizan sin cambios
      })
    );
  };

  // Función para seleccionar una figura (por su ID)
  const selectShape = (id: string) => {
    setSelectedId(id); // Establece el ID de la figura seleccionada
  };

  // Función para deseleccionar cualquier figura
  const deselectShape = () => {
    setSelectedId(null); // Establece el ID seleccionado como `null`
  };

  // Función para eliminar una figura del lienzo
  const deleteShape = (id: string) => {
    setShapes(shapes.filter(shape => shape.id !== id)); // Elimina la figura con el ID especificado
    if (selectedId === id) {
      setSelectedId(null); // Deselecciona la figura si era la seleccionada
    }
  };

  // Función para actualizar el texto de una forma
  const updateText = (id: string, newText: string) => {
    setShapes(
      shapes.map((shape) => {
        if (shape.id === id) {
          return { ...shape, text: newText };
        }
        return shape;
      })
    );
  };


  // Añade estas funciones para el manejo del clic en el canvas
  const handleCanvasClick = (e: any) => {
    if (isTextMode) {
      // Solo procesamos el clic si proviene directamente del Stage
      if (e.target === e.target.getStage()) {
        const stage = e.target;
        const pointerPosition = stage.getPointerPosition();
        if (pointerPosition) {
          // Añadimos texto en la posición exacta del clic
          addShape("text", pointerPosition.x, pointerPosition.y);
        }
      }
    } else if (e.target === e.target.getStage()) {
      // Deseleccionamos si hacemos clic en un área vacía
      deselectShape();
    }
  };



  // Devuelve las funciones y estados para manejar las figuras
  return {
    shapes, // Lista de figuras
    selectedId, // ID de la figura seleccionada
    isTextMode, // Indica si estamos en modo texto
    addShape, // Función para agregar una figura
    updateShape, // Función para actualizar una figura
    updateText, // Función para actualizar el texto de una figura
    selectShape, // Función para seleccionar una figura
    deselectShape, // Función para deseleccionar figuras
    deleteShape, // Función para eliminar una figura
    handleCanvasClick

  };
};