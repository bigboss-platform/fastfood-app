"use client"

import { OrderStatus } from "../enums/order-status.enum"
import { useActiveOrder } from "../hooks/use-active-order.hook"
import { OrderStatusDisplay } from "../components/order-status-display.component"
import { OrderItemsSummary } from "../components/order-items-summary.component"
import styles from "../styles/active-order.style.module.css"

interface ActiveOrderContainerProps {
    orderId: string
    tenantSlug: string
    whatsappNumber: string
    onReturnToMenu: () => void
}

export function ActiveOrderContainer({
    orderId,
    tenantSlug,
    whatsappNumber,
    onReturnToMenu,
}: ActiveOrderContainerProps) {
    const { order, isLoading, handleDismiss } = useActiveOrder({
        orderId,
        tenantSlug,
        onNotFound: onReturnToMenu,
    })

    function handleReturnToMenu() {
        handleDismiss()
        onReturnToMenu()
    }

    const isDelivered = order.status === OrderStatus.DELIVERED
    const isCancelled = order.status === OrderStatus.CANCELLED
    const hasWhatsapp = Boolean(whatsappNumber)
    const whatsappText = encodeURIComponent(
        `Hola, tengo una pregunta sobre mi pedido #${orderId}`
    )
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappText}`

    if (isLoading) {
        return (
            <div data-testid="active-order-view" className={styles.activeOrder}>
                <div className={styles.loadingState}>
                    <span className={styles.loadingSpinner} />
                </div>
            </div>
        )
    }

    return (
        <div data-testid="active-order-view" className={styles.activeOrder}>
            <header className={styles.header}>
                <h1 className={styles.headerTitle}>Pedido en curso</h1>
                {hasWhatsapp && (
                    <a
                        data-testid="whatsapp-contact"
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.whatsappButton}
                    >
                        WhatsApp
                    </a>
                )}
            </header>

            <OrderStatusDisplay order={order} />
            <OrderItemsSummary order={order} />

            {isDelivered && (
                <div className={styles.terminalState}>
                    <p className={styles.completedMessage}>¡Tu pedido fue entregado! Gracias.</p>
                    <button
                        data-testid="new-order-button"
                        type="button"
                        className={styles.returnButton}
                        onClick={handleReturnToMenu}
                    >
                        Hacer otro pedido
                    </button>
                </div>
            )}

            {isCancelled && (
                <div className={styles.terminalState}>
                    <button
                        type="button"
                        className={styles.returnButton}
                        onClick={handleReturnToMenu}
                    >
                        Volver al menú
                    </button>
                </div>
            )}
        </div>
    )
}
