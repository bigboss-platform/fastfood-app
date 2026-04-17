"use server"

import type { IAuthSession } from "../interfaces/auth-session.interface"
import { EMPTY_AUTH_SESSION } from "../constants/auth.constant"

export async function requestOtp(
    phoneNumber: string,
    tenantId: string
): Promise<{ expiresInSeconds: number }> {
    try {
        const response = await fetch(`${process.env.API_BASE_URL}/api/v1/auth/otp/request`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone_number: phoneNumber, tenant_id: tenantId }),
            cache: "no-store",
        })
        if (!response.ok) return { expiresInSeconds: 0 }
        const body: { data?: { expires_in_seconds?: number } } = await response.json()
        return { expiresInSeconds: body.data?.expires_in_seconds ?? 0 }
    } catch {
        return { expiresInSeconds: 0 }
    }
}

export async function verifyOtp(
    phoneNumber: string,
    code: string,
    tenantId: string
): Promise<IAuthSession> {
    try {
        const response = await fetch(`${process.env.API_BASE_URL}/api/v1/auth/otp/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone_number: phoneNumber, code, tenant_id: tenantId }),
            cache: "no-store",
        })
        if (!response.ok) return EMPTY_AUTH_SESSION
        const body: { access_token?: string; refresh_token?: string } = await response.json()
        if (typeof body.access_token === "undefined") return EMPTY_AUTH_SESSION
        return {
            accessToken: body.access_token,
            refreshToken: body.refresh_token ?? "",
            endUserId: "",
            isAuthenticated: true,
        }
    } catch {
        return EMPTY_AUTH_SESSION
    }
}
