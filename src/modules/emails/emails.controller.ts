import { Controller, Get, Inject } from '@nestjs/common';

import { EmailsService } from './emails.service';

@Controller('emails')
export class EmailsController {
  constructor(@Inject(EmailsService) private emailService: EmailsService) {}

  @Get()
  async sendMail() {
    const defaultMailProps = {
      mailHeader: 'Boas Vindas',
      sectionTitle: 'Bem-vindo(a) a mais nova comunidade de viajantes!',
      name: 'Tony Amaral',
    };

    return this.emailService.send({
      content: defaultMailProps,
      to: 'antoniel15975@hotmail.com',
      type: 'welcome-user',
    });
  }
}
