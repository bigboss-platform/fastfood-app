"use server"

import type { ICreateOrderRequest } from "../interfaces/create-order-request.interface"
import type { ICreateOrderResult } from "../interfaces/create-order-result.interface"
import type { IFetchOrderResult } from "../interfaces/fetch-order-result.interface"
import type { IOrderItem } from "../interfaces/order-item.interface"
import type { OrderStatus } from "../enums/order-status.enum"
import type { DeliveryType } from "../enums/delivery-type.enum"
import type { PaymentStatus } from "../enums/payment-status.enum"
import {
    EMPTY_CREATE_ORDER_RESULT,
    EMPTY_FETCH_ORDER_RESULT,
    EMPTY_ORDER,
} from "../constants/order.constant"

export async function createOrder(
    slug: string,
    request: ICreateOrderRequest,
    accessToken: string
): Promise<ICreateOrderResult> {
    try {
        const response = await fetch(
            `${process.env.API_BASE_URL}/api/v1/tenants/${slug}/orders`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    items: request.items.map((item) => ({
                        menu_item_id: item.menuItemId,
                        quantity: item.quantity,
                        note: item.note,
                    })),
                    delivery_type: request.deliveryType,
                    delivery_address: request.deliveryAddress,
                    delivery_lat: request.deliveryLat,
                    delivery_lng: request.deliveryLng,
                    notes: request.notes,
                }),
                cache: "no-store",
            }
        )
        if (!response.ok) return EMPTY_CREATE_ORDER_RESULT
        const body: { data?: { id?: string } } = await response.json()
        const orderId = body.data?.id ?? ""
        const hasOrderId = Boolean(orderId)
        if (!hasOrderId) return EMPTY_CREATE_ORDER_RESULT
        return { orderId, success: true }
    } catch {
        return EMPTY_CREATE_ORDER_RESULT
    }
}

type OrderItemBody = {
    id?: string
    menu_item_id?: string
    menu_item_name?: string
    menu_item_price?: number
    quantity?: number
    note?: string
}

type OrderBody = {
    data?: {
        id?: string
        end_user_id?: string
        status?: string
        delivery_type?: string
        delivery_address?: string
        delivery_cost?: number
        subtotal?: number
        total?: number
        notes?: string
        payment_status?: string
        items?: OrderItemBody[]
        created_at?: string
    }
}

export async function fetchOrder(
    slug: string,
    orderId: string,
    accessToken: string
): Promise<IFetchOrderResult> {
    try {
        const response = await fetch(
            `${process.env.API_BASE_URL}/api/v1/tenants/${slug}/orders/${orderId}`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
                cache: "no-store",
            }
        )
        const isNotFound = response.status === 404
        if (isNotFound) return { order: EMPTY_ORDER, notFound: true }
        if (!response.ok) return EMPTY_FETCH_ORDER_RESULT
        const body: OrderBody = await response.json()
        const data = body.data
        if (!data) return EMPTY_FETCH_ORDER_RESULT
        const items: IOrderItem[] = (data.items ?? []).map((item) => ({
            id: item.id ?? "",
            menuItemId: item.menu_item_id ?? "",
            menuItemName: item.menu_item_name ?? "",
            menuItemPrice: item.menu_item_price ?? 0,
            quantity: item.quantity ?? 0,
            note: item.note ?? "",
        }))
        return {
            order: {
                id: data.id ?? "",
                endUserId: data.end_user_id ?? "",
                status: (data.status ?? "") as OrderStatus,
                deliveryType: (data.delivery_type ?? "") as DeliveryType,
                deliveryAddress: data.delivery_address ?? "",
                deliveryCost: data.delivery_cost ?? 0,
                subtotal: data.subtotal ?? 0,
                total: data.total ?? 0,
                notes: data.notes ?? "",
                paymentStatus: (data.payment_status ?? "") as PaymentStatus,
                items,
                createdAt: data.created_at ?? "",
            },
            notFound: false,
        }
    } catch {
        return EMPTY_FETCH_ORDER_RESULT
    }
}
