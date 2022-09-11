import nodemailer from 'nodemailer';
import Mailer from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { smtp } from '../config';

const { host, port, mailPassword, mailUsername } = smtp;

const transportOptions: SMTPTransport.Options = {
  host,
  port: Number(port),
  secure: false,
  auth: {
    user: mailUsername,
    pass: mailPassword,
  },
};

export const mailerOptions: Mailer.Options = {
  from: 'Rotery App <contato@rotery.com.br>',
  to: '',
  subject: '',
  text: '',
  html: '',
};

export const mailerTransporter = nodemailer.createTransport(transportOptions);
