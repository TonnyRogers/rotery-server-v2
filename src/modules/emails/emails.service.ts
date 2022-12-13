import { Injectable } from '@nestjs/common';

import * as Eta from 'eta';
import mjml2html from 'mjml';
import path from 'path';

import {
  EmailParams,
  EmailsServiceInterface,
  SendEmailParams,
  ToQueueParams,
} from './interfaces/emails-service.interface';

import {
  RabbitMailPublisher,
  RabbitMailPublisherParams,
} from '@/providers/rabbit-publisher';
import { EmailSectionTitle, EmailSubject } from '@/utils//constants';

import { mailerOptions, mailerTransporter } from '../../providers/mail';

@Injectable()
export class EmailsService implements EmailsServiceInterface {
  private queuePublisher = new RabbitMailPublisher();

  private async renderContent(template = 'welcome-user', params: EmailParams) {
    try {
      const htmlRender = await Eta.renderFile(
        path.resolve(`./src/resources/emails/${template}.eta`),
        params,
      );

      const textRender = await Eta.renderFile(
        path.resolve(`./src/resources/emails/${template}.txt`),
        params,
      );

      const html = mjml2html(String(htmlRender)).html;
      const text = textRender;

      return {
        html,
        text,
      };
    } catch (error) {
      return error;
    }
  }

  async send(sendProps: SendEmailParams) {
    try {
      const { type, content, ...rest } = sendProps;

      const emailContent = await this.renderContent(type, {
        ...content,
        mailHeader: EmailSubject[type],
        sectionTitle:
          type === 'user-recover-password'
            ? EmailSectionTitle[type].replace(
                '*code*',
                String(content.resetcode),
              )
            : EmailSectionTitle[type],
      });

      let options = mailerOptions;

      options = {
        ...options,
        ...rest,
        subject: EmailSubject[type],
        text: String(emailContent.text),
        html: emailContent.html,
      };

      await mailerTransporter.sendMail(options);

      return true;
    } catch (error) {
      return error;
    }
  }

  async queue<T>(params: ToQueueParams<T>) {
    const payload: RabbitMailPublisherParams<T> = {
      data: {
        to: params.to,
        type: params.type,
        payload: {
          ...params.payload,
        },
      },
    };

    await this.queuePublisher.toQueue(payload);
  }
}
