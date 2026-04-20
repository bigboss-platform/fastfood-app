import type { IOrder } from "../interfaces/order.interface"
import type { IGeocodeResult } from "../interfaces/geocode-result.interface"
import type { IDeliveryCostResult } from "../interfaces/delivery-cost-result.interface"
import type { ICreateOrderResult } from "../interfaces/create-order-result.interface"
import type { IFetchOrderResult } from "../interfaces/fetch-order-result.interface"
import { OrderStatus } from "../enums/order-status.enum"
import { DeliveryType } from "../enums/delivery-type.enum"
import { PaymentStatus } from "../enums/payment-status.enum"

export const BB_ACTIVE_ORDER_ID_KEY = "bb_active_order_id"

export const EMPTY_GEOCODE_RESULT: IGeocodeResult = {
    lat: 0,
    lng: 0,
    formattedAddress: "",
}

export const EMPTY_DELIVERY_COST_RESULT: IDeliveryCostResult = {
    cost: 0,
    withinRadius: false,
}

export const EMPTY_CREATE_ORDER_RESULT: ICreateOrderResult = {
    orderId: "",
    success: false,
}

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

export const EMPTY_FETCH_ORDER_RESULT: IFetchOrderResult = {
    order: EMPTY_ORDER,
    notFound: false,
}

export const ORDER_STATUS_DISPLAY: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: "Recibido",
    [OrderStatus.CONFIRMED]: "Confirmado",
    [OrderStatus.PREPARING]: "Preparando tu pedido",
    [OrderStatus.READY]: "Listo para recoger",
    [OrderStatus.DELIVERED]: "Entregado",
    [OrderStatus.CANCELLED]: "Cancelado",
}
