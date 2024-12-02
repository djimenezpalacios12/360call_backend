import { AreaEntity } from "src/entities/areas.entity";
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

export const userCredentialsAi = async (id_usuario: string) => {
  try {
    const userCredentials = await dataBaseConfig
      .getRepository(AreaEntity)
      .createQueryBuilder()
      .leftJoinAndSelect(UsuariosEntity, "UsuariosEntity", "UsuariosEntity.id_area = AreaEntity.id_area")
      .where("UsuariosEntity.id_usuario = :id_usuario", {
        id_usuario: id_usuario,
      })
      //   .where("RolesEntity.id_rol = :id_rol", { id_rol: id_rol })
      //   .select(["RolesEntity.rol"])
      .getOne();

    return userCredentials;
  } catch (err: any) {
    logger.error({ err });
    return null;
  }
};
