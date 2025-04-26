// useLayering.tsx
import { useCallback } from "react";
import { ShapeAttributes } from "../types/ShapeAttributes";

interface UseLayeringProps {
  shapes: ShapeAttributes[];
  setShapes: React.Dispatch<React.SetStateAction<ShapeAttributes[]>>;
}

export const useLayering = ({ shapes, setShapes }: UseLayeringProps) => {
  // Función para mover una figura hacia adelante (una capa)
  const moveForward = useCallback((id: string) => {
    const shapeIndex = shapes.findIndex(shape => shape.id === id);
    if (shapeIndex < shapes.length - 1) {
      const newShapes = [...shapes];

      // Intercambiar posiciones
      [newShapes[shapeIndex], newShapes[shapeIndex + 1]] =
        [newShapes[shapeIndex + 1], newShapes[shapeIndex]];

      // Actualizar zIndex
      newShapes[shapeIndex].zIndex = shapeIndex;
      newShapes[shapeIndex + 1].zIndex = shapeIndex + 1;

      setShapes(newShapes);
    }
  }, [shapes, setShapes]);

  // Función para mover una figura hacia atrás (una capa)
  const moveBackward = useCallback((id: string) => {
    const shapeIndex = shapes.findIndex(shape => shape.id === id);
    if (shapeIndex > 0) {
      const newShapes = [...shapes];

      // Intercambiar posiciones
      [newShapes[shapeIndex], newShapes[shapeIndex - 1]] =
        [newShapes[shapeIndex - 1], newShapes[shapeIndex]];

      // Actualizar zIndex
      newShapes[shapeIndex].zIndex = shapeIndex;
      newShapes[shapeIndex - 1].zIndex = shapeIndex - 1;

      setShapes(newShapes);
    }
  }, [shapes, setShapes]);

  // Función para traer al frente (máxima capa)
  const bringToFront = useCallback((id: string) => {
    const shapeIndex = shapes.findIndex(shape => shape.id === id);
    if (shapeIndex < shapes.length - 1) {
      const shape = shapes[shapeIndex];
      const otherShapes = shapes.filter((_, idx) => idx !== shapeIndex);
      
      // Reordenar formas
      const newShapes = [...otherShapes, shape];
      
      // Actualizar todos los zIndex
      const updatedShapes = newShapes.map((shape, idx) => ({
        ...shape,
        zIndex: idx
      }));

      setShapes(updatedShapes);
    }
  }, [shapes, setShapes]);

  // Función para enviar al fondo (mínima capa)
  const sendToBack = useCallback((id: string) => {
    const shapeIndex = shapes.findIndex(shape => shape.id === id);
    if (shapeIndex > 0) {
      const shape = shapes[shapeIndex];
      const otherShapes = shapes.filter((_, idx) => idx !== shapeIndex);
      
      // Reordenar formas
      const newShapes = [shape, ...otherShapes];
      
      // Actualizar todos los zIndex
      const updatedShapes = newShapes.map((shape, idx) => ({
        ...shape,
        zIndex: idx
      }));

      setShapes(updatedShapes);
    }
  }, [shapes, setShapes]);

  return {
    moveForward,
    moveBackward,
    bringToFront,
    sendToBack
  };
};