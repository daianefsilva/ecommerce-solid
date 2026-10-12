import { ProductData } from '../domain/ProductFactory';

export interface CreateOrderData {
  customer: string;
  items: string;
  total: number;
  status: string;
}

export interface OrderData extends CreateOrderData {
  id: number;
  createdAt: Date;
}

export interface IOrderRepository {
  findProductById(id: number): Promise<ProductData | null>;
  create(data: CreateOrderData): Promise<OrderData>;
}