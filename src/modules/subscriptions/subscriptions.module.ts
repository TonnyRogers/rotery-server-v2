import { Plan } from "@/entities/plan.entity";
import { Subscription } from "@/entities/subscription.entity";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { SubscriptionsController } from "./subscriptions.controller";
import { SubscriptionsGateway } from "./subscriptions.gateway";
import { SubscriptionsService } from "./subscriptions.service";

@Module({
    controllers: [SubscriptionsController],
    providers: [SubscriptionsService, SubscriptionsGateway],
    imports: [MikroOrmModule.forFeature([Plan,Subscription]),UsersModule],
    exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
