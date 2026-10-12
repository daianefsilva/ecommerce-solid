import { IPaymentMethod, PaymentDetails } from './IPaymentMethod';
import logger from '../lib/logger';

export class PixPayment implements IPaymentMethod {
  async process(
    amount: number,
    _details: PaymentDetails
  ): Promise<void> {
    logger.info(`Simulando pagamento via Pix de R$ ${amount.toFixed(2)}`);
  }
}