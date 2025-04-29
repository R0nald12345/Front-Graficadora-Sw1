// Importación corregida
import io, { Socket } from 'socket.io-client';
import { ShapeAttributes } from '../modules/editor/types/ShapeAttributes';


// Definimos una clase `EditorSocketService` para manejar las conexiones y eventos de WebSocket
export class EditorSocketService {
    private static instance: EditorSocketService;
    private socket: Socket | null = null;

    private constructor() { }

    public static getInstance(): EditorSocketService {
        if (!EditorSocketService.instance) {
            EditorSocketService.instance = new EditorSocketService();
        }
        return EditorSocketService.instance;
    }

    private getSocket(): Socket {
        if (!this.socket || !this.socket.connected) {
            if (this.socket) {
                this.socket.close();
            }
            this.socket = io('http://localhost:3000', {
                transports: ['websocket'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                autoConnect: true
            });
            // No llamar a setupListeners aquí
            this.initializeSocketListeners(); // Cambiar nombre y lógica
        }
        return this.socket;
    }

    private initializeSocketListeners(): void {
        if (!this.socket) return; // Prevenir llamadas si no hay socket

        this.socket.on('connect', () => {
            console.log('Conectado al servidor WebSocket', this.socket?.id);
        });

        this.socket.on('disconnect', (reason) => {
            console.log('Desconectado del servidor WebSocket', reason);
            this.socket = null;
        });

        this.socket.on('error', (error) => {
            console.error('Error en la conexión:', error);
            this.socket = null;
        });
    }


    // Métodos públicos para el manejo de la sala y eventos
    public joinEditorRoom(proyectoId: number): void {
        this.getSocket().emit('joinEditor', { proyectoId });
    }

    public emitDiagramUpdate(data: any): void {
        this.getSocket().emit('diagramUpdate', data);
    }

    public onDiagramUpdate(callback: (data: any) => void): void {
        this.getSocket().on('diagramUpdate', callback);
    }

    public getSocketInstance(): Socket | null {
        return this.socket;
    }

    public disconnect(): void {
        if (this.socket && this.socket.connected) {
            console.log('Desconectando socket:', this.socket.id);
            this.socket.disconnect();
            this.socket = null;
        }
    }

     // Método para emitir actualizaciones del canvas
     public emitCanvasUpdate(data: any): void {
        const socket = this.getSocket();
        socket.emit('canvasUpdate', data);
    }

    // Método para escuchar actualizaciones del canvas
    public onCanvasUpdated(callback: (data: any) => void): void {
        const socket = this.getSocket();
        socket.on('canvasUpdated', callback);
    }

    public emitShapeModified(data: { 
        proyectoId: number, 
        shapeId: string, 
        changes: Partial<ShapeAttributes> 
      }) {
        this.getSocket().emit('shapeModified', data);
      }
    
      public onShapeModified(callback: (data: any) => void) {
        this.getSocket().on('shapeModified', callback);
      }
    
      public emitShapeDeleted(data: { 
        proyectoId: number, 
        shapeId: string 
      }) {
        this.getSocket().emit('shapeDeleted', data);
      }
    
      public onShapeDeleted(callback: (data: any) => void) {
        this.getSocket().on('shapeDeleted', callback);
      }

}

