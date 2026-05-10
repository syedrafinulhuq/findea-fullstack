import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SubscribeDto } from './newsletter.dto';
import { NewsletterService } from './newsletter.service';
@ApiTags('Newsletter') @Controller('newsletter')
export class NewsletterController { constructor(private newsletter: NewsletterService) {} @Post('subscribe') subscribe(@Body() dto: SubscribeDto) { return this.newsletter.subscribe(dto); } }
