import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('email') private emailQueue: Queue, @InjectQueue('payment') private paymentQueue: Queue) {}
  addEmailJob(name: string, data: Record<string, unknown>) { return this.emailQueue.add(name, data, { attempts: 3, backoff: { type: 'exponential', delay: 5000 } }); }
  addPaymentJob(name: string, data: Record<string, unknown>) { return this.paymentQueue.add(name, data, { attempts: 5, backoff: { type: 'exponential', delay: 10000 } }); }
}
