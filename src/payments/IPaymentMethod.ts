export interface PaymentDetails {
  cardNumber?: string;
  cvv?: string;
}

export interface IPaymentMethod {
  process(
    amount: number,
    details: PaymentDetails
  ): Promise<void>;
}