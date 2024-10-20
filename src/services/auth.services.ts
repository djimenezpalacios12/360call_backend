import { logger } from "../config/loggersApp.config";
import { dataBaseConfig } from "../database/postgresql.database";
import { UsuariosEntity } from "../entities/usuarios.entity";
import { SignIn } from "../interfaces/auth.interface";

export const retrieveUser = async (signIn: SignIn) => {
  try {
    const usuarioEntity = await dataBaseConfig
      .getRepository(UsuariosEntity)
      .createQueryBuilder()
      .where("UsuariosEntity.correo = :correo", {
        correo: signIn.correo,
      })
      .andWhere("UsuariosEntity.activo = :activo", { activo: true })
      .getOne();

    return usuarioEntity;
  } catch (err: any) {
    logger.error({ err: err.message });
    return null;
  }
};
