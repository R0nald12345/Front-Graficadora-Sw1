import { useState, useCallback, useEffect } from 'react';
import { ShapeAttributes } from '../types/ShapeAttributes';
import { createShape } from '../services/shapeFactory';
import { useLayering } from './useLayering';
import { EditorSocketService } from '../../../sockets/EditorSocketService';

/**
 * Hook personalizado para manejar las figuras en el canvas
 * Proporciona funcionalidades para crear, modificar, seleccionar y agrupar figuras
 */
export const useShapes = (proyectoId: number) => {
  
  
const socketService = EditorSocketService.getInstance();
   // =================== ESTADOS PRINCIPALES ===================
  // Almacena todas las figuras en el canvas
  const [shapes, setShapes] = useState<ShapeAttributes[]>([]); // Almacena todas las figuras
  
  // Almacena el ID de la figura actualmente seleccionada
  const [selectedId, setSelectedId] = useState<string | null>(null); // ID de la figura seleccionada
  
    // Almacena múltiples IDs para selección múltiple (Ctrl+Click)
  const [selectedIds, setSelectedIds] = useState<string[]>([]); // IDs para selección múltiple


   // Controla si estamos en modo de inserción de texto
  const [isTextMode, setIsTextMode] = useState(false); // Modo de inserción de texto


  // =================== IMPORTACIÓN DE HOOKS ===================
  // Importa funciones para manejar el orden de las capas (z-index)
  const { moveForward, moveBackward } = useLayering({ shapes, setShapes });


 // =================== FUNCIONES AUXILIARES ===================
  /**
   * Calcula el rectángulo que contiene todas las figuras seleccionadas
   * Usado principalmente para agrupar figuras
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


  // =================== MANIPULACIÓN DE FIGURAS ===================
  /**
   * Añade una nueva figura al canvas
   * Puede crear diferentes tipos: rectángulo, círculo, texto, imagen
   * @param type - Tipo de figura a crear
   * @param xOrAttrs - Posición X o atributos completos
   * @param y - Posición Y (opcional)
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
   * Se usa para modificar posición, tamaño, color, etc.
   */
  // const updateShape = useCallback((id: string, newAttrs: Partial<ShapeAttributes>) => {
  //   setShapes(shapes.map(shape => 
  //     shape.id === id ? shape.cloneWith(newAttrs) : shape
  //   ));
  // }, [shapes]);

  // =================== SELECCIÓN DE FIGURAS ===================
  /**
   * Maneja la selección de figuras
   * Permite selección simple o múltiple
   * @param id - ID de la figura a seleccionar
   * @param isMultiSelect - true si se está usando Ctrl/Shift para selección múltiple
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


  // =================== AGRUPACIÓN DE FIGURAS ===================
  /**
   * Agrupa múltiples figuras en una sola
   * Crea un nuevo contenedor que mantiene las figuras originales como hijos
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
   * Desagrupa un conjunto de figuras
   * Restaura las figuras originales al canvas
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




  const updateShape = useCallback((id: string, newAttrs: Partial<ShapeAttributes>) => {
    setShapes(shapes.map(shape => 
      shape.id === id ? shape.cloneWith(newAttrs) : shape
    ));
    
    // Emitir cambios al servidor
    socketService.emitShapeModified({
      proyectoId,
      shapeId: id,
      changes: newAttrs
    });
  }, [shapes, proyectoId]);



  const deleteShape = useCallback((id: string) => {
    setShapes(shapes.filter(shape => shape.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
      setSelectedIds([]);
    }

    // Emitir eliminación al servidor
    socketService.emitShapeDeleted({
      proyectoId,
      shapeId: id
    });
  }, [shapes, selectedId, proyectoId]);


    // Efecto para escuchar cambios de otros usuarios
    useEffect(() => {
      const handleShapeModified = (data: any) => {
        if (data.proyectoId === proyectoId) {
          setShapes(prevShapes => 
            prevShapes.map(shape => 
              shape.id === data.shapeId 
                ? shape.cloneWith(data.changes) 
                : shape
            )
          );
        }
      };
  
      const handleShapeDeleted = (data: any) => {
        if (data.proyectoId === proyectoId) {
          setShapes(prevShapes => 
            prevShapes.filter(shape => shape.id !== data.shapeId)
          );
        }
      };
  
      socketService.onShapeModified(handleShapeModified);
      socketService.onShapeDeleted(handleShapeDeleted);
  
      return () => {
        const socket = socketService.getSocketInstance();
        if (socket) {
          socket.off('shapeModified', handleShapeModified);
          socket.off('shapeDeleted', handleShapeDeleted);
        }
      };
    }, [proyectoId]);
















  
    return {
      // Estados
      shapes,
      selectedId,
      selectedIds,
      isTextMode,
      
      // Setters
      setIsTextMode,
      setShapes,
      setSelectedId,
      setSelectedIds,
      
      // Funciones de manipulación
      addShape,
      updateShape,
      selectShape,
      deleteShape, // Usar la función completa que ya definiste arriba
      
      // Funciones de organización
      moveForward,
      moveBackward,
      groupShapes,
      ungroupShapes,
      
      // Funciones de interacción
      deselectShape: () => {
        setSelectedId(null);
        setSelectedIds([]);
      },
      handleCanvasClick: useCallback((e: any) => {
        if (isTextMode) {
          addShape('text', e.evt.x, e.evt.y);
          setIsTextMode(false);
        } else {
          setSelectedId(null);
          setSelectedIds([]);
        }
      }, [isTextMode, addShape])
    };
  };