import express from "express";
import request from "supertest";

import {
  retrieveUsers,
  newUserService,
  editUserServices,
} from "../services/users.services";
import { getUsers, newUser, editUser } from "../controllers/users.controller";

const app = express();
app.use(express.json());
app.get("/v1/api/users/", getUsers);
app.post("/v1/api/users/new", newUser);
app.post("/v1/api/users/user/id/:id/edit", editUser);

// Configurar variables de entorno para los tests.
process.env.JWT_EXP = "86400"; // Ejemplo de 24 horas en segundos
process.env.JWT_SECRET = "some_secret_key";

// Mocks de funciones necesarias
jest.mock("../services/users.services", () => ({
  retrieveUsers: jest.fn(),
  newUserService: jest.fn(),
  editUserServices: jest.fn(),
}));

jest.mock("../config/loggersApp.config", () => ({
  logger: {
    error: jest.fn(),
  },
}));

// getUsers.controller
describe("should respond successfully with users list", () => {
  // Limpiar los mocks antes de cada test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should respond with 200", async () => {
    // Configurar el mock de getUserData para devolver datos de usuario válidos
    (retrieveUsers as jest.Mock).mockResolvedValue([
      {
        id_usuario: "e2c7564c8-4ee347-4232-abb9-4f2a23T7b1f5",
        id_area: "id_area",
        id_empresa: "id_empresa",
        nombre: "nombre",
        correo: "correo",
        rol: "rol",
        contraseña: "$2b$10$tasdfa4g3tqT9L17Xb.asd.0rSTTrAUaG0asda8F7S",
        activo: true,
        rolEntity: {
          id_rol: "id_rol",
          rol: "rol",
        },
      },
    ]);

    // Realizar la petición
    const response = await request(app).get("/v1/api/users/");

    // Verificar el resultado
    expect(response.status).toBe(200);
  });
});

// newUser.controller
describe("should respond successfully insert new user", () => {
  // Limpiar los mocks antes de cada test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should respond with 200", async () => {
    // Configurar el mock de newUserService para devolver la respuesta de guardado de typeORM
    (newUserService as jest.Mock).mockResolvedValue([
      { id_usuario: "42d0c8eb-16a1-449e-9a68-cbf8a816ec93" },
    ]);

    // Realizar la petición
    const response = await request(app).post("/v1/api/users/new").send({
      empresa: "empresa",
      area: "area",
      rol: "rol",
      nombre: "nombre",
      correo: "correo",
      contraseña: "contraseña",
    });

    // Verificar el resultado
    expect(response.status).toBe(200);
  });
});

// editUser.controller
describe("should respond successfully when update user's data", () => {
  // Limpiar los mocks antes de cada test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should respond with 200", async () => {
    // Configurar el mock de editUserServices para devolver la respuesta de guardado de typeORM
    (editUserServices as jest.Mock).mockResolvedValue("Usuario actualizado");

    // Realizar la petición
    const response = await request(app)
      .post("/v1/api/users/user/id/f1casda69-4f2e-2b23-a006d/edit")
      .send({
        id_usuario: "f1casda69-4f2e-2b23-a006d",
        id_area: "id area",
        id_empresa: "id empresa",
        nombre: "nombre",
        correo: "correo@correo.cl",
        rol: "id rol",
        contraseña: "$2b$10$/hfasmOasd.CzZq3eWxpUasdasd22fBaddasdl0cb2A9Ppim",
        activo: true,
        rolEntity: {
          id_rol: "id rol",
          rol: "administrador",
        },
      });

    // Verificar el resultado
    expect(response.status).toBe(200);
  });
});
