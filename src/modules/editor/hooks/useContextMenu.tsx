// useContextMenu.tsx
import { useState } from "react";
import Konva from "konva";

export const useContextMenu = () => {
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
  }>({
    visible: false,
    x: 0,
    y: 0
  });

  const handleContextMenu = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    if (!stage) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    setContextMenu({
      visible: true,
      x: pos.x,
      y: pos.y
    });
  };

  const closeContextMenu = () => {
    setContextMenu({
      visible: false,
      x: 0,
      y: 0
    });
  };

  return {
    contextMenu,
    handleContextMenu,
    closeContextMenu
  };
};