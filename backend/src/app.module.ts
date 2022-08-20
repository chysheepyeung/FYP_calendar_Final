import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import {
  AllExceptionFilter,
  NormalExceptionFilter,
  TypeORMExceptionFilter,
  ValidationExceptionFilter,
} from './filter/_index';
import { AppConfig } from '@/app.config';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './modules/events/events.module';
import { GroupsModule } from './modules/groups/groups.module';
import { I18nModule } from 'nestjs-i18n';
import { InvitesModule } from './modules/invites/invites.module';
import { LoggerModule } from 'nestjs-pino';
import { Module, ValidationError, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './interceptor/response.interceptor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { VotesModule } from './modules/votes/votes.module';

@Module({
  imports: [
    // Allow to access .env file and validate env variable
    ConfigModule.forRoot(AppConfig.getInitConifg()),
    // Logger framework that better then NestJS default logger
    LoggerModule.forRoot(AppConfig.getLoggerConfig()),
    // Internationalization and localization
    I18nModule.forRoot(AppConfig.getI18nConfig()),
    // Database
    TypeOrmModule.forRootAsync(AppConfig.getTypeOrmConfig()),
    // App
    // DonationModule,
    UsersModule,
    GroupsModule,
    EventsModule,
    InvitesModule,
    VotesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    { provide: APP_FILTER, useClass: NormalExceptionFilter },
    { provide: APP_FILTER, useClass: TypeORMExceptionFilter },
    { provide: APP_FILTER, useClass: ValidationExceptionFilter },
    {
      // Allowing to do validation through DTO
      // Since class-validator library default throw BadRequestException, here we use exceptionFactory to throw
      // their internal exception so that filter can recognize it (just like throttler and typeorm)
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          exceptionFactory: (errors: ValidationError[]) => {
            return errors[0];
          },
        }),
    },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule {}
