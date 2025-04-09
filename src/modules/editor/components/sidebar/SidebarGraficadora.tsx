import { Stage, Layer, Rect, Circle, Text, Line, Arrow, Star } from 'react-konva';
import { FaImage } from 'react-icons/fa6'; // Importa el ícono de imagen desde react-icons

const SidebarGraficadora = () => {
  return (
    <section className="p-4 bg-black/80 h-full">
      {/* Título del sidebar */}
      <h1 className="text-2xl font-bold text-center text-gray-700 dark:text-gray-200">
        Figuras
      </h1>

      {/* Lienzo principal */}
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {/* Texto en el lienzo */}
          <Text text="Pizarra" fontSize={15} />

          {/* Rectángulo */}
          <Rect
            x={35} // Posición X
            y={50} // Posición Y
            width={80} // Ancho del rectángulo
            height={80} // Alto del rectángulo
            stroke={"black"} // Color del borde
            fill="black" // Color de relleno
          />

          {/* Texto adicional */}
          <Text text="jhgsdf" fontSize={15} />

          {/* Círculo */}
          <Circle
            x={75} // Posición X
            y={200} // Posición Y
            radius={45} // Radio del círculo
            stroke={"black"} // Color del borde
            fill="black" // Color de relleno
          />

          {/* Línea */}
          <Line
            points={[25, 300, 130, 300]} // Coordenadas [x1, y1, x2, y2]
            stroke="black" // Color de la línea
            strokeWidth={10} // Grosor de la línea
          />

          {/* Flecha */}
          <Arrow
            points={[50, 400, 200, 400]} // Coordenadas [x1, y1, x2, y2]
            stroke="blue" // Color de la flecha
            fill="blue" // Color del relleno de la punta
            strokeWidth={4} // Grosor de la flecha
            pointerLength={10} // Longitud de la punta
            pointerWidth={10} // Ancho de la punta
          />

          {/* Triángulo */}
          <Line
            points={[150, 100, 200, 200, 100, 200]} // Coordenadas de los vértices [x1, y1, x2, y2, x3, y3]
            stroke="green" // Color del borde
            strokeWidth={2} // Grosor del borde
            fill="yellow" // Color de relleno
            closed={true} // Cierra el polígono
          />

          {/* Estrella */}
          <Star
            x={300} // Posición X
            y={150} // Posición Y
            numPoints={5} // Número de puntas
            innerRadius={20} // Radio interno
            outerRadius={40} // Radio externo
            fill="orange" // Color de relleno
            stroke="red" // Color del borde
            strokeWidth={2} // Grosor del borde
          />
        </Layer>
      </Stage>

      {/* Ícono de imagen en el sidebar */}
      {/* <div className="mt-4 flex justify-center">
        <FaImage className="text-white text-4xl cursor-pointer" />
      </div> */}
    </section>
  );
};

export default SidebarGraficadora;