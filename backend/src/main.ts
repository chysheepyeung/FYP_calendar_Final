import { AppConfig } from '@/app.config';
import { AppModule } from '@/app.module';
import { Logger, PinoLogger } from 'nestjs-pino';
import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { NodeEnv } from '@share/enums/nodeEnv';

(async () => {
  const { BASE_PATH, PORT, NODE_ENV } = process.env;

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    AppConfig.getFastifyInstance(),
    // this logger instance only for logging the app init message (e.g. InstanceLoader),
    // since before booting the app, LoggerModule is not loaded yet
    { logger: new Logger(new PinoLogger(AppConfig.getLoggerConfig()), {}) }
  );

  app.startAllMicroservices();

  app.enableVersioning();

  app.setGlobalPrefix(BASE_PATH);

  if (NODE_ENV !== NodeEnv.PRODUCTION) app.enableCors(); // for development purpose

  // By default, Fastify only listens localhost, so we should to specify '0.0.0.0'
  app.listen(PORT, '0.0.0.0');
})();
