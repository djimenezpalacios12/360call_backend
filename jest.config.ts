import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest", // Interprete para jest de TS
  testEnvironment: "node", // Evitar problemas de reconocimientos del entorno
  verbose: true, //Permite decir como quiero resolver la visibilidad de los test, feedback de los test en la terminal
  coverageDirectory: "coverage", // nombre de un directorio (reporte de los test)
  collectCoverage: true, // Permite decir si quiero habilutar el recopilador de cobertura (busca el resultdo de los resportes e interpretar, retorna analisis)
  testPathIgnorePatterns: ["/node_modules/"], //decirle que queremos ignorar como directorios
  transform: {
    "^.+\\.ts?$": "ts-jest",
  }, // Ayuda a definir una expresion regular de TS
  testMatch: ["<rootDir>/src/test/*.ts"],
  collectCoverageFrom: [
    "src/controllers/*.ts",
    "!src/**/test/*.ts?(x)",
    "!**/node_modules/**",
  ], // Especifcar las definiciones de reportes generado final
  coverageThreshold: {
    global: {
      branches: 1,
      functions: 1,
      lines: 0, // Revisar linea por linea codigo testeado
      statements: 1, // asignaciones, ejecuciones de codigo, I/O, llamadas, etc...
    },
  }, // arbol de caracteristicas globales, como parte del test
  //   coverageReporters: ["text-summary", "lcov"], // Generar resumen en el codigo de cobertura del coverage
  moduleNameMapper: {
    "@config(.*)/": ["<rootDir>/src/config/$1"], //$1: todos los recursos
    "@controllers(.*)/": ["<rootDir>/src/controllers/$1"],
    "@database(.*)/": ["<rootDir>/src/database/$1"],
    "@interfaces(.*)/": ["<rootDir>/src/interfaces/$1"],
    "@middlware(.*)/": ["<rootDir>/src/middlware/$1"],
    "@routes(.*)/": ["<rootDir>/src/routes/$1"],
    "@utils(.*)/": ["<rootDir>/src/utils/$1"],
    "@root(.*)/": ["<rootDir>/src/$1"],
  },
};

export default config;
