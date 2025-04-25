import React, { useState } from 'react';
import { ShapeAttributes } from '../../types/ShapeAttributes';
import { 
  ChevronDown, 
  ChevronRight, 
  Square, 
  Circle, 
  Star, 
  Minus,
  MoveUp,
  MoveDown,
  Layers,
  Trash2,
  Group,
  Ungroup
} from 'lucide-react';
import { IoTriangleOutline } from "react-icons/io5";
import { TfiText } from "react-icons/tfi";

// Definimos la interfaz para las props del componente
interface SidebarGraficadoraProps {
  onToolSelect: (type: string, x?: number, y?: number) => void; // Función para seleccionar herramienta
  shapes: ShapeAttributes[]; // Lista de figuras en el canvas
  selectedId: string | null; // ID de la figura seleccionada
  onSelectShape: (id: string) => void; // Función para seleccionar una figura
  onDeleteShape: (id: string) => void; // Función para eliminar una figura
  onMoveForward: (id: string) => void; // Función para mover una figura hacia adelante
  onMoveBackward: (id: string) => void; // Función para mover una figura hacia atrás
  onGroupShapes: (ids: string[]) => void; // Función para agrupar figuras
  onUngroupShapes: (groupId: string) => void; // Función para desagrupar figuras
}

const SidebarGraficadora: React.FC<SidebarGraficadoraProps> = ({
  onToolSelect,
  shapes,
  selectedId,
  onSelectShape,
  onDeleteShape,
  onMoveForward,
  onMoveBackward,
  onGroupShapes,
  onUngroupShapes
}) => {
  // Estado para controlar qué grupos están expandidos
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Estado para la selección múltiple
  const [selectedShapeIds, setSelectedShapeIds] = useState<string[]>([]);

  // Función para alternar la expansión de un grupo
  const toggleGroup = (groupId: string) => {
    const newExpandedGroups = new Set(expandedGroups);
    if (newExpandedGroups.has(groupId)) {
      newExpandedGroups.delete(groupId);
    } else {
      newExpandedGroups.add(groupId);
    }
    setExpandedGroups(newExpandedGroups);
  };

  // Función para manejar la selección múltiple
  const handleShapeSelect = (id: string, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      // Selección múltiple con Ctrl/Cmd
      setSelectedShapeIds(prev => {
        if (prev.includes(id)) {
          return prev.filter(shapeId => shapeId !== id);
        } else {
          return [...prev, id];
        }
      });
    } else {
      // Selección simple
      setSelectedShapeIds([]);
      onSelectShape(id);
    }
  };

  // Función para obtener el icono según el tipo de forma
  const getShapeIcon = (type: string) => {
    switch (type) {
      case 'rectangle':
        return <Square size={16} />;
      case 'circle':
        return <Circle size={16} />;
      case 'star':
        return <Star size={16} />;
      case 'line':
        return <Minus size={16} />;
      case 'triangle':
        return <IoTriangleOutline size={16} />;
      case 'text':
        return <TfiText size={16} />;
      case 'group':
        return <Layers size={16} />;
      default:
        return <Square size={16} />;
    }
  };

  // Render recursivo para las figuras y grupos
  const renderShapeList = (shapeList: ShapeAttributes[], isInGroup = false) => {
    return shapeList.map((shape) => {
      const isSelected = selectedId === shape.id || selectedShapeIds.includes(shape.id);
      const isGroup = shape.type === 'group';
      const isExpanded = expandedGroups.has(shape.id);

      return (
        <div key={shape.id} className={`pl-${isInGroup ? '4' : '0'}`}>
          <div 
            className={`flex items-center p-2 ${isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-700'} rounded cursor-pointer`}
            onClick={(e) => handleShapeSelect(shape.id, e)}
          >
            {isGroup && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleGroup(shape.id);
                }}
                className="mr-1 focus:outline-none"
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}
            
            <span className="flex items-center">
              {getShapeIcon(shape.type)}
              <span className="ml-2 text-white">{shape.type} {shape.id.slice(-4)}</span>
            </span>
            
            <div className="ml-auto flex">
              <button 
                className="p-1 text-white hover:bg-gray-600 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveForward(shape.id);
                }}
                title="Traer adelante"
              >
                <MoveUp size={14} />
              </button>
              
              <button 
                className="p-1 text-white hover:bg-gray-600 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveBackward(shape.id);
                }}
                title="Enviar atrás"
              >
                <MoveDown size={14} />
              </button>
              
              <button 
                className="p-1 text-white hover:bg-gray-600 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteShape(shape.id);
                }}
                title="Eliminar"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          
          {isGroup && isExpanded && shape.children && (
            <div className="ml-4 border-l border-gray-600">
              {renderShapeList(shape.children, true)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="p-4 bg-gris-semi-oscuro h-full flex flex-col">
      <h2 className="text-xl font-bold text-white mb-4">Nombre del Proyecto</h2>
      
      {/* Panel de herramientas */}
      <div className="mb-6">
        <h3 className="text-white text-sm font-medium mb-2">Herramientas</h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            className="p-2 bg-gray-700 text-white rounded hover:bg-gray-600 flex flex-col items-center justify-center"
            onClick={() => onToolSelect('rectangle')}
            title="Rectángulo"
          >
            <Square size={18} />
            <span className="text-xs mt-1">Rect</span>
          </button>
          
          <button
            className="p-2 bg-gray-700 text-white rounded hover:bg-gray-600 flex flex-col items-center justify-center"
            onClick={() => onToolSelect('circle')}
            title="Círculo"
          >
            <Circle size={18} />
            <span className="text-xs mt-1">Círc</span>
          </button>
          
          <button
            className="p-2 bg-gray-700 text-white rounded hover:bg-gray-600 flex flex-col items-center justify-center"
            onClick={() => onToolSelect('star')}
            title="Estrella"
          >
            <Star size={18} />
            <span className="text-xs mt-1">Estr</span>
          </button>
          
          <button
            className="p-2 bg-gray-700 text-white rounded hover:bg-gray-600 flex flex-col items-center justify-center"
            onClick={() => onToolSelect('triangle')}
            title="Triángulo"
          >
            <IoTriangleOutline size={18} />
            <span className="text-xs mt-1">Triáng</span>
          </button>
          
          <button
            className="p-2 bg-gray-700 text-white rounded hover:bg-gray-600 flex flex-col items-center justify-center"
            onClick={() => onToolSelect('line')}
            title="Línea"
          >
            <Minus size={18} />
            <span className="text-xs mt-1">Línea</span>
          </button>
          
          <button
            className="p-2 bg-gray-700 text-white rounded hover:bg-gray-600 flex flex-col items-center justify-center"
            onClick={() => onToolSelect('text')}
            title="Texto"
          >
            <TfiText size={18} />
            <span className="text-xs mt-1">Texto</span>
          </button>
        </div>
      </div>
      
      {/* Acciones para grupos */}
      <div className="mb-4">
        <div className="flex space-x-2">
          <button
            className={`p-2 ${selectedShapeIds.length > 1 ? 'bg-blue-600' : 'bg-gray-700'} text-white rounded hover:bg-blue-500 flex items-center justify-center`}
            onClick={() => {
              if (selectedShapeIds.length > 1) {
                onGroupShapes(selectedShapeIds);
                setSelectedShapeIds([]);
              }
            }}
            disabled={selectedShapeIds.length <= 1}
            title="Agrupar"
          >
            <Group size={16} />
            <span className="ml-1">Agrupar</span>
          </button>
          
          <button
            className={`p-2 ${selectedId && shapes.find(s => s.id === selectedId)?.type === 'group' ? 'bg-blue-600' : 'bg-gray-700'} text-white rounded hover:bg-blue-500 flex items-center justify-center`}
            onClick={() => {
              if (selectedId) {
                const selectedShape = shapes.find(s => s.id === selectedId);
                if (selectedShape && selectedShape.type === 'group') {
                  onUngroupShapes(selectedId);
                }
              }
            }}
            disabled={!selectedId || !shapes.find(s => s.id === selectedId)?.type === 'group'}
            title="Desagrupar"
          >
            <Ungroup size={16} />
            <span className="ml-1">Desagrupar</span>
          </button>
        </div>
      </div>
      
      {/* Lista de capas/figuras */}
      <div className="flex-1 overflow-y-auto">
        <h3 className="text-white text-sm font-medium mb-2">Capas</h3>
        <div className="space-y-1">
          {renderShapeList(shapes)}
        </div>
        
        {shapes.length === 0 && (
          <p className="text-gray-400 text-sm">No hay figuras en el lienzo</p>
        )}
      </div>
    </div>
  );
};

export default SidebarGraficadora;