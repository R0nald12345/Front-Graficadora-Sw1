import { useState, useCallback } from 'react';
import { ShapeAttributes } from '../types/ShapeAttributes';
import { createShape } from '../services/shapeFactory';
import { useLayering } from './useLayering';

/**
 * Hook personalizado para manejar las figuras en el canvas
 * Proporciona funcionalidades para crear, modificar, seleccionar y agrupar figuras
 */
export const useShapes = () => {
  // Estados principales
  const [shapes, setShapes] = useState<ShapeAttributes[]>([]); // Almacena todas las figuras
  const [selectedId, setSelectedId] = useState<string | null>(null); // ID de la figura seleccionada
  const [selectedIds, setSelectedIds] = useState<string[]>([]); // IDs para selección múltiple
  const [isTextMode, setIsTextMode] = useState(false); // Modo de inserción de texto

  // Importar funciones de capas
  const { moveForward, moveBackward } = useLayering({ shapes, setShapes });

  /**
   * Calcula los límites de un grupo de figuras
   * @param shapes Array de figuras para calcular sus límites
   * @returns Objeto con las coordenadas y dimensiones del grupo
   */
  const getGroupBounds = (shapes: ShapeAttributes[]) => {
    if (shapes.length === 0) return { x: 0, y: 0, width: 0, height: 0 };

    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    shapes.forEach(shape => {
      minX = Math.min(minX, shape.x);
      minY = Math.min(minY, shape.y);
      maxX = Math.max(maxX, shape.x + shape.width);
      maxY = Math.max(maxY, shape.y + shape.height);
    });

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  };

  /**
   * Añade una nueva figura al canvas
   * @param type Tipo de figura ('rectangle', 'circle', 'text', etc)
   * @param xOrAttrs Coordenada X o atributos de la figura
   * @param y Coordenada Y (opcional)
   */
  const addShape = useCallback((
    type: string,
    xOrAttrs?: number | Partial<ShapeAttributes>,
    y: number = 100
  ) => {
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

    const x = typeof xOrAttrs === 'number' ? xOrAttrs : 100;
    let newShape;

    if (type === "text") {
      newShape = new ShapeAttributes({
        type: "text",
        x, y,
        fill: "#FFFF00",
        width: 200,
        height: 50,
        draggable: true,
        fontSize: 24,
        fontFamily: "Arial",
        zIndex: shapes.length,
      });
    } else {
      newShape = createShape(type);
      newShape.x = x;
      newShape.y = y;
      newShape.zIndex = shapes.length;
    }

    setShapes([...shapes, newShape]);
    setSelectedId(newShape.id);
    setSelectedIds([newShape.id]);
  }, [shapes]);

  /**
   * Actualiza los atributos de una figura existente
   */
  const updateShape = useCallback((id: string, newAttrs: Partial<ShapeAttributes>) => {
    setShapes(shapes.map(shape => 
      shape.id === id ? shape.cloneWith(newAttrs) : shape
    ));
  }, [shapes]);

  /**
   * Selecciona una o varias figuras
   * @param isMultiSelect Indica si es selección múltiple (con Ctrl/Shift)
   */
  const selectShape = useCallback((id: string, isMultiSelect: boolean = false) => {
    if (isMultiSelect) {
      setSelectedIds(prevIds => 
        prevIds.includes(id) 
          ? prevIds.filter(shapeId => shapeId !== id)
          : [...prevIds, id]
      );
    } else {
      setSelectedId(id);
      setSelectedIds([id]);
    }
  }, []);

  /**
   * Agrupa múltiples figuras en una sola
   */
  const groupShapes = useCallback((shapeIds: string[]) => {
    if (shapeIds.length < 2) return;

    const shapesToGroup = shapes.filter(shape => shapeIds.includes(shape.id));
    const groupBounds = getGroupBounds(shapesToGroup);

    const groupShape = new ShapeAttributes({
      type: 'group',
      id: `group-${Date.now()}`,
      ...groupBounds,
      children: shapesToGroup,
      isGroup: true,
      draggable: true
    });

    setShapes(prev => prev
      .filter(shape => !shapeIds.includes(shape.id))
      .concat(groupShape)
    );
    setSelectedId(groupShape.id);
    setSelectedIds([]);
  }, [shapes]);

  /**
   * Desagrupa un grupo de figuras
   */
  const ungroupShapes = useCallback((groupId: string) => {
    const group = shapes.find(shape => shape.id === groupId);
    if (!group?.children || !Array.isArray(group.children)) return;
  
    setShapes(prev => prev
      .filter(shape => shape.id !== groupId)
      .concat(group.children || [])
    );
    setSelectedId(null);
    setSelectedIds([]);
  }, [shapes]);

  return {
    shapes,
    selectedId,
    selectedIds,
    isTextMode,
    setIsTextMode,
    addShape,
    updateShape,
    selectShape,
    deselectShape: () => {
      setSelectedId(null);
      setSelectedIds([]);
    },
    deleteShape: useCallback((id: string) => {
      setShapes(shapes.filter(shape => shape.id !== id));
      if (selectedId === id) {
        setSelectedId(null);
        setSelectedIds([]);
      }
    }, [shapes, selectedId]),
    moveForward,
    moveBackward,
    groupShapes,
    ungroupShapes,
    handleCanvasClick: useCallback((e: any) => {
      if (isTextMode && e.target === e.target.getStage()) {
        const pos = e.target.getPointerPosition();
        addShape("text", pos.x, pos.y);
      } else if (e.target === e.target.getStage()) {
        setSelectedId(null);
        setSelectedIds([]);
      }
    }, [isTextMode, addShape]),
    setShapes,
    setSelectedId,
    setSelectedIds
  };
};