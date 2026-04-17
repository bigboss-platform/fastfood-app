import type { ICartItem } from "./cart-item.interface"

export interface ICart {
    items: ICartItem[]
    itemCount: number
    subtotal: number
    deliveryCost: number
    total: number
}
