import express from 'express';
import { PrismaClient } from '@prisma/client';
import { OrderController } from './controllers/OrderController';
import { OrderService } from './services/OrderService';
import { NotificationService } from './services/NotificationService';
import { PrismaOrderRepository } from './repositories/PrismaOrderRepository';
import { EtherealMailProvider } from './providers/EtherealMailProvider';
import { IPaymentMethod } from './payments/IPaymentMethod';
import { CreditCardPayment } from './payments/CreditCardPayment';
import { DebitCardPayment } from './payments/DebitCardPayment';
import { PixPayment } from './payments/PixPayment';

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

const repository = new PrismaOrderRepository(prisma);
const mailProvider = new EtherealMailProvider();
const notificationService = new NotificationService(mailProvider);

const payments = new Map<string, IPaymentMethod>([
  ['credit_card', new CreditCardPayment()],
  ['debit_card', new DebitCardPayment()],
  ['pix', new PixPayment()]
]);

const orderService = new OrderService(
  repository,
  payments,
  notificationService
);

const orderController = new OrderController(orderService);

app.post('/orders', orderController.processOrder);

export default app;