import { Controller, Get, Inject, Req, UseGuards } from "@nestjs/common";
import { RequestUser } from "@/utils/types";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RevenuesService } from "./revenues.service";

@UseGuards(JwtAuthGuard)
@Controller('revenues')
export class RevenuesController {
    constructor(
        @Inject(RevenuesService)
        private revenuesService: RevenuesService,
    ) {}

    @Get()
    async itineraryOwnerRevenues(@Req() request: RequestUser) {
        return this.revenuesService.listRevenues(request.user.userId);
    }
}