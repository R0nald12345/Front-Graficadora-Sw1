import { useCallback, useEffect, useState } from "react";
import { EditorSocketService } from "../EditorSocketService";
import { ShapeAttributes } from "../../modules/editor/types/ShapeAttributes";

export const useEditor = (proyectoId: number) => {
 // Instancia del servicio de sockets
 const socketService = EditorSocketService.getInstance();
    
 // Estado local para controlar la sincronización
 const [isSyncing, setIsSyncing] = useState(false);

 // Efecto para manejar la conexión/desconexión
 useEffect(() => {
     // Unirse a la sala al montar el componente
     socketService.joinEditorRoom(proyectoId);

     // Manejador para cuando el usuario cierra la ventana
     const handleBeforeUnload = () => {
         socketService.disconnect();
     };

     window.addEventListener('beforeunload', handleBeforeUnload);

     // Limpieza al desmontar
     return () => {
         window.removeEventListener('beforeunload', handleBeforeUnload);
         socketService.disconnect();
     };
 }, [proyectoId]);

 // Método para emitir actualizaciones del canvas
 const emitCanvasUpdate = useCallback((shapes: ShapeAttributes[]) => {
     if (!isSyncing) {
         socketService.emitCanvasUpdate({
             proyectoId,
             shapes: shapes.map(shape => shape.toJSON())
         });
     }
 }, [proyectoId, isSyncing]);

 // Método para escuchar actualizaciones
 const subscribeToUpdates = useCallback((callback: (shapes: ShapeAttributes[]) => void) => {
     const handleUpdate = (data: any) => {
         if (data.proyectoId === proyectoId) {
             setIsSyncing(true);
             const newShapes = data.shapes.map((shapeData: any) => 
                 ShapeAttributes.fromJSON(shapeData)
             );
             callback(newShapes);
             setIsSyncing(false);
         }
     };

     socketService.onCanvasUpdated(handleUpdate);

     // Retornamos función de limpieza
     return () => {
         const socket = socketService.getSocketInstance();
         if (socket) {
             socket.off('canvasUpdated', handleUpdate);
         }
     };
 }, [proyectoId]);

 return {
     emitCanvasUpdate,
     subscribeToUpdates,
     isSyncing
 };
};