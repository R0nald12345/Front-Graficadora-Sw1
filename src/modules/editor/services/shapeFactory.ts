//Esta clase crea distintos tipos de Formas

// src/modules/editor/services/shapeFactory.ts

import { ShapeAttributes } from "../types/ShapeAttributes"; // Importa la clase ShapeAttributes para definir las figuras

// Función para crear una nueva figura según el tipo especificado
export const createShape = (type: string): ShapeAttributes => {
  const id = `shape-${Date.now()}`; // Genera un identificador único basado en la marca de tiempo actual

  // Atributos base que comparten todas las figuras
  const baseAttrs = {
    id, // ID único de la figura
    type, // Tipo de figura (rectángulo, círculo, etc.)
    x: 100, // Posición X inicial
    y: 100, // Posición Y inicial
    width: 100, // Ancho inicial
    height: 100, // Alto inicial
    fill: "#DD9D9D", // Color de relleno por defecto
    stroke: "#000000", // Color del borde por defecto
    strokeWidth: 0, // Grosor del borde por defecto
    draggable: true, // Indica si la figura es arrastrable
    rotation: 0 // Rotación inicial (0 grados)
  };

  // Personalizaciones específicas según el tipo de figura
  switch (type) {
    case "rectangle":
      // Crea un rectángulo con los atributos base
      return new ShapeAttributes(baseAttrs);
    case "circle":
      // Crea un círculo con los atributos base
      return new ShapeAttributes(baseAttrs);
    case "star":
      // Crea una estrella con un color de relleno amarillo
      return new ShapeAttributes({
        ...baseAttrs, // Copia los atributos base
        fill: "#FFD700" // Cambia el color de relleno a amarillo
      });
    case "line":
      // Crea una línea con un grosor de borde específico y sin relleno
      return new ShapeAttributes({
        ...baseAttrs, // Copia los atributos base
        strokeWidth: 2, // Grosor del borde
        fill: "transparent" // Sin color de relleno
      });
    default:
      // Si no se especifica un tipo válido, devuelve una figura con los atributos base
      return new ShapeAttributes(baseAttrs);
  }
};