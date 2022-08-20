import * as Joi from 'joi';
import * as path from 'path';
import { AppController } from './app.controller';
import { ConfigModuleOptions } from '@nestjs/config';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { HeaderResolver, I18nJsonParser, I18nOptions } from 'nestjs-i18n';
import { IncomingMessage, ServerResponse } from 'http';
import { NodeEnv } from '@share/enums/_index';
import { NormalException } from '@/exception/normal.exception';
import { Params, PinoLogger } from 'nestjs-pino';
import { PinoTypeORMLogger } from '@/database/typeorm.logger';
import { RequestMethod } from '@nestjs/common';
import {
  TypeOrmModule,
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

export class AppConfig {
  public static getFastifyInstance(): FastifyAdapter {
    const fastifyAdapter = new FastifyAdapter({ logger: false });

    // Since NestJS filter cannot catch JSON parse error in request body [Fastify layer catch this error]
    // but Fastify's error response format do not match our format here
    // so we have to do extra step here to sync error response format
    fastifyAdapter.setErrorHandler(
      (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
        reply.send(
          error instanceof SyntaxError
            ? NormalException.REQUEST_BODY_CANNOT_PARSE().toJSON()
            : NormalException.FRAMEWORK_ISSUE().toJSON()
        );
      }
    );
    return fastifyAdapter;
  }

  public static getInitConifg(): ConfigModuleOptions {
    const validNodeEnvList = Object.keys(NodeEnv).map((key) => NodeEnv[key]);
    const validLogLevelList = ['log', 'error', 'warn', 'debug', 'verbose'];
    const validDBTypeList = [
      'mysql',
      'mariadb',
      'postgres',
      'cockroachdb',
      'sqlite',
      'mssql',
      'sap',
      'oracle',
      'cordova',
      'nativescript',
      'react-native',
      'sqljs',
      'mongodb',
      'aurora-data-api',
      'aurora-data-api-pg',
      'expo',
      'better-sqlite3',
      'capacitor',
    ];

    return {
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().min(1).max(65535).required(),
        NODE_ENV: Joi.string()
          .valid(...validNodeEnvList)
          .required(),
        LOG_LEVEL: Joi.string()
          .allow('')
          .valid(...validLogLevelList)
          .optional(),
        BASE_PATH: Joi.string().allow('').optional(),
        ORDER_ID_IDENTIFIER: Joi.string().allow('').optional(),

        DB_TYPE: Joi.string()
          .valid(...validDBTypeList)
          .required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().min(1).max(65535).required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
      }),
    };
  }

  public static getLoggerConfig(): Params {
    const { NODE_ENV, LOG_LEVEL, BASE_PATH } = process.env;

    return {
      pinoHttp: {
        transport:
          NODE_ENV !== NodeEnv.PRODUCTION
            ? {
                target: 'pino-pretty',
                options: {
                  translateTime: 'yyyy-mm-dd HH:MM:ss',
                },
              }
            : null,
        autoLogging: true,
        level: LOG_LEVEL || NODE_ENV !== NodeEnv.PRODUCTION ? 'debug' : 'info',
        serializers: {
          req(request: IncomingMessage) {
            return {
              method: request.method,
              url: request.url,
              // Including the headers in the log could be in violation of privacy laws, e.g. GDPR.
              // headers: request.headers,
            };
          },
          res(reply: ServerResponse) {
            return {
              statusCode: reply.statusCode,
            };
          },
        },
        customAttributeKeys: {
          responseTime: 'timeSpent',
        },
        base: {}, // remove pid (should handle by fluentbit?) and hostname (not useful) logging
      },
      // since k8s will health check frequently, no need to logging this request
      exclude: [
        {
          method: RequestMethod.ALL,
          path: path
            .join(BASE_PATH || '/', AppController.prototype.health.name)
            .replace(/\\/g, '/'), // for windows machine
        },
      ],
    };
  }

  public static getI18nConfig(): I18nOptions {
    return {
      fallbackLanguage: 'zh-TW',
      parser: I18nJsonParser,
      parserOptions: {
        path: path.join(__dirname, 'i18n'),
        watch: true,
      },
      resolvers: [{ use: HeaderResolver, options: ['content-language'] }], // must be lower case
    };
  }

  public static getTypeOrmConfig(): TypeOrmModuleAsyncOptions {
    const entitiesDir = path.join('database', 'entities');
    const migrationsDir = path.join('database', 'migrations');
    const subscribersDir = path.join('database', 'subscribers');
    const {
      DB_TYPE,
      DB_HOST,
      DB_PORT,
      DB_USERNAME,
      DB_PASSWORD,
      DB_NAME,
      NODE_ENV,
    } = process.env;
    return {
      useFactory: (logger: PinoLogger): TypeOrmModuleOptions => {
        if (logger) logger.setContext(TypeOrmModule.name);
        return {
          type: DB_TYPE as any,
          host: DB_HOST,
          port: Number(DB_PORT),
          username: DB_USERNAME,
          password: DB_PASSWORD,
          database: DB_NAME,
          logger:
            logger && NODE_ENV === NodeEnv.LOCAL
              ? new PinoTypeORMLogger(logger)
              : null,
          synchronize: NODE_ENV === NodeEnv.LOCAL,
          entities: [path.join(__dirname, entitiesDir, '*.entity.{ts,js}')],
          migrations: [
            path.join(__dirname, migrationsDir, '*.migration.{ts,js}'),
          ],
          subscribers: [
            path.join(__dirname, subscribersDir, '*.subscriber.{ts,js}'),
          ],
          retryAttempts: Infinity,
          retryDelay: 10 * 1000,
          cli: {
            entitiesDir: path.join('src', entitiesDir),
            migrationsDir: path.join('src', migrationsDir),
            subscribersDir: path.join('src', subscribersDir),
          },
          extra: {
            // For SQL Server that has self signed certificate error, enable below setting
            // trustServerCertificate: true,
          },
        };
      },
      inject: [PinoLogger],
    };
  }
}
