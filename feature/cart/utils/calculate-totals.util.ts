import type { ICart } from "../interfaces/cart.interface"
import type { ICartItem } from "../interfaces/cart-item.interface"

export function calculateTotals(items: ICartItem[], deliveryCost: number): ICart {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    return {
        items,
        itemCount,
        subtotal,
        deliveryCost,
        total: subtotal + deliveryCost,
    }
}
