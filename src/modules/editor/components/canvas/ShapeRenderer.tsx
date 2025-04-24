// src/modules/editor/components/canvas/ShapeRenderer.tsx
import React from "react";
import { Rect, Circle, Star, Line } from "react-konva";
import { ShapeAttributes } from "../../types/ShapeAttributes";
import Konva from "konva";

interface ShapeRendererProps {
  shape: ShapeAttributes;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, attrs: Partial<ShapeAttributes>) => void;
}

const ShapeRenderer: React.FC<ShapeRendererProps> = ({ 
  shape, 
  isSelected, 
  onSelect, 
  onUpdate 
}) => {
  const handleDragEnd = (e :Konva.KonvaEventObject<DragEvent>) => {
    onUpdate(shape.id, {
      x: e.target.x(),
      y: e.target.y()
    });
  };

  const handleTransformEnd = (e :Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    
    onUpdate(shape.id, {
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * node.scaleX()),
      height: Math.max(5, node.height() * node.scaleY()),
      rotation: node.rotation()
    });
    
   
    node.scaleX(1);
    node.scaleY(1);
  };

  const shapeProps = {
    id: shape.id,
    x: shape.x,
    y: shape.y,
    fill: shape.fill,
    stroke: shape.stroke,
    strokeWidth: shape.strokeWidth,
    draggable: shape.draggable,
    rotation: shape.rotation,
    onClick: () => onSelect(shape.id),
    onTap: () => onSelect(shape.id),
    onDragEnd: handleDragEnd,
    onTransformEnd: handleTransformEnd,
  };

  switch (shape.type) {
    case "rectangle":
      return (
        <Rect
          {...shapeProps}
          width={shape.width}
          height={shape.height}
        />
      );
    case "circle":
      return (
        <Circle
          {...shapeProps}
          radius={shape.width / 2}
        />
      );
    case "star":
      return (
        <Star
          {...shapeProps}
          numPoints={5}
          innerRadius={shape.width / 4}
          outerRadius={shape.width / 2}
        />
      );
    case "line":
      return (
        <Line
          {...shapeProps}
          points={[0, 0, shape.width, 0]}
          strokeWidth={shape.strokeWidth || 2}
        />
      );
    default:
      return null;
  }
};

export default ShapeRenderer;