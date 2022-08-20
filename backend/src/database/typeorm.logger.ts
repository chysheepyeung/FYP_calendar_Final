// https://github.com/jtmthf/nestjs-pino-logger/issues/2#issuecomment-902947243

import { Logger, QueryRunner } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';

const normalizeQuery = (query: string) => {
  return query.replace(/\s\s+/g, ' ').trim();
};

// This class is a wrapper that allows Pino logger interface to be used as TypeORM logger interface
export class PinoTypeORMLogger implements Logger {
  constructor(private readonly logger: PinoLogger) {}

  logQuery(query: string, parameters?: Array<any>, _queryRunner?: QueryRunner) {
    this.logger.debug(
      { query: normalizeQuery(query), parameters },
      'SQL Query'
    );
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: Array<any>,
    _queryRunner?: QueryRunner
  ) {
    this.logger.error(
      { query: normalizeQuery(query), parameters, error },
      'Failed SQL Query'
    );
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: Array<any>,
    _queryRunner?: QueryRunner
  ) {
    this.logger.warn(
      { query: normalizeQuery(query), parameters, time },
      'Slow SQL Query'
    );
  }

  logSchemaBuild(message: string, _queryRunner?: QueryRunner) {
    this.logger.debug(message);
  }

  logMigration(message: string, _queryRunner?: QueryRunner) {
    this.logger.debug(message);
  }

  log(
    level: 'log' | 'info' | 'warn',
    message: any,
    _queryRunner?: QueryRunner
  ) {
    switch (level) {
      case 'log':
      case 'info':
        this.logger.info(message);
        break;
      case 'warn':
        this.logger.warn(message);
        break;
      default:
    }
  }
}
