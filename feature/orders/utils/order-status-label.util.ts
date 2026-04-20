import { OrderStatus } from "../enums/order-status.enum"
import { DeliveryType } from "../enums/delivery-type.enum"
import { ORDER_STATUS_DISPLAY } from "../constants/order.constant"

export function getOrderStatusLabel(status: OrderStatus, deliveryType: DeliveryType): string {
    const isReadyForDelivery =
        status === OrderStatus.READY && deliveryType === DeliveryType.DELIVERY
    if (isReadyForDelivery) return "En camino"
    return ORDER_STATUS_DISPLAY[status]
}
