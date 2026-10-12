import { IProduct } from './IProduct';

export class PhysicalProduct implements IProduct {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly price: number
  ) {}

  calculateFreight(): number {
    return 10;
  }
}