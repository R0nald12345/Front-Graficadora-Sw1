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

  //nuevo estado para guardar múltiples IDs seleccionados
  const [selectedIds, setSelectedIds] = useState<string[]>([]);


  // Función para agregar una nueva figura al lienzo
  // Modificar addShape para manejar el triángulo
  const addShape = (type: string, x: number = 100, y: number = 100) => {
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
        zIndex: shapes.length, // Asignar el índice de capa
      });
      setShapes([...shapes, newShape]);
      setSelectedId(newShape.id);
      setSelectedIds([newShape.id]); // Actualizar también selectedIds
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
        zIndex: shapes.length, // Asignar el índice de capa
      });
      setShapes([...shapes, newShape]);
      setSelectedId(newShape.id);
      setSelectedIds([newShape.id]); // Actualizar también selectedIds
    } else {
      // Crear otras figuras como círculo, cuadrado, etc.
      const newShape = createShape(type);
      // Asignar la posición específica si se proporciona
      newShape.x = x;
      newShape.y = y;
      newShape.zIndex = shapes.length; // Asignar el índice de capa
      setShapes([...shapes, newShape]);
      setSelectedId(newShape.id);
      setSelectedIds([newShape.id]); // Actualizar también selectedIds
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

  // Modifica la función selectShape para manejar la selección múltiple
  const selectShape = (id: string, isMultiSelect: boolean = false) => {
    if (isMultiSelect) {
      // Si es selección múltiple (con Ctrl/Shift)
      setSelectedIds(prevIds => {
        if (prevIds.includes(id)) {
          // Si ya está seleccionado, lo quitamos
          return prevIds.filter(shapeId => shapeId !== id);
        } else {
          // Si no está seleccionado, lo añadimos
          return [...prevIds, id];
        }
      });
    } else {
      // Si es selección simple, solo seleccionamos esta figura
      setSelectedId(id);
      setSelectedIds([id]);
    }
  };

  // Función para deseleccionar cualquier figura
  const deselectShape = () => {
    setSelectedId(null);
    setSelectedIds([]);
  };

  // Añade esta función para la selección por arrastre (área)
  const selectShapesInArea = (x1: number, y1: number, x2: number, y2: number) => {
    const selectedShapes = shapes.filter(shape => {
      // Comprueba si la figura está dentro del área seleccionada
      return (
        shape.x >= Math.min(x1, x2) &&
        shape.x + shape.width <= Math.max(x1, x2) &&
        shape.y >= Math.min(y1, y2) &&
        shape.y + shape.height <= Math.max(y1, y2)
      );
    });
    
    const ids = selectedShapes.map(shape => shape.id);
    setSelectedIds(ids);
    if (ids.length === 1) {
      setSelectedId(ids[0]);
    } else {
      setSelectedId(null); // No hay una única selección activa
    }
    
    return ids;
  };

  // Función para eliminar una figura del lienzo
  const deleteShape = (id: string) => {
    // Encontrar la figura para verificar si es un grupo
    const shapeToDelete = shapes.find(shape => shape.id === id);

    if (shapeToDelete && shapeToDelete.type === 'group' && shapeToDelete.children) {
      // Si es un grupo, eliminar el grupo pero conservar sus hijos
      const childrenShapes = shapeToDelete.children;
      const remainingShapes = shapes.filter(shape => shape.id !== id);
      setShapes([...remainingShapes, ...childrenShapes]);
    } else {
      // Si no es un grupo, eliminar normalmente
      setShapes(shapes.filter(shape => shape.id !== id));
    }

    if (selectedId === id) {
      setSelectedId(null); // Deselecciona la figura si era la seleccionada
      setSelectedIds([]); // Limpiar también selectedIds
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

  // Función para mover una figura hacia adelante (una capa)
  const moveForward = (id: string) => {
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
  };

  // Función para mover una figura hacia atrás (una capa)
  const moveBackward = (id: string) => {
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
  };

  // Función para agrupar figuras
  const groupShapes = (ids: string[]) => {
    if (ids.length < 2) return; // Se necesitan al menos 2 figuras para agrupar

    // Obtener las figuras que se van a agrupar
    const shapesToGroup = shapes.filter(shape => ids.includes(shape.id));
    const otherShapes = shapes.filter(shape => !ids.includes(shape.id));

    // Calcular las dimensiones del grupo
    let minX = Math.min(...shapesToGroup.map(s => s.x));
    let minY = Math.min(...shapesToGroup.map(s => s.y));
    let maxX = Math.max(...shapesToGroup.map(s => s.x + s.width));
    let maxY = Math.max(...shapesToGroup.map(s => s.y + s.height));

    // Crear un nuevo grupo
    const groupId = `group-${Date.now()}`;
    const newGroup = new ShapeAttributes({
      id: groupId,
      type: 'group',
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      fill: 'transparent',
      stroke: '#00A0FF',
      strokeWidth: 1,
      draggable: true,
      rotation: 0,
      // Ajustar las posiciones relativas de los hijos
      children: shapesToGroup.length > 0 ? shapesToGroup.map(shape => {
        return shape.cloneWith({
          x: shape.x - minX,  // Posición relativa al grupo
          y: shape.y - minY   // Posición relativa al grupo
        });
      }) : [],  // Aseguramos que children sea un array vacío si no hay hijos
      zIndex: shapes.length // El grupo siempre va encima
    });

    // Actualizar el estado con el nuevo grupo
    setShapes([...otherShapes, newGroup]);
    setSelectedId(groupId);
    setSelectedIds([groupId]); // Actualizar también selectedIds
  };

  // Función para desagrupar figuras
  const ungroupShapes = (groupId: string) => {
    const group = shapes.find(shape => shape.id === groupId);
    if (!group || group.type !== 'group' || !group.children || group.children.length === 0) return;

    // Obtener las figuras del grupo y ajustar sus posiciones absolutas
    const childrenWithAbsolutePositions = group.children.map(child => {
      return child.cloneWith({
        x: group.x + child.x,  // Convertir a posición absoluta
        y: group.y + child.y   // Convertir a posición absoluta
      });
    });

    // Filtrar el grupo actual y añadir sus hijos como figuras independientes
    const otherShapes = shapes.filter(shape => shape.id !== groupId);
    setShapes([...otherShapes, ...childrenWithAbsolutePositions]);

    // Deseleccionar el grupo eliminado
    if (selectedId === groupId) {
      setSelectedId(null);
      setSelectedIds([]); // Limpiar también selectedIds
    }
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
    moveForward, // Función para mover una figura hacia adelante
    moveBackward, // Función para mover una figura hacia atrás
    groupShapes, // Función para agrupar figuras
    ungroupShapes, // Función para desagrupar (asegúrate de que esté expuesta)
    handleCanvasClick, // Manejador de clics en el lienzo
    selectedIds, // Lista de IDs seleccionados
    selectShapesInArea, // Función para seleccionar figuras en un área
  };
};