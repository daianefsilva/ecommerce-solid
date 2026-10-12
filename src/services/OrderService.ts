import { ProductFactory } from '../domain/ProductFactory';
import { IOrderRepository } from '../repositories/IOrderRepository';
import {
  IPaymentMethod,
  PaymentDetails
} from '../payments/IPaymentMethod';
import { NotificationService } from './NotificationService';
import logger from '../lib/logger';

export interface OrderItem {
  productId: number;
  quantity: number;
}

export interface ProcessOrderInput {
  customer: string;
  items: OrderItem[];
  paymentMethod: string;
  paymentDetails?: PaymentDetails;
}

export class OrderValidationError extends Error {}

export class OrderService {
  constructor(
    private readonly repository: IOrderRepository,
    private readonly payments: ReadonlyMap<string, IPaymentMethod>,
    private readonly notificationService: NotificationService
  ) {}

  async execute(input: ProcessOrderInput) {
    const { customer, items, paymentMethod, paymentDetails } = input;

    if (typeof customer !== 'string' || !customer.trim()) {
      throw new OrderValidationError('Informe o email do cliente');
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new OrderValidationError('Carrinho vazio');
    }

    for (const item of items) {
      if (
        !item ||
        !Number.isInteger(item.productId) ||
        item.productId <= 0 ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        throw new OrderValidationError(
          'Produto e quantidade devem ser números inteiros positivos'
        );
      }
    }

    const payment = this.payments.get(paymentMethod);

    if (!payment) {
      throw new OrderValidationError('Método de pagamento não suportado');
    }

    let totalAmount = 0;
    const productsDetails = [];

    for (const item of items) {
      const productData = await this.repository.findProductById(
        item.productId
      );

      if (!productData) {
        throw new OrderValidationError(
          `Produto ${item.productId} não encontrado`
        );
      }

      const product = ProductFactory.createProduct(productData);

      totalAmount +=
        product.price * item.quantity + product.calculateFreight();

      productsDetails.push({
        ...productData,
        quantity: item.quantity
      });
    }

    try {
      await payment.process(totalAmount, paymentDetails ?? {});
    } catch (error: unknown) {
      throw new OrderValidationError(
        error instanceof Error ? error.message : 'Pagamento recusado'
      );
    }

    const order = await this.repository.create({
      customer,
      items: JSON.stringify(productsDetails),
      total: totalAmount,
      status: 'confirmed'
    });

    let emailPreview: string | null = null;

    try {
      emailPreview = await this.notificationService.notifyOrder(order);
    } catch (error: unknown) {
      logger.error(
        `Pedido #${order.id} confirmado, mas houve falha no email: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }

    return {
      message: 'Pedido processado com sucesso',
      orderId: order.id,
      total: order.total,
      emailPreview
    };
  }
}