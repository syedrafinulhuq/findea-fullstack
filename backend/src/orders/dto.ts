import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
class OrderItemDto {
  @ApiProperty() @IsString() productId: string;
  @ApiProperty() @Type(() => Number) @IsInt() @Min(1) quantity: number;
}
export class CreateOrderDto {
  @ApiProperty() @IsEmail() customerEmail: string;
  @ApiProperty() @IsString() customerName: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() customerPhone?: string;
  @ApiProperty() @IsString() shippingLine1: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() shippingLine2?: string;
  @ApiProperty() @IsString() shippingCity: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() shippingState?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() shippingCountry?: string;
  @ApiProperty({ type: [OrderItemDto] }) @IsArray() @ValidateNested({ each: true }) @Type(() => OrderItemDto) items: OrderItemDto[];
}
export class CancelOrderDto { @ApiProperty() @IsString() reason: string; }
