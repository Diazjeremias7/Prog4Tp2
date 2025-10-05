import { PizzaSize } from "../types/types";

export class OrderService {
    calculatePrice(size: PizzaSize, toppings: string[]): number {
        const basePrices: Record<PizzaSize, number> = {
            S: 10,
            M: 15,
            L: 20
        };

        const basePrice = basePrices[size];
        const toppingsPrice = toppings.length * 2;

        return basePrice + toppingsPrice;
    }
}