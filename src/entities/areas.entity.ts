import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { EmpresaEntity } from "./empresa.entity";

@Entity("areas")
export class AreaEntity {
  @PrimaryColumn()
  id_area: string;

  @Column()
  id_empresa: string;

  @Column()
  nombre_area: string;

  @Column()
  asistente: string;

  @Column()
  vectores: string;

  @ManyToOne(() => EmpresaEntity, (empresaEntity) => empresaEntity.areas)
  @JoinColumn({ name: "id_empresa" }) // FK
  empresa: EmpresaEntity;
}
