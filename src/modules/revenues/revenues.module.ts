import { Module } from "@nestjs/common";
import { ItineraryMembersModule } from "../itinerary-members/itinerary-members.module";
import { PaymentModule } from "../payments/payments.module";
import { RevenuesController } from "./revenues.controller";
import { RevenuesService } from "./revenues.service";

@Module({
    controllers: [RevenuesController],
    imports: [PaymentModule,ItineraryMembersModule],
    providers: [RevenuesService],
})
export class RevenuesModule {}