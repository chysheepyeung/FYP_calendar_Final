import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { I18nService } from 'nestjs-i18n';
import { NormalException } from '@/exception/normal.exception';

@Catch(NormalException)
export class NormalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(NormalExceptionFilter.name);

  constructor(private readonly i18n: I18nService) {}

  async catch(exception: NormalException, host: ArgumentsHost) {
    this.logger.error(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    let { message } = exception.getResponse();
    if (exception.getResponse().isTranslateKey && message) {
      message = await this.i18n.translate(exception.getResponse().message, {
        lang: ctx.getRequest().i18nLang,
      });
    }

    // Remarks: handle Fastify Promise Error (if translation needed)
    // https://www.fastify.io/docs/latest/Reply/#async-await-and-promises
    // https://github.com/fastify/point-of-view/issues/82
    response.status(400).send(exception.toJSON()); // Bad Request
  }
}
