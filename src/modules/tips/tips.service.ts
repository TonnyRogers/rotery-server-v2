import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { Response } from 'express';

import { PaymentService } from '../payments/payments.service';
import { TipsServiceInterface } from './interface/tips-service.interface';

import { Tip, TipPaymentStatus } from '@/entities/tip.entity';
import { PaymentDetailStatus } from '@/utils/types';

import { UsersProvider } from '../users/enums/users-provider.enum';
import { UsersRepositoryInterface } from '../users/interfaces/users-repository.interface';
import { CreateTipDto } from './dto/create-tip.dto';
import { TipsProvider } from './enums/tips-providers.enum';
import { TipsRepositoryInterface } from './interface/tips-repository.interface';

@Injectable()
export class TipsService implements TipsServiceInterface {
  constructor(
    @Inject(TipsProvider.TIPS_REPOSITORY)
    private readonly tipsRepository: TipsRepositoryInterface,
    @Inject(UsersProvider.USERS_REPOSITORY)
    private readonly usersRepository: UsersRepositoryInterface,
    @Inject(PaymentService)
    private readonly paymentService: PaymentService,
  ) {}

  async add(authUserId: number, dto: CreateTipDto): Promise<Tip> {
    const payer = await this.usersRepository.findOne({ id: authUserId }, [
      'customerId',
      'email',
    ]);
    const user = await this.usersRepository.findOne({ id: dto.user.id });

    const paymentResponse = await this.paymentService.pay({
      description: `Gorjeta para ${user.username}`,
      external_reference: `Mochilee - Gorjeta enviada para ${user.username} (Guia)`,
      installments: 1,
      payer: {
        entity_type: 'individual',
        type: 'customer',
        id: payer.customerId,
        email: payer.email,
      },
      issuer_id: dto.cardInfo.issuerId,
      token: dto.cardInfo.token,
      payment_method_id: dto.cardInfo.paymentMethod,
      transaction_amount: Number(dto.paymentAmount),
      notification_url: '',
      statement_descriptor: `Mochilee - Gorjeta para ${user.username}`,
      metadata: {
        payment_type: 'tip',
      },
    });

    if (paymentResponse.status === 'rejected') {
      throw new HttpException("Can't process payment.", HttpStatus.BAD_REQUEST);
    }

    const newTip = new Tip({
      payer,
      user,
      paymentId: String(paymentResponse.id),
      paymentStatus: TipPaymentStatus.PENDING,
      paymentAmount: String(dto.paymentAmount),
    });

    return this.tipsRepository.create(newTip);
  }

  async getByPayer(authUserId: number): Promise<Tip[]> {
    return this.tipsRepository.findAll({ payer: authUserId });
  }

  async getByCollector(authUserId: number): Promise<Tip[]> {
    return this.tipsRepository.findAll({ user: authUserId });
  }

  async updateByWebhook(
    paymentId: string,
    paymentStatus: PaymentDetailStatus,
    res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    const tip = await this.tipsRepository.findByPaymentId(paymentId);

    if (!tip) {
      return res.status(200).send();
    }

    let updatedStatus: TipPaymentStatus;

    if (paymentStatus === 'approved') {
      updatedStatus = TipPaymentStatus.PAID;
    }

    if (paymentStatus === 'refunded') {
      updatedStatus = TipPaymentStatus.REFUNDED;
    }

    if (paymentStatus === 'in_process') {
      updatedStatus = TipPaymentStatus.PENDING;
    }

    if (paymentStatus === 'rejected') {
      updatedStatus = TipPaymentStatus.REFUSED;
    }

    await this.tipsRepository.updateStatus(tip.id, updatedStatus);

    return res.status(200).send();
  }
}
