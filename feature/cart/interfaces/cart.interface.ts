import type { ICartItem } from "./cart-item.interface"

export interface ICart {
    items: ICartItem[]
    subtotal: number
    deliveryCost: number
    total: number
}
