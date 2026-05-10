import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, OrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { QueueService } from '../queue/queue.service';
import { CreateOrderDto } from './dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService, private queue: QueueService) { }

  async create(dto: CreateOrderDto, userId?: string) {
    const products = await this.prisma.product.findMany({ where: { id: { in: dto.items.map(i => i.productId) }, isActive: true } });
    if (products.length !== dto.items.length) throw new BadRequestException('One or more products are invalid');
    let subtotal = new Prisma.Decimal(0);
    const items = dto.items.map(item => {
      const product = products.find(p => p.id === item.productId)!;
      if (product.stock < item.quantity) throw new BadRequestException(`${product.name} is out of stock`);
      subtotal = subtotal.plus(product.price.mul(item.quantity));
      return { productId: item.productId, quantity: item.quantity, unitPrice: product.price };
    });
    const deliveryFee = new Prisma.Decimal(80);
    const order = await this.prisma.order.create({
      data: {
        orderNumber: `FID-${Date.now()}`,
        userId,
        customerEmail: dto.customerEmail,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        shippingLine1: dto.shippingLine1,
        shippingLine2: dto.shippingLine2,
        shippingCity: dto.shippingCity,
        shippingState: dto.shippingState,
        shippingCountry: dto.shippingCountry || 'Bangladesh',
        subtotal, deliveryFee, total: subtotal.plus(deliveryFee),
        items: { create: items },
      }, include: { items: { include: { product: true } } },
    });
    await this.queue.addEmailJob('order-created', { to: order.customerEmail, orderNumber: order.orderNumber });
    return order;
  }

  track(orderNumber: string, email?: string) {
    return this.prisma.order.findFirst({ where: { orderNumber, customerEmail: email || undefined }, include: { items: { include: { product: true } }, payment: true } });
  }

  mine(userId: string) { return this.prisma.order.findMany({ where: { userId }, include: { items: { include: { product: true } }, payment: true }, orderBy: { createdAt: 'desc' } }); }
  all() { return this.prisma.order.findMany({ include: { items: true, payment: true }, orderBy: { createdAt: 'desc' } }); }

  async cancel(orderNumber: string, reason: string, userId?: string) {
    const order = await this.prisma.order.findFirst({ where: { orderNumber, userId: userId || undefined } });
    if (!order) throw new NotFoundException('Order not found');
    const cancellableStatuses: OrderStatus[] = [
      OrderStatus.PENDING,
      OrderStatus.PAID,
      OrderStatus.PROCESSING,
    ];

    if (!cancellableStatuses.includes(order.status)) {
      throw new BadRequestException('Order cannot be cancelled');
    }
    return this.prisma.order.update({ where: { id: order.id }, data: { status: OrderStatus.CANCELLED, cancelReason: reason } });
  }
}
