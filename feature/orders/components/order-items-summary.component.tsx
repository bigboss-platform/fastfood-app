"use client"

import type { IOrder } from "../interfaces/order.interface"
import { DeliveryType } from "../enums/delivery-type.enum"
import { formatPrice } from "@/feature/cart/utils/format-price.util"
import styles from "../styles/active-order.style.module.css"

interface OrderItemsSummaryProps {
    order: IOrder
}

export function OrderItemsSummary({ order }: OrderItemsSummaryProps) {
    const isPickup = order.deliveryType === DeliveryType.PICKUP
    const deliveryLabel = isPickup ? "Recoger en tienda" : "Envío a domicilio"
    const hasDeliveryAddress = Boolean(order.deliveryAddress)

    return (
        <div className={styles.summarySection}>
            <h3 className={styles.summaryTitle}>Tu pedido</h3>
            <div data-testid="active-order-items" className={styles.itemsList}>
                {order.items.map((item) => (
                    <div key={item.id} className={styles.itemRow}>
                        <span className={styles.itemName}>{item.menuItemName}</span>
                        <span className={styles.itemQuantity}>x{item.quantity}</span>
                        <span className={styles.itemPrice}>
                            {formatPrice(item.menuItemPrice * item.quantity)}
                        </span>
                    </div>
                ))}
            </div>
            <div className={styles.totalRow}>
                <span>Total</span>
                <span className={styles.totalAmount}>{formatPrice(order.total)}</span>
            </div>
            <div className={styles.deliveryInfo}>
                <span>{deliveryLabel}</span>
                {hasDeliveryAddress && (
                    <span className={styles.deliveryAddress}>{order.deliveryAddress}</span>
                )}
            </div>
        </div>
    )
}
