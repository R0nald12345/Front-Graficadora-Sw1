
// useShapes.tsx (refactorizado)
import { useState, useCallback } from 'react';
import { ShapeAttributes } from '../types/ShapeAttributes';
import { createShape } from '../services/shapeFactory';
import { useLayering } from './useLayering';

export const useShapes = () => {
  // Estado para almacenar todas las figuras
  const [shapes, setShapes] = useState<ShapeAttributes[]>([]);

  // Estado para rastrear la figura seleccionada (por su ID)
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [isTextMode, setIsTextMode] = useState(false);

  // Estado para guardar múltiples IDs seleccionados
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Importamos las funciones de capas desde el hook useLayering
  const { moveForward, moveBackward } = useLayering({ shapes, setShapes });

  // Función para agregar una nueva figura al lienzo
  const addShape = useCallback((
    type: string,
    xOrAttrs?: number | Partial<ShapeAttributes>,
    y: number = 100
  ) => {
    // Para imágenes (cuando xOrAttrs es un objeto)
    if (typeof xOrAttrs === 'object' && xOrAttrs !== null) {
      if (type === "image") {
        const attrs = xOrAttrs as Partial<ShapeAttributes>;
        const newShape = new ShapeAttributes({
          type: 'image',
          x: attrs.x || 100,
          y: attrs.y || 100,
          width: attrs.width || 100,
          height: attrs.height || 100,
          image: attrs.image,
          src: attrs.src,
          draggable: true,
          rotation: attrs.rotation || 0,
          zIndex: shapes.length,
        });
        setShapes(prev => [...prev, newShape]);
        setSelectedId(newShape.id);
        setSelectedIds([newShape.id]);
        return;
      }
    }
  
    // Para otras figuras (usando x, y como coordenadas)
    const x = typeof xOrAttrs === 'number' ? xOrAttrs : 100;
  
    if (type === "text") {
      const newShape = new ShapeAttributes({
        type: "text",
        x: x,
        y: y,
        fill: "#FFFF00",
        stroke: "",
        strokeWidth: 0,
        width: 200,
        height: 50,
        draggable: true,
        rotation: 0,
        fontSize: 24,
        fontFamily: "Arial",
        zIndex: shapes.length,
      });
      setShapes([...shapes, newShape]);
      setSelectedId(newShape.id);
      setSelectedIds([newShape.id]);
    } 
    else if (type === "triangle") {
      const newShape = new ShapeAttributes({
        type: "triangle",
        x: x,
        y: y,
        fill: "#FFFF00",
        stroke: "#000",
        strokeWidth: 2,
        width: 100,
        height: 100,
        draggable: true,
        rotation: 0,
        zIndex: shapes.length,
      });
      setShapes([...shapes, newShape]);
      setSelectedId(newShape.id);
      setSelectedIds([newShape.id]);
    }
    else {
      const newShape = createShape(type);
      newShape.x = x;
      newShape.y = y;
      newShape.zIndex = shapes.length;
      setShapes([...shapes, newShape]);
      setSelectedId(newShape.id);
      setSelectedIds([newShape.id]);
    }
  }, [shapes]);




  // Función para actualizar los atributos de una figura existente
  const updateShape = useCallback((id: string, newAttrs: Partial<ShapeAttributes>) => {
    setShapes(
      shapes.map((shape) => {
        if (shape.id === id) {
          return shape.cloneWith(newAttrs); // Clona la figura y actualiza sus atributos
        }
        return shape; // Devuelve las figuras que no se actualizan sin cambios
      })
    );
  }, [shapes]);

  // Función para seleccionar una figura (con soporte para selección múltiple)
  const selectShape = useCallback((id: string, isMultiSelect: boolean = false) => {
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
  }, []);

  // Función para deseleccionar cualquier figura
  const deselectShape = useCallback(() => {
    setSelectedId(null);
    setSelectedIds([]);
  }, []);

  // Función para seleccionar figuras en un área
  const selectShapesInArea = useCallback((x1: number, y1: number, x2: number, y2: number) => {
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
  }, [shapes]);

  // Función para eliminar una figura del lienzo
  const deleteShape = useCallback((id: string) => {
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
  }, [shapes, selectedId]);

  // Función para agrupar figuras
  const groupShapes = useCallback((ids: string[]) => {
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
  }, [shapes]);

  // Función para desagrupar figuras (continuación)
  const ungroupShapes = useCallback((groupId: string) => {
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
  }, [shapes, selectedId]);

  // Función para actualizar texto
  const updateText = useCallback((id: string, newText: string) => {
    setShapes(
      shapes.map((shape) => {
        if (shape.id === id) {
          return { ...shape, text: newText };
        }
        return shape;
      })
    );
  }, [shapes]);

  // Manejador para clics en el canvas
  const handleCanvasClick = useCallback((e: any) => {
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
  }, [isTextMode, addShape, deselectShape]);

  // Devuelve las funciones y estados para manejar las figuras
  return {
    shapes,
    selectedId,
    isTextMode,
    setIsTextMode,  // Exponemos esta función para cambiar el modo
    addShape,
    updateShape,
    updateText,
    selectShape,
    deselectShape,
    deleteShape,
    moveForward,
    moveBackward,
    groupShapes,
    ungroupShapes,
    handleCanvasClick,
    selectedIds,
    selectShapesInArea,

    setShapes,
    setSelectedId,
    setSelectedIds
  };
};




