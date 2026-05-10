import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);
  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async expireOldPendingOrders() {
    const cutoff = new Date(Date.now() - 1000 * 60 * 60 * 24);
    const result = await this.prisma.order.updateMany({ where: { status: OrderStatus.PENDING, createdAt: { lt: cutoff } }, data: { status: OrderStatus.CANCELLED, cancelReason: 'Auto-cancelled after 24 hours without payment.' } });
    this.logger.log(`Auto-cancelled ${result.count} pending orders`);
  }
}
