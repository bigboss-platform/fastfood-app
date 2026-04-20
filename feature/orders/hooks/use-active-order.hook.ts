"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useAuth } from "@/feature/auth/hooks/use-auth.hook"
import type { IOrder } from "../interfaces/order.interface"
import { OrderStatus } from "../enums/order-status.enum"
import { fetchOrder } from "../services/order.service"
import { EMPTY_ORDER, BB_ACTIVE_ORDER_ID_KEY } from "../constants/order.constant"

const TERMINAL_STATUSES: OrderStatus[] = [OrderStatus.DELIVERED, OrderStatus.CANCELLED]
const POLL_INTERVAL_MS = 15_000

interface UseActiveOrderProps {
    orderId: string
    tenantSlug: string
    onNotFound: () => void
}

interface UseActiveOrderResult {
    order: IOrder
    isLoading: boolean
    handleDismiss: () => void
}

export function useActiveOrder({
    orderId,
    tenantSlug,
    onNotFound,
}: UseActiveOrderProps): UseActiveOrderResult {
    const [order, setOrder] = useState<IOrder>(EMPTY_ORDER)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { session } = useAuth()
    const pollingTimer = useRef<{ id: ReturnType<typeof setInterval> | 0 }>({ id: 0 })

    const stopPolling = useCallback(() => {
        const hasTimer = Boolean(pollingTimer.current.id)
        if (!hasTimer) return
        clearInterval(pollingTimer.current.id as ReturnType<typeof setInterval>)
        pollingTimer.current.id = 0
    }, [])

    const loadOrder = useCallback(async () => {
        const hasAccessToken = Boolean(session.accessToken)
        if (!hasAccessToken) return
        const result = await fetchOrder(tenantSlug, orderId, session.accessToken)
        if (result.notFound) {
            stopPolling()
            localStorage.removeItem(BB_ACTIVE_ORDER_ID_KEY)
            onNotFound()
            return
        }
        setOrder(result.order)
        setIsLoading(false)
        const isTerminal = TERMINAL_STATUSES.includes(result.order.status)
        if (isTerminal) {
            stopPolling()
        }
    }, [tenantSlug, orderId, session.accessToken, stopPolling, onNotFound])

    useEffect(() => {
        loadOrder()
        pollingTimer.current.id = setInterval(loadOrder, POLL_INTERVAL_MS)
        return stopPolling
    }, [loadOrder, stopPolling])

    const handleDismiss = useCallback(() => {
        stopPolling()
        localStorage.removeItem(BB_ACTIVE_ORDER_ID_KEY)
    }, [stopPolling])

    return { order, isLoading, handleDismiss }
}
