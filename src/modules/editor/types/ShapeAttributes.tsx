export class ShapeAttributes {
    // Atributos de la figura
    id: string; // Identificador único de la figura
    type: string; // Tipo de figura (rectángulo, círculo, línea, etc.)
    x: number; // Posición X de la figura en el lienzo
    y: number; // Posición Y de la figura en el lienzo
    width: number; // Ancho de la figura
    height: number; // Alto de la figura
    fill: string; // Color de relleno de la figura
    stroke: string; // Color del borde de la figura
    strokeWidth: number; // Grosor del borde de la figura
    draggable: boolean; // Indica si la figura es arrastrable
    rotation: number; // Rotación de la figura en grados

    // Constructor para inicializar los atributos
    constructor(params: {
        id?: string, // ID opcional, se genera automáticamente si no se proporciona
        type: string, // Tipo de figura (obligatorio)
        x?: number, // Posición X inicial (opcional)
        y?: number, // Posición Y inicial (opcional)
        width?: number, // Ancho inicial (opcional)
        height?: number, // Alto inicial (opcional)
        fill?: string, // Color de relleno inicial (opcional)
        stroke?: string, // Color del borde inicial (opcional)
        strokeWidth?: number, // Grosor del borde inicial (opcional)
        draggable?: boolean, // Si es arrastrable o no (opcional)
        rotation?: number // Rotación inicial (opcional)
    }) {
        this.id = params.id || `shape-${Date.now()}`; // Genera un ID único si no se proporciona
        this.type = params.type; // Asigna el tipo de figura
        this.x = params.x || 100; // Posición X por defecto: 100
        this.y = params.y || 100; // Posición Y por defecto: 100
        this.width = params.width || 100; // Ancho por defecto: 100
        this.height = params.height || 100; // Alto por defecto: 100
        this.fill = params.fill || "#DD9D9D"; // Color de relleno por defecto
        this.stroke = params.stroke || "#000000"; // Color del borde por defecto
        this.strokeWidth = params.strokeWidth || 0; // Grosor del borde por defecto: 0
        this.draggable = params.draggable !== undefined ? params.draggable : true; // Arrastrable por defecto: true
        this.rotation = params.rotation || 0; // Rotación por defecto: 0 grados
    }

    // Método para escalar la figura
    scale(sx: number, sy: number): ShapeAttributes {
        this.width *= sx; // Escala el ancho por el factor `sx`
        this.height *= sy; // Escala el alto por el factor `sy`
        return this; // Devuelve la figura actualizada
    }

    // Método para mover la figura
    move(dx: number, dy: number): ShapeAttributes {
        this.x += dx; // Desplaza la posición X por `dx`
        this.y += dy; // Desplaza la posición Y por `dy`
        return this; // Devuelve la figura actualizada
    }

    // Método para rotar la figura
    rotate(angle: number): ShapeAttributes {
        this.rotation = (this.rotation + angle) % 360; // Suma el ángulo y lo ajusta al rango de 0 a 360
        return this; // Devuelve la figura actualizada
    }

    // Método para actualizar el estilo de la figura
    setStyle(fill?: string, stroke?: string, strokeWidth?: number): ShapeAttributes {
        if (fill) this.fill = fill; // Actualiza el color de relleno si se proporciona
        if (stroke) this.stroke = stroke; // Actualiza el color del borde si se proporciona
        if (strokeWidth !== undefined) this.strokeWidth = strokeWidth; // Actualiza el grosor del borde si se proporciona
        return this; // Devuelve la figura actualizada
    }

    // Método para clonar y actualizar atributos
    cloneWith(newAttrs: Partial<ShapeAttributes>): ShapeAttributes {
        return new ShapeAttributes({
            id: newAttrs.id ?? this.id, // Mantiene el ID actual si no se proporciona uno nuevo
            type: newAttrs.type ?? this.type, // Mantiene el tipo actual si no se proporciona uno nuevo
            x: newAttrs.x ?? this.x, // Mantiene la posición X actual si no se proporciona una nueva
            y: newAttrs.y ?? this.y, // Mantiene la posición Y actual si no se proporciona una nueva
            width: newAttrs.width ?? this.width, // Mantiene el ancho actual si no se proporciona uno nuevo
            height: newAttrs.height ?? this.height, // Mantiene el alto actual si no se proporciona uno nuevo
            fill: newAttrs.fill ?? this.fill, // Mantiene el color de relleno actual si no se proporciona uno nuevo
            stroke: newAttrs.stroke ?? this.stroke, // Mantiene el color del borde actual si no se proporciona uno nuevo
            strokeWidth: newAttrs.strokeWidth ?? this.strokeWidth, // Mantiene el grosor del borde actual si no se proporciona uno nuevo
            draggable: newAttrs.draggable ?? this.draggable, // Mantiene la propiedad de arrastrable actual si no se proporciona una nueva
            rotation: newAttrs.rotation ?? this.rotation, // Mantiene la rotación actual si no se proporciona una nueva
        });
    }
}