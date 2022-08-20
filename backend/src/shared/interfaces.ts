import { Either } from './types';

export interface HttpSuccessData<T = any> {
  readonly items: Array<T>;
  readonly totalItems?: number;
  readonly itemsPerPage?: number;
  readonly pageIndex?: number;
}

export interface HttpSuccessResponse<T> {
  readonly data: T;
}

export interface HttpFailResponse {
  readonly error: {
    readonly message: string;
    readonly code: number;
  };
}

// https://stackoverflow.com/a/66605669/11440474
export type HttpResponse<T> = Either<HttpSuccessResponse<T>, HttpFailResponse>;

export interface GetPaymentLinkParam {
  readonly orderId: string;
  readonly amount: number;
  readonly serviceName: string;
  readonly paymentItem: string;
}

export interface GetPaymentLinkResponse {
  readonly paymentURL: string;
}

export interface GetPaymentRecordQuery {
  from: string;
  to: string;
  fields: string;
  serviceName: string;
  itemsPerPage: number;
}

export interface GetPaymentRecordResponse {
  readonly id: string;
  readonly orderId: string;
  readonly paymentMethod: string;
}

export interface MailPayload {
  readonly name: string;
  readonly lang: string;
  readonly address: string;
  readonly payload: unknown;
}
