"use server"

import type { IMenu } from "../interfaces/menu.interface"
import { EMPTY_MENU } from "../constants/menu-item.constant"
import { TENANT_SLUG } from "@/feature/shared/constants/tenant.constant"

export async function fetchMenu(): Promise<IMenu> {
    try {
        const response = await fetch(
            `${process.env.API_BASE_URL}/api/v1/tenants/${TENANT_SLUG}/menu`,
            { cache: "no-store" }
        )
        if (!response.ok) return EMPTY_MENU
        const body: { data?: IMenu } = await response.json()
        const menuData = body.data
        if (!menuData) return EMPTY_MENU
        return menuData
    } catch {
        return EMPTY_MENU
    }
}
