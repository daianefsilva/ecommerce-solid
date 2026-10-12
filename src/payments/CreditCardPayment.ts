import { IPaymentMethod, PaymentDetails } from './IPaymentMethod';
import logger from '../lib/logger';

export class CreditCardPayment implements IPaymentMethod {
  async process(
    amount: number,
    details: PaymentDetails
  ): Promise<void> {
    if (!details.cardNumber || !details.cvv) {
      throw new Error('Informe o número do cartão e o CVV');
    }

    if (details.cvv === '000') {
      throw new Error('Cartão recusado');
    }

    logger.info(
      `Processando R$ ${amount.toFixed(2)} no cartão final ${
        details.cardNumber.slice(-4)
      }`
    );
  }
}