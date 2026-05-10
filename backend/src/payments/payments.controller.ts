import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InitPaymentDto, VerifyPaymentDto } from './dto';
import { PaymentsService } from './payments.service';

@ApiTags('Payments') @Controller('payments')
export class PaymentsController {
  constructor(private payments: PaymentsService) {}
  @Post('initialize') initialize(@Body() dto: InitPaymentDto) { return this.payments.initialize(dto.orderId); }
  @Post('verify') verify(@Body() dto: VerifyPaymentDto) { return this.payments.verify(dto.transactionId); }
  @Post('flutterwave/webhook') webhook(@Headers('verif-hash') hash: string, @Body() body: any) { return this.payments.handleWebhook(hash, body); }
}
