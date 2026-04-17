import type { ICart } from "../interfaces/cart.interface"
import type { ICartItem } from "../interfaces/cart-item.interface"

export const EMPTY_CART_ITEM: ICartItem = {
    id: "",
    menuItemId: "",
    menuItemName: "",
    menuItemPhotoUrl: "",
    price: 0,
    quantity: 0,
    note: "",
}

export const EMPTY_CART: ICart = {
    items: [],
    itemCount: 0,
    subtotal: 0,
    deliveryCost: 0,
    total: 0,
}
