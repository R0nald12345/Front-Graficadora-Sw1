// useSelection.tsx
import { useState, useRef } from "react";
import Konva from "konva";

interface UseSelectionProps {
  stageRef: React.RefObject<Konva.Stage>;
  onDeselectShape: () => void;
  onCanvasClick: (e: any) => void;
  onSelectShapesInArea: (x1: number, y1: number, x2: number, y2: number) => void;
}

export const useSelection = ({
  stageRef,
  onDeselectShape,
  onCanvasClick,
  onSelectShapesInArea
}: UseSelectionProps) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionArea, setSelectionArea] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 });

  const handleMouseDown = (e: any) => {
    if (e.target === e.target.getStage()) {
      // Comienza la selección por área
      const pos = e.target.getStage().getPointerPosition();
      if (pos) {
        setIsSelecting(true);
        setSelectionArea({
          x1: pos.x,
          y1: pos.y,
          x2: pos.x,
          y2: pos.y
        });
        onDeselectShape();
      }
    }
    onCanvasClick(e);
  };

  const handleMouseMove = (e: any) => {
    if (!isSelecting) return;

    const pos = e.target.getStage().getPointerPosition();
    if (pos) {
      setSelectionArea(prev => ({
        ...prev,
        x2: pos.x,
        y2: pos.y
      }));
    }
  };

  const handleMouseUp = (e: any) => {
    if (!isSelecting) return;

    const pos = e.target.getStage().getPointerPosition();
    if (pos) {
      setSelectionArea(prev => ({
        ...prev,
        x2: pos.x,
        y2: pos.y
      }));

      // Determina qué figuras están dentro del área seleccionada
      onSelectShapesInArea(selectionArea.x1, selectionArea.y1, pos.x, pos.y);
    }
    setIsSelecting(false);
  };

  return {
    isSelecting,
    selectionArea,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};