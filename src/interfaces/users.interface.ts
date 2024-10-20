export interface NewUser {
  empresa: string;
  area: string;
  rol: string;
  nombre: string;
  correo: string;
  contraseña: string;
}

export interface UserData {
  id_usuario: string;
  id_area: string;
  id_empresa: string;
  nombre: string;
  correo: string;
  rol: string;
  contraseña: string;
  activo: boolean;
  rolEntity: {
    id_rol: string;
    rol: string;
  };
}
