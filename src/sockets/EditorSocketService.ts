import { io, Socket } from 'socket.io-client';

// Definimos una clase `EditorSocketService` para manejar las conexiones y eventos de WebSocket
export class EditorSocketService {
    // Creamos una propiedad privada `socket` de tipo `Socket` para mantener la conexión WebSocket
    private socket: Socket;

    // Instancia estática única de la clase (patrón Singleton)
    private static instance: EditorSocketService;

    // Constructor privado para asegurarnos de que solo haya una instancia de la clase
    private constructor() {
        // Inicializamos la conexión WebSocket usando la URL especificada en el entorno de variables
        // Si no se encuentra la variable de entorno `VITE_SOCKET_URL`, usa 'http://localhost:3000' por defecto
        this.socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000', {
            // Enviamos un token de autenticación usando `localStorage` para mantener la sesión del usuario
            auth: {
                token: localStorage.getItem('token')
            }
        });

        // Llamamos a la función `setupListeners` para configurar los eventos del WebSocket
        this.setupListeners();
    }

    // Método estático para obtener la instancia única de la clase (Singleton)
    public static getInstance(): EditorSocketService {
        // Si la instancia no existe, la creamos
        if (!EditorSocketService.instance) {
            EditorSocketService.instance = new EditorSocketService();
        }
        // Retornamos la instancia única
        return EditorSocketService.instance;
    }

    // Método privado para configurar los eventos del WebSocket
    private setupListeners(): void {
        // Configuramos un listener para el evento 'connect', que se dispara cuando el cliente se conecta al servidor
        this.socket.on('connect', () => {
            console.log('Conectado al servidor de WebSocket');
        });

        // Configuramos un listener para el evento 'disconnect', que se dispara cuando el cliente se desconecta del servidor
        this.socket.on('disconnect', () => {
            console.log('Desconectado del servidor de WebSocket');
        });

        // Configuramos un listener para el evento 'error', que se dispara si hay algún error con la conexión
        this.socket.on('error', (error) => {
            console.error('Error de Socket:', error);
        });
    }

    // Método para unirse a una sala de edición (basada en un `proyectoId`)
    public joinEditorRoom(proyectoId: number): void {
        // Enviamos un evento al servidor para unirse a una sala de WebSocket relacionada con un proyecto
        this.socket.emit('joinEditor', { proyectoId });
    }

    // Método para abandonar una sala de edición (basada en un `proyectoId`)
    public leaveEditorRoom(proyectoId: number): void {
        // Enviamos un evento al servidor para salir de la sala de edición del proyecto
        this.socket.emit('leaveEditor', { proyectoId });
    }

    // Método para emitir actualizaciones del diagrama (enviar datos a los demás clientes)
    public emitDiagramUpdate(data: any): void {
        // Emitimos un evento 'diagramUpdate' al servidor con los datos del diagrama actualizados
        this.socket.emit('diagramUpdate', data);
    }

    // Método para escuchar las actualizaciones del diagrama y ejecutar un callback cuando ocurren
    public onDiagramUpdate(callback: (data: any) => void): void {
        // Configuramos un listener para el evento 'diagramUpdate' que recibirá los datos cuando el servidor lo emita
        this.socket.on('diagramUpdate', callback);
    }

    // Método para desconectar el cliente del servidor WebSocket
    public disconnect(): void {
        // Llamamos al método `disconnect` de la instancia de `socket` para cerrar la conexión WebSocket
        this.socket.disconnect();
    }
}
