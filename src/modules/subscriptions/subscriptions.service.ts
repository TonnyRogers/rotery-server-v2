import { paymentApiOptions } from "@/config";
import { Plan } from "@/entities/plan.entity";
import { Subscription, SubscriptionStatus } from "@/entities/subscription.entity";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import axios, { AxiosResponse } from "axios";
import { Response } from "express";

import { 
    CreatePlanResponse, 
    CreateSubscriptionResponse, 
    MLPaginatedResponse, 
    SearchSubscriptionResult 
} from "@/utils/types";
import { UsersService } from "../users/users.service";
import { ChangeSubscriptionCardDto } from "./dto/change-subscription-card.dto";
import { CreatePlanDto } from "./dto/create-plan.dto";
import { CreateSubscriptionDto } from "./dto/create-subscriptions.dto";
import { UpdatePlanDto } from "./dto/update-plan.dto";
import { SubscriptionsGateway } from "./subscriptions.gateway";

const api = axios.create({
    baseURL: paymentApiOptions.plan_url,
    headers: {
      Authorization: `Bearer ${paymentApiOptions.token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

interface ChangeCardRequestPayload {
    application_id: number;
    auto_recurring?: {
        currency_id?: "BRL",
        transaction_amount?: number
    },
    card_token_id: string;
}

@Injectable()
export class SubscriptionsService {
    constructor(
        @InjectRepository(Plan)
        private planRespository: EntityRepository<Plan>,
        @InjectRepository(Subscription)
        private subscriptionRespository: EntityRepository<Subscription>,
        @Inject(UsersService)
        private usersService: UsersService,
        @Inject(SubscriptionsGateway)
        private subscriptionGateway: SubscriptionsGateway,
    ) {}

    async createPlan(createPlanDto: CreatePlanDto) {
        try {
            const apiPlan: AxiosResponse<CreatePlanResponse> = await api.post('/preapproval_plan',createPlanDto);

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
            return await this.planRespository.findOneOrFail({ id: planId });;
        } catch (error) {
            throw error;
        }
    }

    async updatePlan(planId: number, updatePlanDto: UpdatePlanDto) {
        try {
            let plan = await this.planRespository.findOneOrFail({ id: planId });
            await api.put(`/preapproval_plan/${plan.referenceId}`,updatePlanDto);

            await this.planRespository.nativeUpdate({id: planId },
                {
                    amount: updatePlanDto.auto_recurring.transaction_amount.toFixed(2),
                    frequencyType: updatePlanDto.auto_recurring.frequency_type,
                    name: updatePlanDto.reason,
                    repetitions: updatePlanDto.auto_recurring.repetitions,
                }
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

    async getExternalSubscriptionReference(authUserId: number,referenceId: string) {
        try {
            const subscription = await this.subscriptionRespository.findOne({ user: authUserId, referenceId });

            if(!subscription) {
                throw new HttpException(
                    'Can not get subscription reference.',
                    HttpStatus.UNAUTHORIZED,
                );
            }
            const response: AxiosResponse<MLPaginatedResponse<SearchSubscriptionResult>> = await api.get(`/preapproval/search?id=${referenceId}`);

            return response.data.results;
        } catch (error) {
            if(error.response.status) {
                switch (error.response.status) {
                    case 500:
                    throw new HttpException(
                        'Error on get subscription reference.',
                        HttpStatus.INTERNAL_SERVER_ERROR,
                    );
                    default:
                    throw new HttpException(
                        error.response.data.message || 'Unknow error.',
                        error.response.status,
                    );
                }  
            }     
            throw error;   
        }
    }

    async createSubscription(authUserId: number, createSubscriptionDto: CreateSubscriptionDto) {
        try {
            const { planId, ...rest } = createSubscriptionDto;
            
            const subscription = await this.subscriptionRespository.findOne({ user: authUserId, deletedAt: null });
            const user = await this.usersService.findOne({ id: authUserId });
            const plan = await this.planRespository.findOne({ id: planId });            

            if(subscription) {
                throw new HttpException("Can't create a new subscription on one active.", HttpStatus.UNAUTHORIZED);
            }

            const response: AxiosResponse<CreateSubscriptionResponse> = await api.post(`/preapproval`,{
                ...rest,
            });

            const apiNewSubs = response.data;

            const newSubscription = new Subscription({
                referenceId: apiNewSubs.id,
                applicationId: String(apiNewSubs.application_id),
                status: SubscriptionStatus.PENDING,
                user: user,
            });

            if(plan) {
                newSubscription.plan = plan;
            }

            await this.subscriptionRespository.persistAndFlush(newSubscription);

            return response.data;
        } catch (error) {
            if(error.response.status) {
                switch (error.response.status) {
                    case 500:
                    throw new HttpException(
                        'Error on process subscription payment.',
                        HttpStatus.INTERNAL_SERVER_ERROR,
                    );
                    default:
                    throw new HttpException(
                        error.response.data.message || 'Unknow error.',
                        error.response.status,
                    );
                }  
            }     
            throw error;   
        }
    }

    async updateSubscriptionStatusByWebhook(userEmail: string, subscriptionStatus: SubscriptionStatus, res: Response) {
        try {
            const user = await this.usersService.findOneWithEmail({ email: userEmail });
            const subscription = await this.subscriptionRespository.findOneOrFail({ user, deletedAt: null });
            
            if(subscription.status !== SubscriptionStatus.CANCELLED) {
                subscription.status = subscriptionStatus;
                await this.subscriptionRespository.flush();

                await this.subscriptionGateway.send(user.id,subscription);
            }

            return res.status(200).send();
        } catch (error) {
            throw error;
        }
    }

    async cancelSubscription(authUserId: number, subscriptionId: number) {
        try {
            const subscription = await this.subscriptionRespository.findOneOrFail({ id: subscriptionId, user: authUserId });
            await api.put(`/preapproval/${subscription.referenceId}`,{
                status: "cancelled" // can send paused or cancelled to update subscription status
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
            const subscription = await this.subscriptionRespository.findOneOrFail({ id: subscriptionId, user: authUserId, deletedAt: null });
            await api.put(`/preapproval/${subscription.referenceId}`,{
                status: "paused"
            });

            subscription.status = SubscriptionStatus.PAUSED;
            await this.subscriptionRespository.flush();

            return { message: 'Subscription cancelled.', statusCode: 200 };
        } catch (error) {
            throw error;
        }
    }

    async changeSubscriptionCard(authUserId: number, subscriptionId: number, changeSubscriptionCardDto: ChangeSubscriptionCardDto, hasPayment = false) {
        try {
            const subscription = await this.subscriptionRespository.findOneOrFail({ id: subscriptionId, user: authUserId, deletedAt: null },['plan']);

            const changeCardPayload: ChangeCardRequestPayload = {
                ...changeSubscriptionCardDto,
                application_id: Number(subscription.applicationId),
            };
            
            if(hasPayment) {
                changeCardPayload.auto_recurring = {
                    currency_id: "BRL",
                    transaction_amount: Number(subscription.plan.amount),
                }
            }
            
            await api.put(`/preapproval/${subscription.referenceId}`,changeCardPayload);

            return { message: 'Well done.', statusCode: 200 };
        } catch (error) {
            if(error.response?.status) {
                switch (error.response.status) {
                    case 500:
                    throw new HttpException(
                        'Error on process subscription payment.',
                        HttpStatus.INTERNAL_SERVER_ERROR,
                    );
                    default:
                    throw new HttpException(
                        error.response.data.message || 'Unknow error.',
                        error.response.status,
                    );
                }  
            }                 
            throw error;   
        }
    }

}