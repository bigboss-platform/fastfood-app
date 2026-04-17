"use server"

import type { IMenu } from "../interfaces/menu.interface"
import { EMPTY_MENU } from "../constants/menu-item.constant"

export async function fetchMenu(tenantSlug: string): Promise<IMenu> {
    try {
        const response = await fetch(
            `${process.env.API_BASE_URL}/api/v1/tenants/${tenantSlug}/menu`,
            { cache: "no-store" }
        )
        if (!response.ok) return EMPTY_MENU
        const body: { data?: IMenu } = await response.json()
        if (typeof body.data === "undefined") return EMPTY_MENU
        return body.data
    } catch {
        return EMPTY_MENU
    }
}
