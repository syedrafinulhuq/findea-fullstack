import { Module } from '@nestjs/common';
import { QueueModule } from '../queue/queue.module';
import { NewsletterController } from './newsletter.controller';
import { NewsletterService } from './newsletter.service';
@Module({ imports: [QueueModule], controllers: [NewsletterController], providers: [NewsletterService] })
export class NewsletterModule {}
