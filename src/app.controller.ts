import { Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { rabbitmqConfig } from './config';
import { AuthService } from './modules/auth/auth.service';
import { LocalAuthGuard } from './modules/auth/local-auth.guard';
import { EmailsService } from './modules/emails/emails.service';
import { RedisPlublishPayload } from './providers/email.redis';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    @Inject(EmailsService)
    private emailsService: EmailsService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('auth/login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: any) {
    return this.authService.login(req.user);
  }

  // @MessagePattern('send_email')
  // getMessage(@Payload() data: RedisPlublishPayload, @Ctx() context: RedisContext) {
  //   this.emailsService.send({
  //     to: data.payload.email,
  //     type: data.type,
  //     content: {
  //       name: data.payload.name,
  //       mailHeader: '',
  //       sectionTitle: '',
  //     },
  //   });
  // }

  @MessagePattern(rabbitmqConfig.sendMailQueue)
  async mailQueue(@Payload() data: RedisPlublishPayload) {
    return await this.emailsService.send({
      to: data.payload.email,
      type: data.type,
      content: {
        name: data.payload.name,
        mailHeader: '',
        sectionTitle: '',
      },
    });
  }
}
