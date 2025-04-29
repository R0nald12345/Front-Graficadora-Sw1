import { ShapeAttributes } from '../../types/ShapeAttributes';


const SidebarGraficadora = () => {
  // Estado para controlar qué grupos están expandidos

  return (
    <div className="p-4 bg-gris-semi-oscuro h-full flex flex-col">
      <h2 className="text-xl font-bold text-white mb-4">Nombre del Proyecto</h2>
      
      {/* Lista de capas/figuras */}
      <div className="flex-1 overflow-y-auto">
        <h3 className="text-white text-sm font-medium mb-2">Capas</h3>
        <div className="space-y-1">
          {/* {shapes && shapes.length > 0 ? renderShapeList(shapes) : (
            <p className="text-gray-400 text-sm">No hay figuras en el lienzo</p>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default SidebarGraficadora;