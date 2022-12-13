import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import axios, { AxiosResponse } from 'axios';
import { Response } from 'express';

import { EmailsServiceInterface } from '../emails/interfaces/emails-service.interface';
import { UsersService } from '../users/users.service';

import { paymentApiOptions } from '@/config';
import { Plan } from '@/entities/plan.entity';
import {
  Subscription,
  SubscriptionStatus,
} from '@/entities/subscription.entity';
import { SubscriptionPaymentUpdatesMailTemplateParams } from '@/resources/emails/types/subscription-payment-updates';
import { WelcomeUserSubscriptionMailTemplateParams } from '@/resources/emails/types/welcome-user-subscription';
import { axiosErrorHandler } from '@/utils/axios-error';
import { paymentStatusColor, paymentStatusRole } from '@/utils/constants';
import {
  CreatePlanResponse,
  CreateSubscriptionResponse,
  MLPaginatedResponse,
  PaymentDetailsReponse,
  SearchSubscriptionResult,
} from '@/utils/types';

import { EmailsProviders } from '../emails/enums/providers.enum';
import { UsersProvider } from '../users/enums/users-provider.enum';
import { ChangeSubscriptionCardDto } from './dto/change-subscription-card.dto';
import { CreatePlanDto } from './dto/create-plan.dto';
import { CreateSubscriptionDto } from './dto/create-subscriptions.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { SubscriptionsGateway } from './subscriptions.gateway';

const api = axios.create({
  baseURL: paymentApiOptions.plan_url,
  headers: {
    Authorization: `Bearer ${paymentApiOptions.token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.response.use((response) => response, axiosErrorHandler);

interface ChangeCardRequestPayload {
  application_id: number;
  auto_recurring?: {
    currency_id?: 'BRL';
    transaction_amount?: number;
  };
  card_token_id: string;
}

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Plan)
    private planRespository: EntityRepository<Plan>,
    @InjectRepository(Subscription)
    private subscriptionRespository: EntityRepository<Subscription>,
    @Inject(UsersProvider.USERS_SERVICE)
    private usersService: UsersService,
    @Inject(SubscriptionsGateway)
    private subscriptionGateway: SubscriptionsGateway,
    @Inject(EmailsProviders.EMAILS_SERVICE)
    private emailsService: EmailsServiceInterface,
  ) {}

  async createPlan(createPlanDto: CreatePlanDto) {
    try {
      const apiPlan: AxiosResponse<CreatePlanResponse> = await api.post(
        '/preapproval_plan',
        createPlanDto,
      );

      const newPlan = new Plan({
        amount: createPlanDto.auto_recurring.transaction_amount.toFixed(2),
        frequencyType: createPlanDto.auto_recurring.frequency_type,
        name: createPlanDto.reason,
        repetitions: createPlanDto.auto_recurring.repetitions,
        referenceId: apiPlan.data.id,
      });

      await this.planRespository.persistAndFlush(newPlan);

      return newPlan;
    } catch (error) {
      throw error;
    }
  }

  async getPlan(planId: number) {
    try {
      return await this.planRespository.findOneOrFail({ id: planId });
    } catch (error) {
      throw error;
    }
  }

  async updatePlan(planId: number, updatePlanDto: UpdatePlanDto) {
    try {
      const plan = await this.planRespository.findOneOrFail({ id: planId });
      await api.put(`/preapproval_plan/${plan.referenceId}`, updatePlanDto);

      await this.planRespository.nativeUpdate(
        { id: planId },
        {
          amount: updatePlanDto.auto_recurring.transaction_amount.toFixed(2),
          frequencyType: updatePlanDto.auto_recurring.frequency_type,
          name: updatePlanDto.reason,
          repetitions: updatePlanDto.auto_recurring.repetitions,
        },
      );

      return plan;
    } catch (error) {
      throw error;
    }
  }

  async getSubscription(authUserId: number) {
    try {
      return await this.subscriptionRespository.findOne({
        user: authUserId,
        deletedAt: null,
      });
    } catch (error) {
      throw error;
    }
  }

  async getExternalSubscriptionReference(
    authUserId: number,
    referenceId: string,
  ) {
    try {
      const subscription = await this.subscriptionRespository.findOne({
        user: authUserId,
        referenceId,
      });

      if (!subscription) {
        throw new HttpException(
          'Can not get subscription reference.',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const response: AxiosResponse<
        MLPaginatedResponse<SearchSubscriptionResult>
      > = await api.get(`/preapproval/search?id=${referenceId}`);

      return response.data.results;
    } catch (error) {
      throw error;
    }
  }

  async createSubscription(
    authUserId: number,
    createSubscriptionDto: CreateSubscriptionDto,
  ) {
    const { planId, ...rest } = createSubscriptionDto;

    const subscription = await this.subscriptionRespository.findOne({
      user: authUserId,
      deletedAt: null,
    });
    const user = await this.usersService.findOneWithEmail({ id: authUserId });
    const plan = await this.planRespository.findOne({ id: planId });

    if (subscription) {
      throw new HttpException(
        "Can't create a new subscription on one active.",
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const response: AxiosResponse<CreateSubscriptionResponse> =
        await api.post(`/preapproval`, {
          ...rest,
        });

      const apiNewSubs = response.data;

      const newSubscription = new Subscription({
        referenceId: apiNewSubs.id,
        applicationId: String(apiNewSubs.application_id),
        status: SubscriptionStatus.PENDING,
        user: user,
      });

      if (plan) {
        newSubscription.plan = plan;
      }

      await this.subscriptionRespository.persistAndFlush(newSubscription);

      await this.emailsService.queue<WelcomeUserSubscriptionMailTemplateParams>(
        {
          type: 'welcome-user-subscription',
          to: user.email,
          payload: {
            name: user.username,
            data: {
              [plan.name]: plan.amount,
              Duração: `${plan.repetitions} meses`,
            },
          },
        },
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateSubscriptionStatusByWebhook(
    userEmail: string,
    subscriptionStatus: SubscriptionStatus,
    res: Response,
    payment?: PaymentDetailsReponse,
  ) {
    try {
      const user = await this.usersService.findOneWithEmail({
        email: userEmail,
      });
      const subscription = await this.subscriptionRespository.findOne(
        {
          user,
          deletedAt: null,
        },
        { populate: ['plan'] },
      );

      if (!subscription) {
        return res
          .status(200)
          .send({ message: "Can't find this subscription" });
      }

      if (subscription.status !== SubscriptionStatus.CANCELLED) {
        subscription.status = subscriptionStatus;
        await this.subscriptionRespository.flush();

        await this.subscriptionGateway.send(user.id, subscription);
      }

      if (payment) {
        await this.emailsService.queue<SubscriptionPaymentUpdatesMailTemplateParams>(
          {
            type: 'subscription-payment-updates',
            to: user.email,
            payload: {
              name: user.username,
              cardBrand: payment.payment_method_id,
              cardBrandImage: `https://rotery-filestore.nyc3.digitaloceanspaces.com/card-brands/${payment.payment_method_id}.png`,
              cardLastNumbers: payment.card.last_four_digits,
              paymentStatus: paymentStatusRole[payment.status],
              paymentStatusColor: paymentStatusColor[payment.status],
              data: {
                [subscription.plan.name]: subscription.plan.amount,
                Duração: `${subscription.plan.repetitions} meses`,
              },
            },
          },
        );
      }

      return res.status(200).send();
    } catch (error) {
      throw error;
    }
  }

  async cancelSubscription(authUserId: number, subscriptionId: number) {
    try {
      const subscription = await this.subscriptionRespository.findOneOrFail({
        id: subscriptionId,
        user: authUserId,
      });
      await api.put(`/preapproval/${subscription.referenceId}`, {
        status: 'cancelled', // can send paused or cancelled to update subscription status
      });

      subscription.status = SubscriptionStatus.CANCELLED;
      subscription.deletedAt = new Date();
      await this.subscriptionRespository.flush();

      return { message: 'Subscription cancelled.', statusCode: 200 };
    } catch (error) {
      throw error;
    }
  }

  async pauseSubscription(authUserId: number, subscriptionId: number) {
    try {
      const subscription = await this.subscriptionRespository.findOneOrFail({
        id: subscriptionId,
        user: authUserId,
        deletedAt: null,
      });
      await api.put(`/preapproval/${subscription.referenceId}`, {
        status: 'paused',
      });

      subscription.status = SubscriptionStatus.PAUSED;
      await this.subscriptionRespository.flush();

      return { message: 'Subscription cancelled.', statusCode: 200 };
    } catch (error) {
      throw error;
    }
  }

  async changeSubscriptionCard(
    authUserId: number,
    subscriptionId: number,
    changeSubscriptionCardDto: ChangeSubscriptionCardDto,
    hasPayment = false,
  ) {
    try {
      const subscription = await this.subscriptionRespository.findOneOrFail(
        {
          id: subscriptionId,
          user: authUserId,
          deletedAt: null,
        },
        { populate: ['plan'] },
      );

      const changeCardPayload: ChangeCardRequestPayload = {
        ...changeSubscriptionCardDto,
        application_id: Number(subscription.applicationId),
      };

      if (hasPayment) {
        changeCardPayload.auto_recurring = {
          currency_id: 'BRL',
          transaction_amount: Number(subscription.plan.amount),
        };
      }

      await api.put(
        `/preapproval/${subscription.referenceId}`,
        changeCardPayload,
      );

      return { message: 'Well done.', statusCode: 200 };
    } catch (error) {
      throw error;
    }
  }

  async isValid(authUserId: number) {
    try {
      const subscription = await this.subscriptionRespository.findOne({
        user: authUserId,
        deletedAt: null,
        status: SubscriptionStatus.AUTHORIZED,
      });

      if (!subscription) {
        return { allowed: false, statusCode: 401 };
      }

      return { allowed: true, statusCode: 200 };
    } catch (error) {
      throw error;
    }
  }
}
