import { Inject, Injectable } from "@nestjs/common";
import { FindAllMemberRevenuesResponse } from "@/utils/types";
import { ItineraryMembersService } from "../itinerary-members/itinerary-members.service";
import { PaymentService } from "../payments/payments.service";


@Injectable()
export class RevenuesService {
    constructor(
        @Inject(PaymentService)
        private paymentService: PaymentService,
        @Inject(ItineraryMembersService)
        private itineraryMemberService: ItineraryMembersService,
    ) {}

    async listRevenues(authUserId: number): Promise<FindAllMemberRevenuesResponse> {
        try {
            return await this.itineraryMemberService.findAllWithMemberPaymentId(authUserId); 
        } catch (error) {
            throw error;
        }
    }
}