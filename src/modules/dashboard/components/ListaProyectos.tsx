import Lista from "./ListadoProyecto/Lista"



const ListaProyectos = () => {
  return (
    <>
      <section className="flex flex-col justify-center w-[80%] mx-auto mt-5">
        <div className="w-full flex bg-white  rounded-2xl">
          <h4 className="font-semibold text-start w-[70%] px-3 py-2">
            Nombre
          </h4>

          <h4 className="font-semibold text-center w-[30%] px-3 py-2">
            Acciones
          </h4>
        </div>

        <ul className="overflow-y-auto scrollbar-hide">
          {/* {listaFiltrada.map((element) => (
                <ListaUE
                  key={element.id}
                  id={element.id}
                  nombreUE={element.nombre}
                  nombreDirector={element.gestion.director}
                  datosUnidadEducativa={datosUnidadEducativa}
                  setDatosUnidadEducativa={setDatosUnidadEducativa}
                  // nombreDirector={element.idGestion.director}
                  turno={element.idTurno.nombre}
                />
              ))} */}

            <Lista/>
            <Lista/>
            <Lista/>
            <Lista/>

        </ul>
      </section>
    </>
  )
}

export default ListaProyectos