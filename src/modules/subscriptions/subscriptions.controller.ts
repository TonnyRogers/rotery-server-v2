import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { ParamId, RequestUser } from "@/utils/types";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ChangeSubscriptionCardDto } from "./dto/change-subscription-card.dto";
import { CreatePlanDto } from "./dto/create-plan.dto";
import { CreateSubscriptionDto } from "./dto/create-subscriptions.dto";
import { UpdatePlanDto } from "./dto/update-plan.dto";
import { SubscriptionsService } from "./subscriptions.service";

@UseGuards(JwtAuthGuard)
@Controller('subscriptions')
export class SubscriptionsController {
    constructor(
        @Inject(SubscriptionsService)
        private subscriptionsService: SubscriptionsService,
    ) {}

    @Post('/plan')
    async createPlan(@Body() createPlanDto: CreatePlanDto) {
        return this.subscriptionsService.createPlan(createPlanDto);
    }

    @Get('/plan/:id')
    async getPlan(@Param() params: ParamId) {
        return this.subscriptionsService.getPlan(params.id);
    }

    @Put('/plan/:id')
    async updatePlan(@Param() params: ParamId, @Body() updatePlanDto: UpdatePlanDto) {
        return this.subscriptionsService.updatePlan(params.id, updatePlanDto);
    }
    
    @Get()
    async getSubscription(@Req() request: RequestUser) {
        return this.subscriptionsService.getSubscription(request.user.userId);
    }
    
    @Post()
    async createSubscription(@Req() request: RequestUser, @Body() createSubscriptionDto: CreateSubscriptionDto) {
        return this.subscriptionsService.createSubscription(request.user.userId,createSubscriptionDto);
    }

    @Delete('/:id')
    async cancelSubscription(@Req() request: RequestUser, @Param() params: ParamId) {
        return this.subscriptionsService.cancelSubscription(request.user.userId,params.id);
    }

    @Put('/:id/change-card')
    async changeSubscriptionCard(
        @Req() request: RequestUser, 
        @Param() params: ParamId, 
        @Body() changeSubscriptionCardDto: ChangeSubscriptionCardDto) {
        return this.subscriptionsService.changeSubscriptionCard(
            request.user.userId,
            params.id,
            changeSubscriptionCardDto
        );
    }

    @Get('/details')
    async getDetails(@Req() request: RequestUser, @Query() query: { ref: string } ) {
        return this.subscriptionsService.getExternalSubscriptionReference(request.user.userId, query.ref);
    }
}