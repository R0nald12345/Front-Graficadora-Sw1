import { Rect } from "react-konva";

interface SelectionRectProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

const SelectionRect: React.FC<SelectionRectProps> = ({ x, y, width, height }) => {
  return (
    <Rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill="rgba(0, 161, 255, 0.3)"
      stroke="rgb(0, 161, 255)"
      strokeWidth={1}
    />
  );
};

export default SelectionRect;