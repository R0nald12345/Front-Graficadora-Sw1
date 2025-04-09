import { useRef, useEffect } from "react";
import { Stage, Layer, Transformer } from 'react-konva';
import { ShapeAttributes } from "../types/ShapeAttributes";

interface CanvasProps {
  selectedId: string | null;
  shapes: ShapeAttributes[];
  onSelect: (id: string) => void;
  onDeselect: () => void;
}

export const useCanvas = ({ 
  selectedId, 
  shapes, 
  onSelect, 
  onDeselect 
}: CanvasProps) => {

    
  // Update the ref types to be more specific
  const stageRef = useRef<Stage>(null);
  const layerRef = useRef<Layer>(null);
  const transformerRef = useRef<Transformer>(null);

  const handleStageClick = (e: any) => {
    if (e.target === e.target.getStage()) {
      onDeselect();
    }
  };

  useEffect(() => {
    if (selectedId && transformerRef.current && layerRef.current) {
      const selectedNode = layerRef.current.findOne(`#${selectedId}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedId]);

  return {
    stageRef,
    layerRef,
    transformerRef,
    handleStageClick
  };
};