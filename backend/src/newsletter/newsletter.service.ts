import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueueService } from '../queue/queue.service';
import { SubscribeDto } from './newsletter.dto';
@Injectable()
export class NewsletterService {
  constructor(private prisma: PrismaService, private queue: QueueService) {}
  async subscribe(dto: SubscribeDto) {
    const subscriber = await this.prisma.newsletterSubscriber.upsert({ where: { email: dto.email }, update: {}, create: { email: dto.email } });
    await this.queue.addEmailJob('newsletter-welcome', { to: dto.email });
    return { message: 'Subscribed successfully', subscriber };
  }
}
