import React from "react";
import { Rect, Circle, Star, Line, Text,Image } from "react-konva"; // Importamos Shape desde react-konva
import { ShapeAttributes } from "../../types/ShapeAttributes";
import Konva from "konva";

interface ShapeRendererProps {
  shape: ShapeAttributes;
  isSelected: boolean;
  onSelect: (id: string, isMultiSelect?: boolean) => void;
  onUpdate: (id: string, attrs: Partial<ShapeAttributes>) => void;
  handleStageClick: (e: any) => void;
}

const ShapeRenderer: React.FC<ShapeRendererProps> = ({
  shape,
  isSelected,
  onSelect,
  onUpdate,
  handleStageClick
}) => {
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    onUpdate(shape.id, {
      x: e.target.x(),
      y: e.target.y()
    });
  };

  // evento onClick para pasar el evento al handler:
  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    onSelect(shape.id, e.evt.ctrlKey || e.evt.shiftKey);
  };

  const handleTransformEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
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
    onClick: handleClick, 
    //--------------TENBER EN CUENTA ESTO
    //onTap: () => onSelect(shape.id),
    onTap: handleClick, 
    //---------------------------------
    onDragEnd: handleDragEnd,
    onTransformEnd: handleTransformEnd,
  };

  // Manejo del doble clic para editar el texto
  const handleTextDblClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const textNode = e.target;
    const stage = textNode.getStage();
    if (!stage) return;

    // Desactivamos temporalmente el evento de clic en el lienzo
    stage.off('mousedown touchstart');

    // Obtenemos la posición absoluta considerando la transformación del stage
    const stageBox = stage.container().getBoundingClientRect();
    const textPosition = textNode.absolutePosition();

    const areaPosition = {
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y
    };

    // Creamos el textarea para editar el texto
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);

    // Establecemos las propiedades del textarea
    textarea.value = shape.text || "Escribe aquí...";
    textarea.style.position = 'absolute';
    textarea.style.top = `${areaPosition.y}px`;
    textarea.style.left = `${areaPosition.x}px`;
    textarea.style.width = `${shape.width}px`;
    textarea.style.height = `${shape.height}px`;
    textarea.style.fontSize = `${shape.fontSize}px`;
    textarea.style.fontFamily = shape.fontFamily || 'Arial';
    textarea.style.border = '1px solid blue';
    textarea.style.padding = '0px';
    textarea.style.margin = '0px';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'white';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.color = shape.fill;

    // Si hay rotación, la aplicamos al textarea
    if (shape.rotation) {
      textarea.style.transform = `rotate(${shape.rotation}deg)`;
      textarea.style.transformOrigin = 'top left';
    }

    // Enfocamos el textarea y seleccionamos el texto
    textarea.focus();
    textarea.select();

    // Función para confirmar la edición y actualizar el texto
    const finishEditing = () => {
      if (stage) {
        stage.on('mousedown touchstart', handleStageClick); // Reactivamos el evento de clic
      }

      // Actualizamos el texto en Konva
      onUpdate(shape.id, { text: textarea.value });

      // Eliminamos el textarea después de la edición
      document.body.removeChild(textarea);
    };

    // Manejadores para finalizar la edición
    textarea.addEventListener('blur', finishEditing);

    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        textarea.blur(); // Confirmamos la edición al presionar Enter
        e.preventDefault();
      }
      if (e.key === 'Escape') {
        textarea.value = shape.text || ""; // Revertimos los cambios si se presiona Escape
        textarea.blur();
        e.preventDefault();
      }
    });
  };

  switch (shape.type) {
    case "rectangle":
      return <Rect {...shapeProps} width={shape.width} height={shape.height} />;
    case "circle":
      return <Circle {...shapeProps} radius={shape.width / 2} />;
    case "star":
      return <Star {...shapeProps} numPoints={5} innerRadius={shape.width / 4} outerRadius={shape.width / 2} />;
    case "line":
      return <Line {...shapeProps} points={[0, 0, shape.width, 0]} strokeWidth={shape.strokeWidth || 2} />;
      case "triangle":
        return (
          <Line
            {...shapeProps}
            points={[
              shape.width / 2, 0,           // Punto superior
              0, shape.height,              // Punto inferior izquierdo
              shape.width, shape.height,    // Punto inferior derecho
              shape.width / 2, 0            // Volver al punto inicial para cerrar
            ]}
            closed={true}  // Importante: cierra la forma para que sea un triángulo completo
          />
        );
    case "text":
      return (
        <Text
          {...shapeProps}
          text={shape.text || "Doble clic para editar"}
          fontSize={shape.fontSize || 24}
          fontFamily={shape.fontFamily || "Arial"}
          fill={shape.fill || "black"}
          stroke={shape.stroke || ""}
          strokeWidth={shape.strokeWidth || 0}
          width={shape.width}
          height={shape.height}
          onDblClick={handleTextDblClick} // Llamamos al manejador de doble clic
        />
      );

      case 'image':
        return (
          <Image
            {...shapeProps}
            image={shape.image}
            width={shape.width}
            height={shape.height}
          />
        );
    default:
      return null;
  }
};

export default ShapeRenderer;
