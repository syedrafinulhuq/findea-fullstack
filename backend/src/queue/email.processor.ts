import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailService } from '../mail/mail.service';

@Processor('email')
export class EmailProcessor extends WorkerHost {
  constructor(private mail: MailService) { super(); }
  async process(job: Job) {
    if (job.name === 'welcome') return this.mail.send(job.data.to, 'Welcome to Fidea', `Hi ${job.data.name}, welcome to Fidea.`);
    if (job.name === 'password-reset') return this.mail.send(job.data.to, 'Reset your Fidea password', `Reset token: ${job.data.token}`);
    if (job.name === 'password-reset-otp') return this.mail.send(job.data.to, 'Your Findea password reset code', `Your one-time password reset code is: ${job.data.otp}\n\nThis code expires in 10 minutes. Do not share it with anyone.`);
    if (job.name === 'order-created') return this.mail.send(job.data.to, 'Fidea order received', `Your order ${job.data.orderNumber} has been received.`);
    if (job.name === 'newsletter-welcome') return this.mail.send(job.data.to, 'Fidea newsletter subscription', 'Thanks for subscribing to Fidea updates.');
  }
}
