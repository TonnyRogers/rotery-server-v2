import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import axios from 'axios';

import { ProcessPaymentDto } from './dto/process-payment.dto';
import { UsersService } from '../users/users.service';
import { paymentApiOptions } from 'src/config';
import { CreatePaymentCustomerDto } from './dto/create-payment-client.dto';
import { UpdatePaymentCustomerDto } from './dto/update-payment-client.dto copy';

const api = axios.create({
  baseURL: paymentApiOptions.url,
  headers: {
    Authorization: `Bearer ${paymentApiOptions.token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

@Injectable()
export class PaymentService {
  constructor(
    @Inject(UsersService)
    private usersService: UsersService,
  ) {}

  async createCustomer(createUserDto: CreatePaymentCustomerDto) {
    try {
      const response = await api.post('/customers', { ...createUserDto });

      return response.data;
    } catch (error) {
      switch (error.response.status) {
        case 500:
          throw new HttpException(
            'Error on create customer.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
          break;
        default:
          throw new HttpException(
            error.response.data.message,
            error.response.status,
          );
          break;
      }
    }
  }

  async getCustomer(id: string) {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      switch (error.response.status) {
        case 404:
          throw new HttpException('Customer not foud.', HttpStatus.NOT_FOUND);
          break;
        default:
          throw new HttpException(
            error.response.data.message,
            error.response.status,
          );
          break;
      }
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
      switch (error.response.status) {
        case 404:
          throw new HttpException('Customer not foud.', HttpStatus.NOT_FOUND);
          break;
        default:
          throw new HttpException(
            error.response.data.message,
            error.response.status,
          );
          break;
      }
    }
  }

  async addCard(customerId: string, cardToken: string) {
    try {
      const response = await api.post(`/customers/${customerId}/cards`, {
        token: cardToken,
      });
      return response.data;
    } catch (error) {
      switch (error.response.status) {
        case 500:
          throw new HttpException(
            'Error on add card.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
          break;
        default:
          throw new HttpException(
            error.response.data.message,
            error.response.status,
          );
          break;
      }
    }
  }

  async removeCard(customerId: string, cardId: string) {
    try {
      const response = await api.delete(
        `/customers/${customerId}/cards/${cardId}`,
      );
      return response.data;
    } catch (error) {
      switch (error.response.status) {
        case 500:
          throw new HttpException(
            'Error on add card.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
          break;
        default:
          throw new HttpException(
            error.response.data.message,
            error.response.status,
          );
          break;
      }
    }
  }

  async pay(authUserId: number, processPaymentDto: ProcessPaymentDto) {
    try {
      const user = await this.usersService.findOne({ id: authUserId });
      console.log(JSON.stringify(processPaymentDto, null, 2));

      const response = await api.post(`/payments`, { ...processPaymentDto });

      return response.data;
    } catch (error) {
      switch (error.response.status) {
        case 500:
          throw new HttpException(
            'Error on make payment.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
          break;
        default:
          throw new HttpException(
            error.response.data.message,
            error.response.status,
          );
          break;
      }
    }
  }

  async getPaymentDetails(paymentId: number) {
    try {
      const response = await api.get(`/payments/${paymentId}`);

      return response.data;
    } catch (error) {
      switch (error.response.status) {
        case 500:
          throw new HttpException(
            'Error on get payment details.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
          break;
        default:
          throw new HttpException(
            error.response.data.message,
            error.response.status,
          );
          break;
      }
    }
  }
}
