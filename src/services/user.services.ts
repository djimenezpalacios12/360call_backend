import { logger } from "../config/loggersApp.config";
import { dataBaseConfig } from "../database/postgresql.database";
import { RolesEntity } from "../entities/roles.entity";

// ...
export const searchRol = async (id_rol: string) => {
  try {
    const rolData = await dataBaseConfig
      .getRepository(RolesEntity)
      .createQueryBuilder()
      .where("RolesEntity.id_rol = :id_rol", { id_rol: id_rol })
      .select(["RolesEntity.rol"])
      .getOne();

    return rolData;
  } catch (err: any) {
    logger.error({ err });
    return null;
  }
};
