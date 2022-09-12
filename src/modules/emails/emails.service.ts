import { Injectable } from '@nestjs/common';

import * as Eta from 'eta';
import mjml2html from 'mjml';
import path from 'path';

import {
  RabbitMailPublisher,
  RabbitMailPublisherParams,
} from '@/providers/rabbit-publisher';
import { EmailSectionTitle, EmailSubject } from '@/utils//constants';

import { mailerOptions, mailerTransporter } from '../../providers/mail';

export type EmailType =
  | 'welcome-user'
  | 'user-recover-password'
  | 'user-request-help'
  | 'itinerary-payment-updates'
  | 'itinerary-finish'
  | 'welcome-user-subscription'
  | 'subscription-payment-updates'
  | 'user-new-password';

export interface EmailParams {
  mailHeader?: string;
  sectionTitle?: string;
  name: string;
  resetcode?: number;
  activationCode?: number;
  type?: string;
  message?: string;
  data?: Record<string, any>;
  userEmail?: string;
  paymentStatusColor?: string;
  paymentStatus?: string;
  itineraryName?: string;
  itineraryDescription?: string;
  cardBrandImage?: string;
  cardBrand?: string;
  cardLastNumbers?: string;
}

export interface SendEmailParams {
  content: EmailParams;
  to: string;
  type: EmailType;
}
export interface ToQueueParams<T> {
  to: string;
  type: EmailType;
  payload: T;
}

@Injectable()
export class EmailsService {
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
