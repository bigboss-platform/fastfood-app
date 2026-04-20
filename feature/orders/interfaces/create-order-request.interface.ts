import type { ICreateOrderItem } from "./create-order-item.interface"

export interface ICreateOrderRequest {
    items: ICreateOrderItem[]
    deliveryType: string
    deliveryAddress: string
    deliveryLat: number
    deliveryLng: number
    notes: string
}
