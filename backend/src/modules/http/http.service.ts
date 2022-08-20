import { HttpResponse } from '@/shared/interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { NormalException } from '@/exception/normal.exception';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

const ECONNREFUSED = 'ECONNREFUSED';
@Injectable()
export class HttpService {
  private readonly instance: AxiosInstance;

  private readonly logger = new Logger(HttpService.name);

  constructor() {
    this.instance = axios.create({
      timeout: 5000,
    });

    this.instance.interceptors.request.use(
      // Do something before request is sent
      (config: AxiosRequestConfig) => {
        return config;
      },
      // Do something with request error
      (error: AxiosError) => {
        this.logger.error(error.response.data);
        return Promise.resolve(error);
      }
    );

    this.instance.interceptors.response.use(
      // Any status code that lie within the range of 2xx cause this function to trigger
      (response: AxiosResponse) => {
        this.logger.debug(response.data);
        return response;
      },
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      (error: AxiosError) => {
        if (error.code === ECONNREFUSED) {
          throw NormalException.HTTP_REQUEST_TIMEOUT();
        }
        this.logger.error(error.response.data);
        return error.response;
      }
    );
  }

  getInstance() {
    return this.instance;
  }

  async get<T = any, C = any>(
    url: string,
    config?: AxiosRequestConfig<C>
  ): Promise<T> {
    return (await this.instance.get(url, config)).data;
  }

  /**
   * Get from microservice (internal use)
   *
   * Since for all microservices we have sync the response format (Google Style Guide), this is a wrapper to
   * auto check the error (throw exception if contains error) or extract data in the response
   */
  async getFromMS<T = any, C = any>(
    url: string,
    config?: AxiosRequestConfig<C>
  ): Promise<T> {
    const response = await this.get<HttpResponse<T>, C>(url, config);

    if (response?.error) {
      throw NormalException.DEPENDENT_SERVICE_ISSUE(response.error?.message);
    }
    return response.data;
  }

  async head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return (await this.instance.head(url, config)).data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return (await this.instance.delete(url, config)).data;
  }

  async options<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return (await this.instance.options(url, config)).data;
  }

  async post<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return (await this.instance.post(url, data, config)).data;
  }

  /**
   * Post to microservice (internal use)
   *
   * Since for all microservices we have sync the response format (Google Style Guide), this is a wrapper to
   * auto check the error (throw exception if contains error) or extract data in the response
   */
  async postToMS<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.post<HttpResponse<T>, D>(url, data, config);

    if (response?.error) {
      throw NormalException.DEPENDENT_SERVICE_ISSUE(response.error?.message);
    }
    return response.data;
  }

  async put<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return (await this.instance.put(url, data, config)).data;
  }

  async patch<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return (await this.instance.patch(url, data, config)).data;
  }
}
