import { BankAccount } from "@/entities/bank-account.entity";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { BankAccountsController } from "./bank-accounts.controller";
import { BankAccountsService } from "./bank-accounts.service";

@Module({
    controllers: [BankAccountsController],
    providers: [BankAccountsService],
    imports: [MikroOrmModule.forFeature([BankAccount]), UsersModule]
})
export class BankAccountsModule {}