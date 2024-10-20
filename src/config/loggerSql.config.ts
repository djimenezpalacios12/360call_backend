import { Logger, QueryRunner } from "typeorm";
import { logger } from "./loggersApp.config";

export class LoggerQuery implements Logger {
  private readonly customFormat: any;

  constructor() {}

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    const requestUrl =
      queryRunner && queryRunner.data["request"]
        ? "(" + queryRunner.data["request"].url + ") "
        : "";
    logger.info(requestUrl + "executing query: " + query);
  }

  logQueryError(
    err: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ) {
    const requestUrl =
      queryRunner && queryRunner.data["request"]
        ? "(" + queryRunner.data["request"].url + ") "
        : "";
    logger.error(requestUrl + "[ERROR] query: " + query);
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ) {
    throw new Error("Method not implemented.");
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    throw new Error("Method not implemented.");
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    throw new Error("Method not implemented.");
  }

  log(level: "log" | "info" | "warn", message: any, queryRunner?: QueryRunner) {
    throw new Error("Method not implemented.");
  }
}
