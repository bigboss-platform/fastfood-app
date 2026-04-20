"use client"

import type { ICart } from "@/feature/cart/interfaces/cart.interface"
import type { IDeliveryCostResult } from "../interfaces/delivery-cost-result.interface"
import { DeliveryType } from "../enums/delivery-type.enum"
import { formatPrice } from "@/feature/cart/utils/format-price.util"
import styles from "../styles/bill-screen.style.module.css"

interface BillScreenProps {
    cart: ICart
    deliveryType: DeliveryType
    deliveryCostResult: IDeliveryCostResult
    paymentInstructions: string
    notes: string
    isSubmitting: boolean
    orderError: string
    onNotesChange: (notes: string) => void
    onConfirm: () => void
    onBack: () => void
}

export function BillScreen({
    cart,
    deliveryType,
    deliveryCostResult,
    paymentInstructions,
    notes,
    isSubmitting,
    orderError,
    onNotesChange,
    onConfirm,
    onBack,
}: BillScreenProps) {
    const isPickup = deliveryType === DeliveryType.PICKUP
    const deliveryCostLabel = isPickup ? "Recoger en tienda" : formatPrice(deliveryCostResult.cost)
    const displayDeliveryCost = isPickup ? 0 : deliveryCostResult.cost
    const displayTotal = cart.subtotal + displayDeliveryCost
    const hasPaymentInstructions = Boolean(paymentInstructions)
    const hasOrderError = Boolean(orderError)

    return (
        <div className={styles.billScreen}>
            <button
                type="button"
                className={styles.backButton}
                onClick={onBack}
                disabled={isSubmitting}
            >
                Volver
            </button>
            <h2 className={styles.title}>Resumen del pedido</h2>

            <div className={styles.itemsList}>
                {cart.items.map((item) => {
                    const lineTotal = item.price * item.quantity
                    return (
                        <div key={item.id} className={styles.itemRow}>
                            <div className={styles.itemInfo}>
                                <span className={styles.itemName}>{item.menuItemName}</span>
                                <span className={styles.itemQuantity}>x{item.quantity}</span>
                            </div>
                            <div className={styles.itemPrices}>
                                <span className={styles.itemUnitPrice}>
                                    {formatPrice(item.price)} c/u
                                </span>
                                <span className={styles.itemLineTotal}>{formatPrice(lineTotal)}</span>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className={styles.totals}>
                <div className={styles.totalRow}>
                    <span>Subtotal</span>
                    <span>{formatPrice(cart.subtotal)}</span>
                </div>
                <div className={styles.totalRow}>
                    <span>Envío</span>
                    <span>{deliveryCostLabel}</span>
                </div>
                <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                    <span>Total</span>
                    <span>{formatPrice(displayTotal)}</span>
                </div>
            </div>

            <textarea
                data-testid="order-notes"
                className={styles.notesInput}
                placeholder="Notas del pedido (opcional)"
                value={notes}
                onChange={(event) => onNotesChange(event.target.value)}
                disabled={isSubmitting}
            />

            {hasPaymentInstructions && (
                <p className={styles.paymentInstructions}>{paymentInstructions}</p>
            )}

            {hasOrderError && <p className={styles.orderError}>{orderError}</p>}

            <p className={styles.disclaimer}>
                Al ordenar, aceptas nuestros Términos y Condiciones
            </p>

            <button
                data-testid="confirm-order-button"
                type="button"
                className={styles.confirmButton}
                onClick={onConfirm}
                disabled={isSubmitting}
            >
                {isSubmitting ? <span className={styles.spinner} /> : "Confirmar pedido"}
            </button>
        </div>
    )
}
