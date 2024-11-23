import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { AreaEntity } from "./areas.entity";

@Entity("empresa")
export class EmpresaEntity {
  @PrimaryColumn()
  id_empresa: string;

  @Column()
  nombre_empresa: string;

  @OneToMany(() => AreaEntity, (areaEntity) => areaEntity.empresa)
  areas: AreaEntity[];
}
