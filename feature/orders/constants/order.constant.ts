import type { IOrder } from "../interfaces/order.interface"
import { OrderStatus } from "../enums/order-status.enum"
import { DeliveryType } from "../enums/delivery-type.enum"
import { PaymentStatus } from "../enums/payment-status.enum"

export const EMPTY_ORDER: IOrder = {
    id: "",
    endUserId: "",
    status: OrderStatus.PENDING,
    deliveryType: DeliveryType.PICKUP,
    deliveryAddress: "",
    deliveryCost: 0,
    subtotal: 0,
    total: 0,
    notes: "",
    paymentStatus: PaymentStatus.PENDING,
    items: [],
    createdAt: "",
}

export const ORDER_STATUS_DISPLAY: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: "Esperando confirmación",
    [OrderStatus.CONFIRMED]: "Pedido confirmado",
    [OrderStatus.PREPARING]: "En preparación",
    [OrderStatus.READY]: "¡Listo!",
    [OrderStatus.DELIVERED]: "Entregado",
    [OrderStatus.CANCELLED]: "Cancelado",
}
