export interface SignIn {
  correo: string;
  contraseña: string;
}

export interface tokenPayload {
  _id: string;
  correo: string;
  rol: string;
  nombre: string;
  id_usuario: string;
  iat: number;
  exp: number;
}
