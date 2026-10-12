export interface IProduct {
  readonly id: number;
  readonly name: string;
  readonly price: number;

  calculateFreight(): number;
}