"use server"

import type { IMenu } from "../interfaces/menu.interface"
import { EMPTY_MENU } from "../constants/menu-item.constant"

export async function fetchMenu(tenantSlug: string): Promise<IMenu> {
    const response = await fetch(
        `${process.env.API_BASE_URL}/api/v1/tenants/${tenantSlug}/menu`,
        { cache: "no-store" }
    ).catch(() => null)

    if (!response?.ok) {
        return EMPTY_MENU
    }

    const body = await response.json().catch(() => null)
    if (!body?.data) {
        return EMPTY_MENU
    }

    return body.data as IMenu
}
