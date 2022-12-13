import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { EmailsServiceInterface } from './interfaces/emails-service.interface';

import { rabbitmqConfig } from '@/config';
import { RabbitMailPublisherMessage } from '@/providers/rabbit-publisher';

import { EmailsProviders } from './enums/providers.enum';

@Controller('emails')
export class EmailsController {
  constructor(
    @Inject(EmailsProviders.EMAILS_SERVICE)
    private emailService: EmailsServiceInterface,
  ) {}

  @MessagePattern(rabbitmqConfig.sendMailQueue)
  async mailQueue(@Payload() data: RabbitMailPublisherMessage<any>) {
    return await this.emailService.send({
      to: data.to,
      type: data.type,
      content: {
        name: data.payload.name,
        ...data.payload,
      },
    });
  }
}
