"use client"

import type { ICart } from "@/feature/cart/interfaces/cart.interface"
import { useCheckout } from "../hooks/use-checkout.hook"
import { DeliveryOptions } from "../components/delivery-options.component"
import { DeliveryAddress } from "../components/delivery-address.component"
import { BillScreen } from "../components/bill-screen.component"
import { CheckoutStep } from "../enums/checkout-step.enum"
import { DeliveryType } from "../enums/delivery-type.enum"

interface CheckoutContainerProps {
    tenantSlug: string
    cart: ICart
    accessToken: string
    clearCart: () => void
    onOrderPlaced: (orderId: string) => void
}

export function CheckoutContainer({
    tenantSlug,
    cart,
    accessToken,
    clearCart,
    onOrderPlaced,
}: CheckoutContainerProps) {
    const {
        step,
        selectedDeliveryType,
        address,
        geocodeResult,
        deliveryCostResult,
        isCostLoading,
        notes,
        isSubmitting,
        orderError,
        handleSelectDeliveryType,
        handleAddressChange,
        handleMarkerDrag,
        handleNotesChange,
        handleConfirmAddress,
        handlePlaceOrder,
        handleBack,
    } = useCheckout({
        tenantSlug,
        paymentInstructions: "",
        cart,
        accessToken,
        clearCart,
        onOrderPlaced,
    })

    const hasCoordinates = Boolean(geocodeResult.lat) || Boolean(geocodeResult.lng)
    const deliveryType = selectedDeliveryType ?? DeliveryType.PICKUP

    if (step === CheckoutStep.DELIVERY_TYPE) {
        return (
            <DeliveryOptions
                selectedDeliveryType={selectedDeliveryType}
                onSelect={handleSelectDeliveryType}
            />
        )
    }

    if (step === CheckoutStep.ADDRESS) {
        return (
            <DeliveryAddress
                address={address}
                hasCoordinates={hasCoordinates}
                isCostLoading={isCostLoading}
                deliveryCostResult={deliveryCostResult}
                onAddressChange={handleAddressChange}
                onMarkerDrag={handleMarkerDrag}
                onConfirm={handleConfirmAddress}
                onBack={handleBack}
            />
        )
    }

    return (
        <BillScreen
            cart={cart}
            deliveryType={deliveryType}
            deliveryCostResult={deliveryCostResult}
            paymentInstructions=""
            notes={notes}
            isSubmitting={isSubmitting}
            orderError={orderError}
            onNotesChange={handleNotesChange}
            onConfirm={handlePlaceOrder}
            onBack={handleBack}
        />
    )
}
