import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity("usuarios")
export class UsuariosEntity {
  @PrimaryColumn()
  id_usuario: string;

  @Column()
  nombre: string;

  @Column()
  correo: string;

  @Column()
  contraseña: string;

  @Column()
  rol: string;

  @Column()
  activo: boolean;
}
