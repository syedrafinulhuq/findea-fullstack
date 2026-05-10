import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, ProductQueryDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  categories() { return this.prisma.category.findMany({ orderBy: { name: 'asc' } }); }
  list(q: ProductQueryDto) {
    return this.prisma.product.findMany({
      where: { isActive: true, name: q.search ? { contains: q.search, mode: 'insensitive' } : undefined, category: q.category ? { slug: q.category } : undefined },
      include: { category: true }, orderBy: { createdAt: 'desc' },
    });
  }
  detail(slug: string) { return this.prisma.product.findUnique({ where: { slug }, include: { category: true } }); }
  create(dto: CreateProductDto) { return this.prisma.product.create({ data: dto }); }
}
