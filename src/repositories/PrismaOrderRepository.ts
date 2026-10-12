import { PrismaClient } from '@prisma/client';
import { ProductData } from '../domain/ProductFactory';
import {
  IOrderRepository,
  CreateOrderData,
  OrderData
} from './IOrderRepository';

export class PrismaOrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findProductById(id: number): Promise<ProductData | null> {
    return this.prisma.product.findUnique({
      where: { id }
    });
  }

  async create(data: CreateOrderData): Promise<OrderData> {
    return this.prisma.order.create({
      data
    });
  }
}