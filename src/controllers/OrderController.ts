import { Request, Response } from 'express';
import {
  OrderService,
  OrderValidationError
} from '../services/OrderService';
import logger from '../lib/logger';

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  processOrder = async (req: Request, res: Response) => {
    try {
      if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({
          error: 'Informe os dados do pedido'
        });
      }

      const result = await this.orderService.execute(req.body);

      return res.json(result);
    } catch (error: unknown) {
      if (error instanceof OrderValidationError) {
        return res.status(400).json({
          error: error.message
        });
      }

      logger.error(
        `Erro ao processar pedido: ${
          error instanceof Error ? error.message : String(error)
        }`
      );

      return res.status(500).json({
        error: 'Erro interno'
      });
    }
  };
}