
import axios from 'axios';
import { CreateProjectRequest, CreateProjectResponse, deleteProjectByIdUsuario, deleteProjectResponse, EditProjectRequest, getIdProyecto, getProjectByIdUsuario, getProjectByIdUsuarioInvitateRequest, Proyecto } from '../types/proyecto.types';

const API_URL = import.meta.env.VITE_API_URL;

export const proyectoService = {

    // Crear proyecto
    async createProyecto(data: CreateProjectRequest, token: string): Promise<CreateProjectResponse> {
        try {
            const response = await axios.post<CreateProjectResponse>(
                `${API_URL}/proyecto`,
                {
                    nombre: data.nombre,
                    descripcion: data.descripcion,
                    usuarioId: data.usuarioId
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error en createProyecto:', error);
            throw error;
        }
    },

    async getIdProyecto(data: getIdProyecto): Promise<Proyecto> {
        try {
            const response = await axios.get<Proyecto>(
                `${API_URL}/proyecto/${data.id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${data.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error en getIdProyecto:', error);
            throw error;
        }
    },


    async getProyectosByIdUsuario(data: getProjectByIdUsuario): Promise<Proyecto[]> {
        try {
            // console.log('data', data);
            const response = await axios.get<Proyecto[]>(
                `${API_URL}/proyecto/mis-proyectos/admin`,
                {
                    params: { id: data.id }, // Aquí van los parámetros de la URL
                    headers: {
                        'Authorization': `Bearer ${data.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error en getProyectosByIdUsuario:', error);
            throw error;
        }
    },


    async deleteProyectoByIdUsuario(data: deleteProjectByIdUsuario): Promise<deleteProjectResponse> {
        try {
            // console.log('data', data);
            const response = await axios.delete<deleteProjectResponse>(
                `${API_URL}/proyecto/${data.id}`,
                {
                    params: {
                        id: data.id,
                        usuarioId: data.usuarioId

                    }, // Aquí van los parámetros de la URL
                    headers: {
                        'Authorization': `Bearer ${data.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error en deleteProyectoByIdUsuario:', error);
            throw error;
        }
    },


    async updateProyectoByIdUsuario(data: EditProjectRequest): Promise<Proyecto> {
        try {
            // console.log('data', data);
            const response = await axios.patch<Proyecto>(
                `${API_URL}/proyecto/${data.id}`,
                {
                    nombre: data.nombre,
                    descripcion: data.descripcion,
                    usuarioId: data.usuarioId
                },
                {
                    headers: {
                        'Authorization': `Bearer ${data.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error en updateProyectoByIdUsuario:', error);
            throw error;
        }
    },


    async getProyectoByIdUsuarioForInvitate(data: getProjectByIdUsuarioInvitateRequest): Promise<Proyecto[]> {
        try {
            const response = await axios.get<Proyecto[]>(
                `${API_URL}/proyecto/mis-proyectos/invitado`, {
                params: {
                    id: data.id,
                },

                headers: {
                    'Authorization': `Bearer ${data.token}`,
                    'Content-Type': 'application/json'
                }
            }
            );
            return response.data;
        } catch (error) {
            console.error('Error en getProyectoByIdUsuarioForInvitate:', error);
            throw error;
        }
    }


};