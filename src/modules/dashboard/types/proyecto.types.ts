export interface CreateProjectRequest {
    nombre: string;
    descripcion: string;
    usuarioId: number;
}

export interface CreateProjectResponse {
    id: number;
    nombre: string;
    descripcion: string;
}





export interface Usuario {
    id: number;
    email: string;
    password: string;
    nombre: string;
  }
  
  export interface UsuarioProyecto {
    id: number;
    rol: string;
    usuario: Usuario;
  }
  
  export interface Proyecto {
    id: number;
    nombre: string;
    descripcion: string | null;
    usuarioProyectos: UsuarioProyecto[];
  }
  
  export interface getProjectByIdUsuario {
    id: number;
    token: string;
  }



  
  //para eliminar un proyecto
    export interface deleteProjectByIdUsuario {
        id: number;
        usuarioId: number;
        token: string;
    }

    export interface deleteProjectResponse {
        message: string;
    }


    //para editar un proyecto
    export interface EditProjectRequest {
        id: number;
        nombre: string;
        descripcion: string;
        usuarioId: number;
        token: string;
    }

    export interface getIdProyecto {
        id: number;
        token: string;
    }


    export interface getProjectByIdUsuarioInvitateRequest {
        id: number;
        token: string;
    }
