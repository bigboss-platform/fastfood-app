"use server"

import type { IDeliveryCostResult } from "../interfaces/delivery-cost-result.interface"
import { EMPTY_DELIVERY_COST_RESULT } from "../constants/order.constant"

export async function calculateDeliveryCost(
    slug: string,
    lat: number,
    lng: number,
    accessToken: string
): Promise<IDeliveryCostResult> {
    try {
        const response = await fetch(
            `${process.env.API_BASE_URL}/api/v1/tenants/${slug}/delivery/calculate`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ lat, lng }),
                cache: "no-store",
            }
        )
        if (!response.ok) return EMPTY_DELIVERY_COST_RESULT
        const body: { data?: { cost?: number; within_radius?: boolean } } = await response.json()
        const cost = body.data?.cost ?? 0
        const withinRadius = body.data?.within_radius ?? false
        return { cost, withinRadius }
    } catch {
        return EMPTY_DELIVERY_COST_RESULT
    }
}
