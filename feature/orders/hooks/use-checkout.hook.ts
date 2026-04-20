"use client"

import { useState, useCallback } from "react"
import type { ICart } from "@/feature/cart/interfaces/cart.interface"
import type { IGeocodeResult } from "../interfaces/geocode-result.interface"
import type { IDeliveryCostResult } from "../interfaces/delivery-cost-result.interface"
import { CheckoutStep } from "../enums/checkout-step.enum"
import { DeliveryType } from "../enums/delivery-type.enum"
import { calculateDeliveryCost } from "../services/delivery.service"
import { createOrder } from "../services/order.service"
import { deliveryTypeToApi } from "../utils/delivery-type-to-api.util"
import {
    EMPTY_GEOCODE_RESULT,
    EMPTY_DELIVERY_COST_RESULT,
    BB_ACTIVE_ORDER_ID_KEY,
} from "../constants/order.constant"

interface UseCheckoutProps {
    tenantSlug: string
    paymentInstructions: string
    cart: ICart
    accessToken: string
    clearCart: () => void
    onOrderPlaced: (orderId: string) => void
}

interface UseCheckoutResult {
    step: CheckoutStep
    selectedDeliveryType: DeliveryType | undefined
    address: string
    geocodeResult: IGeocodeResult
    deliveryCostResult: IDeliveryCostResult
    isCostLoading: boolean
    notes: string
    isSubmitting: boolean
    orderError: string
    handleSelectDeliveryType: (type: DeliveryType) => void
    handleAddressChange: (address: string) => void
    handleMarkerDrag: (lat: number, lng: number) => void
    handleNotesChange: (notes: string) => void
    handleConfirmAddress: () => void
    handlePlaceOrder: () => void
    handleBack: () => void
}

export function useCheckout({
    tenantSlug,
    cart,
    accessToken,
    clearCart,
    onOrderPlaced,
}: UseCheckoutProps): UseCheckoutResult {
    const [step, setStep] = useState<CheckoutStep>(CheckoutStep.DELIVERY_TYPE)
    const [selectedDeliveryType, setSelectedDeliveryType] = useState<DeliveryType>()
    const [address, setAddress] = useState<string>("")
    const [geocodeResult, setGeocodeResult] = useState<IGeocodeResult>(EMPTY_GEOCODE_RESULT)
    const [deliveryCostResult, setDeliveryCostResult] =
        useState<IDeliveryCostResult>(EMPTY_DELIVERY_COST_RESULT)
    const [isCostLoading, setIsCostLoading] = useState<boolean>(false)
    const [notes, setNotes] = useState<string>("")
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [orderError, setOrderError] = useState<string>("")

    const runDeliveryCostCalculation = useCallback(
        async (lat: number, lng: number) => {
            setIsCostLoading(true)
            const result = await calculateDeliveryCost(tenantSlug, lat, lng, accessToken)
            setDeliveryCostResult(result)
            setIsCostLoading(false)
        },
        [tenantSlug, accessToken]
    )

    const handleSelectDeliveryType = useCallback((type: DeliveryType) => {
        setSelectedDeliveryType(type)
        const isPickup = type === DeliveryType.PICKUP
        if (isPickup) {
            setStep(CheckoutStep.BILL)
        } else {
            setStep(CheckoutStep.ADDRESS)
        }
    }, [])

    const handleAddressChange = useCallback((newAddress: string) => {
        setAddress(newAddress)
    }, [])

    const handleMarkerDrag = useCallback(
        async (lat: number, lng: number) => {
            setGeocodeResult((prev) => ({ ...prev, lat, lng }))
            await runDeliveryCostCalculation(lat, lng)
        },
        [runDeliveryCostCalculation]
    )

    const handleNotesChange = useCallback((newNotes: string) => {
        setNotes(newNotes)
    }, [])

    const handleConfirmAddress = useCallback(() => {
        setStep(CheckoutStep.BILL)
    }, [])

    const handlePlaceOrder = useCallback(async () => {
        if (!selectedDeliveryType) return
        setIsSubmitting(true)
        setOrderError("")
        const request = {
            items: cart.items.map((item) => ({
                menuItemId: item.menuItemId,
                quantity: item.quantity,
                note: item.note,
            })),
            deliveryType: deliveryTypeToApi(selectedDeliveryType),
            deliveryAddress: address,
            deliveryLat: geocodeResult.lat,
            deliveryLng: geocodeResult.lng,
            notes,
        }
        const result = await createOrder(tenantSlug, request, accessToken)
        if (!result.success) {
            setOrderError("No pudimos procesar tu pedido. Por favor intenta de nuevo.")
            setIsSubmitting(false)
            return
        }
        localStorage.setItem(BB_ACTIVE_ORDER_ID_KEY, result.orderId)
        clearCart()
        onOrderPlaced(result.orderId)
    }, [
        selectedDeliveryType,
        cart,
        geocodeResult,
        address,
        notes,
        tenantSlug,
        accessToken,
        clearCart,
        onOrderPlaced,
    ])

    const handleBack = useCallback(() => {
        const isOnAddressStep = step === CheckoutStep.ADDRESS
        const isOnBillStep = step === CheckoutStep.BILL
        if (isOnAddressStep || isOnBillStep) {
            setStep(CheckoutStep.DELIVERY_TYPE)
        }
    }, [step])

    return {
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
    }
}
