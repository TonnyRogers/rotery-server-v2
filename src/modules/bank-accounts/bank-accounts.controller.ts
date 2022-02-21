import { Body, Controller, Get, Inject, Post, Put, Req, UseGuards } from "@nestjs/common";
import { RequestUser } from "utils/types";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { BankAccountsService } from "./bank-accounts.service";
import { CreateBankAccountDto } from "./dto/create-bank-account.dto";
import { UpdateBankAccountDto } from "./dto/update-bank-account.dto";

@UseGuards(JwtAuthGuard)
@Controller('bank-accounts')
export class BankAccountsController {
    constructor(
        @Inject(BankAccountsService)
        private bankAccountsService: BankAccountsService,
    ) {}

    @Post()
    async create(@Req() request: RequestUser, @Body() createBankAccountDto: CreateBankAccountDto) {
        return this.bankAccountsService.create(request.user.userId,createBankAccountDto);
    }

    @Get()
    async findOne(@Req() request: RequestUser) {
        return this.bankAccountsService.findOne(request.user.userId);
    }

    @Put()
    async update(@Req() request: RequestUser, @Body() updateBankAccountDto: UpdateBankAccountDto) {
        return this.bankAccountsService.update(request.user.userId,updateBankAccountDto);
    }
}