import { useRef, useEffect } from "react";
import Konva from "konva";
import { ShapeAttributes } from "../types/ShapeAttributes";

/**
 * Interface que define las propiedades necesarias para el hook useCanvas
 */
interface CanvasProps {
  selectedId: string | null;        // ID de la figura seleccionada
  shapes: ShapeAttributes[];        // Array de todas las figuras en el canvas
  onSelect: (id: string) => void;   // Callback para seleccionar una figura
  onDeselect: () => void;          // Callback para deseleccionar figuras
}

/**
 * Hook personalizado para manejar la lógica del canvas
 * Gestiona las referencias al Stage, Layer y Transformer de Konva
 * y maneja la selección/transformación de figuras
 */
export const useCanvas = ({ 
  selectedId, 
  // shapes, 
  // onSelect, 
  onDeselect 
}: CanvasProps) => {
  // Referencias a los elementos principales de Konva
  const stageRef = useRef<Konva.Stage>(null);          // Referencia al Stage (contenedor principal)
  const layerRef = useRef<Konva.Layer>(null);          // Referencia al Layer (capa de dibujo)
  const transformerRef = useRef<Transformer>(null); // Referencia al Transformer (herramienta de transformación)

  /**
   * Maneja el clic en el stage
   * Deselecciona todas las figuras si se hace clic en el fondo
   */
  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      onDeselect();
    }
  };

  /**
   * Effect que actualiza el transformer cuando cambia la selección
   * Conecta el transformer con la figura seleccionada
   */
  useEffect(() => {
    if (selectedId && transformerRef.current && layerRef.current) {
      // Buscar la figura seleccionada en la capa
      const selectedNode = layerRef.current.findOne(`#${selectedId}`);
      
      if (selectedNode) {
        // Conectar el transformer a la figura seleccionada
        (transformerRef.current as any).attachTo(selectedNode);
        // Redibujar la capa para mostrar el transformer
        layerRef.current.batchDraw();
      }
    } else if (transformerRef.current) {
      // Si no hay selección, limpiar el transformer
      (transformerRef.current as any).detach();
      layerRef.current?.batchDraw();
    }
  }, [selectedId]);// Se ejecuta cuando cambia la selección

  // Retornar las referencias y manejadores necesarios
  return {
    stageRef,
    layerRef,
    transformerRef,
    handleStageClick
  };
};