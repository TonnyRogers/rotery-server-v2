import { Module } from "@nestjs/common";
import { EmailsModule } from "../emails/emails.module";
import { UsersModule } from "../users/users.module";
import { CommunicationsController } from "./communications.controller";
import { CommunicationsService } from "./communications.service";

@Module({
    controllers: [CommunicationsController],
    providers: [CommunicationsService],
    imports: [EmailsModule,UsersModule],
    exports: [CommunicationsService]
})
export class CommunicationsModule {}