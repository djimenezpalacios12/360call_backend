require("dotenv").config();

import express from "express";
import morgan from "morgan";
import cors from "cors";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import createError from "http-errors";

import { endpointResponse } from "./utils/endpointResponse.utils";
import { logger } from "./config/loggersApp.config";
import { dataBaseConfig } from "./database/postgresql.database";

import authRoutes from "./routes/auth.route";
import iaRoutes from "./routes/ia.route";

// Express
const app = express();

// * TypeORM
dataBaseConfig.initialize().then((connection) => {
  logger.info(`Connected to database: ${connection.options.database}`);
});

// Middlewares
app.use(
  morgan("dev", {
    skip: function (req, res) {
      return res.statusCode < 400;
    },
  })
);
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

// Return response from API in winston
app.use((req, res, next) => {
  logger.info(req.method + " " + req.url + " " + res.statusCode);
  next();
});

//Swagger
const swaggerOptions: any = {
  swaggerDefinition: {
    openapi: "3.0.1",
    info: {
      version: "1.0.0",
      title: "Microservice API",
      description: "IA Microservices",
      contact: {
        name: "Alaya",
      },
      servers: [`http://localhost:${process.env.PORT}`],
    },
    tags: {
      name: [],
    },
    components: {
      securitySchemes: {
        jwt: {
          type: "http",
          scheme: "bearer",
          in: "header",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        jwt: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//Routes Middlware
app.use(express.json());
app.get("/", (req: any, res: any) => {
  res.status(200).json({ message: "Bienvenido..." });
});
app.use("/v1/api/auth", authRoutes);
app.use("/v1/api/ia", iaRoutes);

// Error handler - catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err: any, req: any, res: any, next: any) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  // render the error page
  res.status(err.status || 500);
  if (req.originalUrl.startsWith("/v1/api/")) {
    // receive API error
    logger.error({ err });
    res.send(endpointResponse(new Date(), err.message, err.status, err || null));
    return;
  }
  res.json({ error: err.message });
  return;
});

// Port
const port = process.env.PORT || 8000;

// Listen Port
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

export default app;
