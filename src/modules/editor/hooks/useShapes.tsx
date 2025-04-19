//Para el manejo y metodos de las formas(mover, actualiar, eliminar, etc.)

import { useState } from 'react'
import { ShapeAttributes } from '../types/ShapeAttributes'
import { createShape } from '../services/shapeFactory';


// Hook personalizado para manejar las figuras en el lienzo
export const useShapes = () => {
    // Estado para almacenar todas las figuras
    const [shapes, setShapes] = useState<ShapeAttributes[]>([]);
  
    // Estado para rastrear la figura seleccionada (por su ID)
    const [selectedId, setSelectedId] = useState<string | null>(null);
  
    // Función para agregar una nueva figura al lienzo
    const addShape = (type: string) => {
      const newShape = createShape(type); // Crea una nueva figura según el tipo
      setShapes([...shapes, newShape]); // Agrega la nueva figura al estado
      setSelectedId(newShape.id); // Selecciona automáticamente la nueva figura
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
  
    // Devuelve las funciones y estados para manejar las figuras
    return {
      shapes, // Lista de figuras
      selectedId, // ID de la figura seleccionada
      addShape, // Función para agregar una figura
      updateShape, // Función para actualizar una figura
      selectShape, // Función para seleccionar una figura
      deselectShape, // Función para deseleccionar figuras
      deleteShape // Función para eliminar una figura
    };
  };