import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateProductDto, ProductQueryDto } from './dto';
import { ProductsService } from './products.service';

@ApiTags('Products') @Controller('products')
export class ProductsController {
  constructor(private products: ProductsService) {}
  @Get('categories') categories() { return this.products.categories(); }
  @Get() list(@Query() q: ProductQueryDto) { return this.products.list(q); }
  @Get(':slug') detail(@Param('slug') slug: string) { return this.products.detail(slug); }
  @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN) @Post() create(@Body() dto: CreateProductDto) { return this.products.create(dto); }
}
