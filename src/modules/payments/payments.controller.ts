import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { PaymentService } from './payments.service';

import { ParamId, RequestUser } from '@/utils/types';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePaymentCustomerDto } from './dto/create-payment-client.dto';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';
import { UpdatePaymentCustomerDto } from './dto/update-payment-client.dto copy';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller()
export class PaymentController {
  constructor(
    @Inject(PaymentService)
    private paymentService: PaymentService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('payments-process')
  async processPayment(
    @Req() request: RequestUser,
    @Body() processPaymentDto: ProcessPaymentDto,
  ) {
    return this.paymentService.pay(processPaymentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('payments/customer/:id')
  async getPaymentCustomer(@Param() params: { id: string }) {
    return this.paymentService.getCustomer(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('payments/customer/:id')
  async updatePaymentCustomer(
    @Param() params: { id: string },
    @Body() updateCustomerDto: UpdatePaymentCustomerDto,
  ) {
    return this.paymentService.updateCustomer(params.id, updateCustomerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('payments/customer/:id/card')
  async addCustomerCard(
    @Param() params: { id: string },
    @Body() request: { token: string },
  ) {
    return this.paymentService.addCard(params.id, request.token);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('payments/customer/:id/card/:cardId')
  async removeCustomerCard(@Param() params: { id: string; cardId: string }) {
    return this.paymentService.removeCard(params.id, params.cardId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('payments/customer')
  async createPaymentCustomer(
    @Req() request: RequestUser,
    @Body() createPaymentCustomer: CreatePaymentCustomerDto,
  ) {
    return this.paymentService.createCustomer(
      request.user.userId,
      createPaymentCustomer,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('payments/:id')
  async getPayment(@Param() params: ParamId) {
    return this.paymentService.getPaymentDetails(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('payments/:id')
  async updatePayment(
    @Param() params: ParamId,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentService.updatePayment(params.id, updatePaymentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('payments/:id/refund')
  async refundPayment(
    @Param() params: ParamId,
    @Body() refundPaymentDto: RefundPaymentDto,
  ) {
    return this.paymentService.refundPayment(params.id, refundPaymentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('payments/:id/refund')
  async getPaymentRefunds(@Param() params: ParamId) {
    return this.paymentService.getRefunds(params.id);
  }
}
