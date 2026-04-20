"use client"

import { DeliveryMap } from "./delivery-map.component"
import type { IDeliveryCostResult } from "../interfaces/delivery-cost-result.interface"
import { formatPrice } from "@/feature/cart/utils/format-price.util"
import styles from "../styles/delivery-address.style.module.css"

interface DeliveryAddressProps {
    address: string
    hasCoordinates: boolean
    isCostLoading: boolean
    deliveryCostResult: IDeliveryCostResult
    onAddressChange: (address: string) => void
    onMarkerDrag: (lat: number, lng: number) => void
    onConfirm: () => void
    onBack: () => void
}

export function DeliveryAddress({
    address,
    hasCoordinates,
    isCostLoading,
    deliveryCostResult,
    onAddressChange,
    onMarkerDrag,
    onConfirm,
    onBack,
}: DeliveryAddressProps) {
    const hasAddress = Boolean(address.trim())
    const isOutsideRadius = hasCoordinates && !isCostLoading && !deliveryCostResult.withinRadius
    const hasDeliveryCost = hasCoordinates && !isCostLoading && deliveryCostResult.withinRadius
    const canConfirm = hasAddress && deliveryCostResult.withinRadius

    return (
        <div className={styles.deliveryAddress}>
            <button type="button" className={styles.backButton} onClick={onBack}>
                Volver
            </button>
            <h2 className={styles.title}>¿A dónde te llevamos?</h2>
            <div className={styles.inputWrapper}>
                <input
                    data-testid="delivery-address-input"
                    type="text"
                    className={styles.input}
                    value={address}
                    onChange={(event) => onAddressChange(event.target.value)}
                    placeholder="Ingresa tu dirección"
                    required
                />
            </div>
            <DeliveryMap onMarkerDrag={onMarkerDrag} />
            {isOutsideRadius && (
                <p className={styles.outsideRadiusMessage}>
                    Lo sentimos, no llegamos a esa dirección
                </p>
            )}
            {hasDeliveryCost && (
                <p data-testid="delivery-cost" className={styles.deliveryCost}>
                    Costo de envío: {formatPrice(deliveryCostResult.cost)}
                </p>
            )}
            <button
                data-testid="confirm-address-button"
                type="button"
                className={styles.confirmButton}
                onClick={onConfirm}
                disabled={!canConfirm}
            >
                Continuar
            </button>
        </div>
    )
}
