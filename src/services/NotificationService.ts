import { IMailProvider } from '../providers/IMailProvider';

export interface OrderNotification {
  id: number;
  customer: string;
  total: number;
}

export class NotificationService {
  constructor(private readonly mailProvider: IMailProvider) {}

  async notifyOrder(order: OrderNotification): Promise<string | null> {
    const formattedTotal = order.total.toFixed(2);

    return this.mailProvider.sendMail({
      to: order.customer,
      subject: `Confirmação do Pedido #${order.id}`,
      text:
        `Olá, seu pedido #${order.id} no valor de ` +
        `R$ ${formattedTotal} foi confirmado.`,
      html: `
        <h1>Pedido Confirmado!</h1>
        <p>Seu pedido <b>#${order.id}</b> foi confirmado.</p>
        <p>Total: <strong>R$ ${formattedTotal}</strong></p>
      `
    });
  }
}