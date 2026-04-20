"use client"

import type { IOrder } from "../interfaces/order.interface"
import { OrderStatus } from "../enums/order-status.enum"
import { getOrderStatusLabel } from "../utils/order-status-label.util"
import { ORDER_STATUS_DISPLAY } from "../constants/order.constant"
import styles from "../styles/active-order.style.module.css"

const STATUS_STEPS = [
    OrderStatus.PENDING,
    OrderStatus.CONFIRMED,
    OrderStatus.PREPARING,
    OrderStatus.READY,
    OrderStatus.DELIVERED,
]

interface OrderStatusDisplayProps {
    order: IOrder
}

export function OrderStatusDisplay({ order }: OrderStatusDisplayProps) {
    const isCancelled = order.status === OrderStatus.CANCELLED
    const currentStepIndex = STATUS_STEPS.indexOf(order.status)
    const statusLabel = getOrderStatusLabel(order.status, order.deliveryType)

    return (
        <div className={styles.statusSection}>
            <p data-testid="order-status" className={styles.statusLabel}>
                {statusLabel}
            </p>
            {isCancelled ? (
                <p className={styles.cancelledMessage}>Tu pedido fue cancelado.</p>
            ) : (
                <div className={styles.progressSteps}>
                    {STATUS_STEPS.map((step, index) => {
                        const isCompleted = index < currentStepIndex
                        const isActive = index === currentStepIndex
                        const stepLabel = ORDER_STATUS_DISPLAY[step]
                        return (
                            <div
                                key={step}
                                className={`${styles.progressStep} ${isCompleted ? styles.stepCompleted : ""} ${isActive ? styles.stepActive : ""}`}
                            >
                                <div className={styles.stepDot} />
                                <span className={styles.stepText}>{stepLabel}</span>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
