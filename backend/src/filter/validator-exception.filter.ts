import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { NormalException } from '@/exception/normal.exception';
import { ValidationError } from 'class-validator';

// Re-format error response of class-validator
@Catch(ValidationError)
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationExceptionFilter.name);

  catch(exception: ValidationError, host: ArgumentsHost) {
    this.logger.error(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    response
      .status(422)
      .send(
        NormalException.VALIDATION_ISSUE(
          Object.values(exception.constraints)[0]
        ).toJSON()
      ); // Unprocessable Entity
  }
}
