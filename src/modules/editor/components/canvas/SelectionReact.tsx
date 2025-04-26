import { Rect } from "react-konva";

interface SelectionRectProps {
  isSelecting: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
}

const SelectionRect: React.FC<SelectionRectProps> = ({
  isSelecting,
  x,
  y,
  width,
  height
}) => {
  if (!isSelecting) return null;

  return (
    <Rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill="rgba(0, 161, 255, 0.3)"
      stroke="#00A1FF"
      strokeWidth={1}
    />
  );
};

export default SelectionRect;