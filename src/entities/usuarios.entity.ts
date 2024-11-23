import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { RolesEntity } from "./roles.entity";

@Entity("usuarios")
export class UsuariosEntity {
  @PrimaryColumn()
  id_usuario: string;

  @Column()
  id_area: string;

  @Column()
  id_empresa: string;

  @Column()
  nombre: string;

  @Column()
  correo: string;

  @Column()
  rol: string;

  @ManyToOne(() => RolesEntity, (rol) => rol.id_rol)
  @JoinColumn({ name: "rol" })
  rolEntity: RolesEntity;

  @Column()
  contraseña: string;

  @Column()
  activo: boolean;
}
