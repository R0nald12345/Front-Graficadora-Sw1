// services/shapeManagement.ts
import { ShapeAttributes } from '../types/ShapeAttributes';

// Esta función crea un nuevo grupo a partir de una lista de figuras
export const createGroupFromShapes = (shapesToGroup: ShapeAttributes[]): ShapeAttributes | null => {
  if (!shapesToGroup || shapesToGroup.length < 2) return null;

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
    children: shapesToGroup.map(shape => {
      return shape.cloneWith({
        x: shape.x - minX,  // Posición relativa al grupo
        y: shape.y - minY   // Posición relativa al grupo
      });
    }),
    zIndex: 0 // Se actualizará cuando se agregue al array de formas
  });

  return newGroup;
};

// Esta función descompone un grupo en sus formas constituyentes
export const unpackGroup = (group: ShapeAttributes): ShapeAttributes[] => {
  if (!group || group.type !== 'group' || !group.children) return [];

  // Obtener las figuras del grupo y ajustar sus posiciones absolutas
  return group.children.map(child => {
    return child.cloneWith({
      x: group.x + child.x,  // Convertir a posición absoluta
      y: group.y + child.y   // Convertir a posición absoluta
    });
  });
};

// Esta función calcula si una forma está dentro de un área rectangular
export const isShapeInArea = (
  shape: ShapeAttributes, 
  x1: number, 
  y1: number, 
  x2: number, 
  y2: number
): boolean => {
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);

  // Para formas simples, chequeamos su bounding box
  return (
    shape.x >= minX &&
    shape.x + shape.width <= maxX &&
    shape.y >= minY &&
    shape.y + shape.height <= maxY
  );
};