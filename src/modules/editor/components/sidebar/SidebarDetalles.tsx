import React from 'react';
import { ShapeAttributes } from '../../types/ShapeAttributes';

interface SidebarDetallesProps {
  selectedShape: ShapeAttributes | undefined;
  onUpdateShape: (id: string, newAttrs: Partial<ShapeAttributes>) => void;
}

const SidebarDetalles: React.FC<SidebarDetallesProps> = ({ selectedShape, onUpdateShape }) => {
  if (!selectedShape) {
    return (
      <div className="p-4 bg-gris-semi-oscuro  h-full">
        <h2 className="text-lg font-semibold mb-4">Detalles</h2>
        <p className="text-gray-500">Selecciona una figura para editar sus propiedades</p>
      </div>
    );
  }

  const handleChange = (property: keyof ShapeAttributes, value: any) => {
    onUpdateShape(selectedShape.id, { [property]: value });
  };

  return (
    <div className="p-4 bg-gris-semi-oscuro  h-full">
      <h2 className="text-lg font-semibold mb-4">Detalles de la Figura</h2>
      
      {/* Tipo de figura */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Tipo</label>
        <input
          type="text"
          value={selectedShape.type}
          disabled
          className="w-full px-3 py-2 bg-gray-100 rounded"
        />
      </div>

      {/* Posición X */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Posición X</label>
        <input
          type="number"
          value={selectedShape.x}
          onChange={(e) => handleChange('x', Number(e.target.value))}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      {/* Posición Y */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Posición Y</label>
        <input
          type="number"
          value={selectedShape.y}
          onChange={(e) => handleChange('y', Number(e.target.value))}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      {/* Ancho */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Ancho</label>
        <input
          type="number"
          value={selectedShape.width}
          onChange={(e) => handleChange('width', Number(e.target.value))}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      {/* Alto */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Alto</label>
        <input
          type="number"
          value={selectedShape.height}
          onChange={(e) => handleChange('height', Number(e.target.value))}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      {/* Color de relleno */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Color de relleno</label>
        <input
          type="color"
          value={selectedShape.fill}
          onChange={(e) => handleChange('fill', e.target.value)}
          className="w-full h-10"
        />
      </div>

      {/* Color del borde */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Color del borde</label>
        <input
          type="color"
          value={selectedShape.stroke}
          onChange={(e) => handleChange('stroke', e.target.value)}
          className="w-full h-10"
        />
      </div>

      {/* Grosor del borde */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Grosor del borde</label>
        <input
          type="number"
          value={selectedShape.strokeWidth}
          onChange={(e) => handleChange('strokeWidth', Number(e.target.value))}
          className="w-full px-3 py-2 border rounded"
          min="0"
        />
      </div>

      {/* Rotación */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Rotación</label>
        <input
          type="number"
          value={selectedShape.rotation}
          onChange={(e) => handleChange('rotation', Number(e.target.value))}
          className="w-full px-3 py-2 border rounded"
          min="0"
          max="360"
        />
      </div>
    </div>
  );
};

export default SidebarDetalles;