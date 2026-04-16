"use server"

import type { IAuthSession } from "../interfaces/auth-session.interface"
import { EMPTY_AUTH_SESSION } from "../constants/auth.constant"

export async function requestOtp(
    phoneNumber: string,
    tenantId: string
): Promise<{ expiresInSeconds: number }> {
    const response = await fetch(`${process.env.API_BASE_URL}/api/v1/auth/otp/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: phoneNumber, tenant_id: tenantId }),
        cache: "no-store",
    }).catch(() => null)

    if (!response?.ok) {
        return { expiresInSeconds: 0 }
    }

    const body = await response.json().catch(() => null)
    return { expiresInSeconds: body?.data?.expires_in_seconds ?? 0 }
}

export async function verifyOtp(
    phoneNumber: string,
    code: string,
    tenantId: string
): Promise<IAuthSession> {
    const response = await fetch(`${process.env.API_BASE_URL}/api/v1/auth/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: phoneNumber, code, tenant_id: tenantId }),
        cache: "no-store",
    }).catch(() => null)

    if (!response?.ok) {
        return EMPTY_AUTH_SESSION
    }

    const body = await response.json().catch(() => null)
    if (!body?.access_token) {
        return EMPTY_AUTH_SESSION
    }

    return {
        accessToken: body.access_token,
        refreshToken: body.refresh_token,
        endUserId: "",
        isAuthenticated: true,
    }
}
