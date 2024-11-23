import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { UsuariosEntity } from "./usuarios.entity";

@Entity("roles")
export class RolesEntity {
  @PrimaryColumn()
  id_rol: string;

  @Column()
  rol: string;

  @OneToMany(() => UsuariosEntity, (usuario) => usuario.rol)
  usuarios: UsuariosEntity[];
}
