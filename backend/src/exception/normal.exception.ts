import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpFailResponse } from '@/shared/interfaces';

interface NormalExceptionReponse {
  message: string;
  code: number;
  isTranslateKey: boolean;
}

export class NormalException extends HttpException {
  constructor(message: string, code: number, isTranslateKey = false) {
    super({ message, code, isTranslateKey }, HttpStatus.BAD_REQUEST);
  }

  static REQUEST_BODY_CANNOT_PARSE = () => {
    return new NormalException('donation.request_body_cannot_parse', 10001);
  };

  static HTTP_REQUEST_TIMEOUT = () => {
    return new NormalException('donation.http_request_timeout', 10002);
  };

  static DATABASE_ISSUE = () => {
    return new NormalException('donation.database_issue', 10003);
  };

  static TOO_MANY_REQUEST = () => {
    return new NormalException('donation.too_many_request', 10004);
  };

  static UNEXPECTED = (msg?: string) => {
    return new NormalException(msg || 'donation.unexpected_error', 10005);
  };

  static VALIDATION_ISSUE = (msg?: string) => {
    return new NormalException(msg || 'donation.validation_issue', 10006);
  };

  static DEPENDENT_SERVICE_ISSUE = (msg?: string) => {
    return new NormalException(
      msg || 'donation.dependent_service_issue',
      10007
    );
  };

  static FRAMEWORK_ISSUE = (msg?: string) => {
    return new NormalException(msg || 'donation.framework_issue', 10008);
  };

  toJSON(): HttpFailResponse {
    const response = <NormalExceptionReponse>this.getResponse();
    return {
      error: {
        message: response.message,
        code: response.code,
      },
    };
  }

  // @Override
  getResponse(): NormalExceptionReponse {
    return <NormalExceptionReponse>super.getResponse();
  }
}
