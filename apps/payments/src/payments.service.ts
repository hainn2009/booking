import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
  ) {}

  private readonly stripeClient = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {},
  );

  async createCharge({ amount, email }: PaymentsCreateChargeDto) {
    // can get card from createChargeDto
    // const paymentMethod = await this.stripeClient.paymentMethods.create({
    //   type: 'card',
    //   card,
    // });

    const PaymentIntent = await this.stripeClient.paymentIntents.create({
      // payment_method: paymentMethod.id,
      payment_method: 'pm_card_visa', // use this payment method for testing
      amount: amount * 100, // amount in cents
      confirm: true,
      currency: 'usd',
      payment_method_types: ['card'],
    });

    this.notificationsService.emit('notify_email', {
      email,
      text: `Your payment of $${amount} has completed successfully`,
    });

    return PaymentIntent;
  }
}
