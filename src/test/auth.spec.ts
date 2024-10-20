import express from "express";
import request from "supertest";

import { signIn } from "../controllers/auth.controller";
import { retrieveUser } from "../services/auth.services";

const app = express();
app.use(express.json());
app.post("/v1/api/auth/", signIn);

// Configurar variables de entorno para los tests.
process.env.JWT_EXP = "86400"; // Ejemplo de 24 horas en segundos
process.env.JWT_SECRET = "some_secret_key";

// Mocks de funciones necesarias
jest.mock("../services/auth.services", () => ({
  retrieveUser: jest.fn(),
}));

jest.mock("../config/loggersApp.config", () => ({
  logger: {
    error: jest.fn(),
  },
}));

// signIn.controller
describe("Authentication Controller", () => {
  // Limpiar los mocks antes de cada test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should respond successfully auth.", async () => {
    // Configurar el mock de getUserData para devolver datos de usuario válidos
    (retrieveUser as jest.Mock).mockResolvedValue({
      id_usuario: "id_usuario",
      id_area: "id_area",
      id_empresa: "id_empresa",
      nombre: "nombre",
      correo: "correo@correo.cl",
      rol: "idAdmin",
      contraseña: "$2b$10$/8KAts2dxkLgolHJa.YyDuYl.Sho0s3x.7AqD34xxEYuosdIci",
    });

    // Realizar la petición
    const response = await request(app).post("/v1/api/auth/").send({
      correo: "correo@correo.cl",
      contraseña: "contraseña123",
    });

    // Verificar el resultado
    expect(response.status).toBe(200);
  });
});
