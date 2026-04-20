"use client"

import { DeliveryType } from "../enums/delivery-type.enum"
import styles from "../styles/delivery-options.style.module.css"

interface DeliveryOptionsProps {
    selectedDeliveryType: DeliveryType | undefined
    onSelect: (type: DeliveryType) => void
}

export function DeliveryOptions({ selectedDeliveryType, onSelect }: DeliveryOptionsProps) {
    const isPickupSelected = selectedDeliveryType === DeliveryType.PICKUP
    const isDeliverySelected = selectedDeliveryType === DeliveryType.DELIVERY

    return (
        <div data-testid="delivery-options" className={styles.deliveryOptions}>
            <h2 className={styles.title}>¿Cómo quieres recibir tu pedido?</h2>
            <div className={styles.optionsGrid}>
                <button
                    data-testid="delivery-type-pickup"
                    type="button"
                    className={`${styles.option} ${isPickupSelected ? styles.optionSelected : ""}`}
                    onClick={() => onSelect(DeliveryType.PICKUP)}
                >
                    <span className={styles.optionLabel}>Recoger en tienda</span>
                </button>
                <button
                    data-testid="delivery-type-delivery"
                    type="button"
                    className={`${styles.option} ${isDeliverySelected ? styles.optionSelected : ""}`}
                    onClick={() => onSelect(DeliveryType.DELIVERY)}
                >
                    <span className={styles.optionLabel}>A domicilio</span>
                </button>
            </div>
        </div>
    )
}
