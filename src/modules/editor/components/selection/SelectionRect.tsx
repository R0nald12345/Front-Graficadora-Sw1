// components/SelectionRect.tsx
import { Rect } from 'react-konva';

export const SelectionRect = ({ isSelecting, selectionArea }: { isSelecting: boolean, selectionArea: any }) => {
  if (!isSelecting) return null;

  return (
    <Rect
      x={Math.min(selectionArea.x1, selectionArea.x2)}
      y={Math.min(selectionArea.y1, selectionArea.y2)}
      width={Math.abs(selectionArea.x2 - selectionArea.x1)}
      height={Math.abs(selectionArea.y2 - selectionArea.y1)}
      fill="rgba(0, 161, 255, 0.3)"
      stroke="#00A1FF"
      strokeWidth={1}
    />
  );
};
