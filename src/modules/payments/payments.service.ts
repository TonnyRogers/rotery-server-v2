import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

import { ProcessPaymentDto } from './dto/process-payment.dto';
import { paymentApiOptions } from '../../config';
import { CreatePaymentCustomerDto } from './dto/create-payment-client.dto';
import { UpdatePaymentCustomerDto } from './dto/update-payment-client.dto copy';
import {
  CreateCustomerResponse,
  PaymentDetailsReponse,
  PaymentRefundResponse,
  ProcessPaymentType,
} from '@/utils/types';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../../entities/user.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';
import { axiosErrorHandler } from '@/utils/axios-error';

const api = axios.create({
  baseURL: paymentApiOptions.url,
  headers: {
    Authorization: `Bearer ${paymentApiOptions.token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.response.use((response) => response, axiosErrorHandler);

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(User)
    private usersRepository: EntityRepository<User>,
  ) {}

  async createCustomer(
    authUserId: number,
    createUserDto: CreatePaymentCustomerDto,
  ) {
    try {
      const response: AxiosResponse<CreateCustomerResponse> = await api.post(
        '/customers',
        { ...createUserDto },
      );
      const user = await this.usersRepository.findOne({ id: authUserId });

      user.customerId = response.data.id;

      await this.usersRepository.flush();
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCustomer(id: string) {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateCustomer(
    id: string,
    updateCustomerDto: UpdatePaymentCustomerDto,
  ) {
    try {
      const response = await api.put(`/customers/${id}`, {
        ...updateCustomerDto,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async addCard(customerId: string, cardToken: string) {
    try {
      const response = await api.post(`/customers/${customerId}/cards`, {
        token: cardToken,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async removeCard(customerId: string, cardId: string) {
    try {
      const response = await api.delete(
        `/customers/${customerId}/cards/${cardId}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async pay(
    processPaymentDto: ProcessPaymentDto,
    paymentType: ProcessPaymentType,
  ): Promise<PaymentDetailsReponse> {
    try {
      if (paymentType === ProcessPaymentType.ITINERARY) {
        const response: AxiosResponse<PaymentDetailsReponse> = await api.post(
          `/payments`,
          {
            ...processPaymentDto,
            notification_url:
              'https://webhook.site/24b44434-b38c-4c77-9ba8-5a280d32b426?source_news=webhooks&validator=checkout',
            metadata: {
              ...processPaymentDto?.metadata,
              payment_validator: 'checkout',
            }
          },
        );

        return response.data;
      }
    } catch (error) {
      throw error;
    }
  }

  async refundPayment(paymentId: number, refundPaymentDto: RefundPaymentDto) {
    try {
      const response: AxiosResponse<PaymentRefundResponse> = await api.post(
        `/payments/${paymentId}/refunds`,
        {
          ...refundPaymentDto,
        },
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getRefunds(paymentId: number) {
    try {
      const response: AxiosResponse<PaymentDetailsReponse> = await api.get(
        `/payments/${paymentId}/refunds`,
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updatePayment(paymentId: number, updatePaymentDto: UpdatePaymentDto) {
    try {
      /* only payments in pending or in_process status can be cancelled */
      const response: AxiosResponse<PaymentDetailsReponse> = await api.put(
        `/payments/${paymentId}`,
        {
          ...updatePaymentDto,
        },
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getPaymentDetails(paymentId: number): Promise<PaymentDetailsReponse> {
    try {
      const response: AxiosResponse<PaymentDetailsReponse> = await api.get(
        `/payments/${paymentId}`,
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
