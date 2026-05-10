import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;
  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: config.get('SMTP_HOST'), port: Number(config.get('SMTP_PORT', 587)), secure: false,
      auth: config.get('SMTP_USER') ? { user: config.get('SMTP_USER'), pass: config.get('SMTP_PASS') } : undefined,
    });
  }
  send(to: string, subject: string, text: string, html?: string) {
    return this.transporter.sendMail({ from: this.config.get('MAIL_FROM'), to, subject, text, html });
  }
}
