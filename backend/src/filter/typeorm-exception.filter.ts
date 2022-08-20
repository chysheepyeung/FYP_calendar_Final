import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { EntityNotFoundError, QueryFailedError, TypeORMError } from 'typeorm';
import { FastifyReply } from 'fastify';
import { NormalException } from '@/exception/normal.exception';

// Re-format error response of typeorm
@Catch(QueryFailedError, EntityNotFoundError)
export class TypeORMExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(TypeORMExceptionFilter.name);

  catch(exception: TypeORMError, host: ArgumentsHost) {
    this.logger.error(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    response.status(500).send(NormalException.DATABASE_ISSUE().toJSON()); // Internal server error
  }
}
