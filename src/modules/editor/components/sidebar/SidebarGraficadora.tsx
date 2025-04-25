
// Define la interfaz para las props del componente
interface SidebarGraficadoraProps {
  onToolSelect: (type: string) => void; // Función que recibe un string y no retorna nada (void)
}

// Define el componente con sus props tipadas
const SidebarGraficadora: React.FC<SidebarGraficadoraProps> = ({ onToolSelect }) => {
  return (
    <div className="p-4 bg-gris-semi-oscuro h-full" >
      <h2 className="text-xl font-bold text-white mb-4">Nombre del Proyecto</h2>
      
      {/* Botones para las diferentes herramientas */}
      {/* <div className="space-y-2">
        <button
          className="w-full p-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          onClick={() => onToolSelect('rectangle')}
        >
          Rectángulo
        </button>
        
        <button
          className="w-full p-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          onClick={() => onToolSelect('circle')}
        >
          Círculo
        </button>
        
        <button
          className="w-full p-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          onClick={() => onToolSelect('star')}
        >
          Estrella
        </button>
        
        <button
          className="w-full p-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          onClick={() => onToolSelect('line')}
        >
          Línea
        </button>
      </div> */}
    </div>
  );
};

export default SidebarGraficadora;