import { Controller, Get, Param, Post } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SubscriptionResponseDto, SubscribeDto } from 'src/common/dtos';

@ApiTags('subscription')
@Controller('subscription')
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) {}

    @Post('/subscribe/:email/:city/:frequency')
    @ApiOperation({
        summary: 'Subscribe to weather updates',
        description: 'Subscribe an email to receive weather updates for a specific city with chosen frequency.',
    })
    @ApiOkResponse({ description: 'Subscription successful. Confirmation email sent.', type: SubscriptionResponseDto })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    @ApiResponse({ status: 409, description: 'Email already subscribed' })
    async subscribe(@Param() dto: SubscribeDto): Promise<SubscriptionResponseDto> {
        // As for me, it is better to use @Body() instead of @Param() for the request
        // But documentation says that we should use params for this case
        return this.subscriptionService.subscribe(dto);
    }

    @Get('confirm/:token')
    @ApiOperation({
        summary: 'Confirm email subscription',
        description: 'Confirms a subscription using the token sent in the confirmation email.',
    })
    @ApiParam({ name: 'token', description: 'Confirmation token' })
    @ApiResponse({ status: 200, description: 'Subscription confirmed successfully' })
    @ApiResponse({ status: 400, description: 'Invalid token' })
    @ApiResponse({ status: 404, description: 'Token not found' })
    async confirm(@Param('token') token: string) {
        return this.subscriptionService.confirm(token);
    }

    @Get('unsubscribe/:token')
    @ApiOperation({
        summary: 'Unsubscribe from weather updates',
        description: 'Unsubscribes an email from weather updates using the token sent in emails.',
    })
    @ApiParam({ name: 'token', description: 'Unsubscribe token' })
    @ApiResponse({ status: 200, description: 'Unsubscribed successfully' })
    @ApiResponse({ status: 400, description: 'Invalid token' })
    @ApiResponse({ status: 404, description: 'Token not found' })
    async unsubscribe(@Param('token') token: string) {
        return this.subscriptionService.unsubscribe(token);
    }
}
