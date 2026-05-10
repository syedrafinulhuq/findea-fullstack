import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class InitPaymentDto { @ApiProperty() @IsString() orderId: string; }
export class VerifyPaymentDto { @ApiProperty() @IsString() transactionId: string; }
