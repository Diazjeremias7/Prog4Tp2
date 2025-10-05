import { PizzaSize } from "../types/types";

export class OrderService {
    calculatePrice(size: PizzaSize, toppings: string[]): number {
        if (size === 'S') return 10;
        return 0;
    }
}