import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { EmailsService } from './emails.service';

import { rabbitmqConfig } from '@/config';
import { RabbitMailPublisherMessage } from '@/providers/rabbit-publisher';

@Controller('emails')
export class EmailsController {
  constructor(@Inject(EmailsService) private emailService: EmailsService) {}

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
