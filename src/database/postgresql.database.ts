import { DataSource } from "typeorm";

import { LoggerQuery } from "../config/loggerSql.config";
import { UsuariosEntity } from "../entities/usuarios.entity";
import { RolesEntity } from "../entities/roles.entity";
import { AreaEntity } from "../entities/areas.entity";
import { EmpresaEntity } from "../entities/empresa.entity";

export const dataBaseConfig = new DataSource({
  host: process.env.POSTGRES_HOST,
  port: +`${process.env.POSTGRES_PORT} `,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  type: "postgres",
  entities: [UsuariosEntity, RolesEntity, AreaEntity, EmpresaEntity],
  logging: true,
  logger: new LoggerQuery(),
  // sslmode: require,
});
