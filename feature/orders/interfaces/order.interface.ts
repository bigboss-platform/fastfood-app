import type { IOrderItem } from "./order-item.interface"
import type { OrderStatus } from "../enums/order-status.enum"
import type { DeliveryType } from "../enums/delivery-type.enum"
import type { PaymentStatus } from "../enums/payment-status.enum"

export interface IOrder {
    id: string
    endUserId: string
    status: OrderStatus
    deliveryType: DeliveryType
    deliveryAddress: string
    deliveryCost: number
    subtotal: number
    total: number
    notes: string
    paymentStatus: PaymentStatus
    items: IOrderItem[]
    createdAt: string
}
