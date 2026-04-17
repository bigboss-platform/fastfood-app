"use server"

import type { ITokenPair } from "../interfaces/token-pair.interface"
import type { IVerifyOtpResult } from "../interfaces/verify-otp-result.interface"
import { EMPTY_TOKEN_PAIR } from "../constants/auth.constant"
import { OtpErrorCode } from "../enums/otp-error-code.enum"

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

function toOtpErrorCode(code: string): OtpErrorCode {
    if (code === "wrong_code") return OtpErrorCode.WRONG_CODE
    if (code === "expired") return OtpErrorCode.EXPIRED
    if (code === "max_attempts") return OtpErrorCode.MAX_ATTEMPTS
    return OtpErrorCode.UNKNOWN
}

export async function verifyOtp(
    phoneNumber: string,
    code: string,
    tenantId: string
): Promise<IVerifyOtpResult> {
    try {
        const response = await fetch(`${process.env.API_BASE_URL}/api/v1/auth/otp/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone_number: phoneNumber, code, tenant_id: tenantId }),
            cache: "no-store",
        })
        if (!response.ok) {
            const errorBody: { error_code?: string } = await response.json().catch(() => ({}))
            const errorCode = toOtpErrorCode(errorBody.error_code ?? "")
            return { tokenPair: EMPTY_TOKEN_PAIR, errorCode }
        }
        const body: { access_token?: string; refresh_token?: string } = await response.json()
        const accessToken = body.access_token ?? ""
        const hasAccessToken = Boolean(accessToken)
        if (!hasAccessToken) return { tokenPair: EMPTY_TOKEN_PAIR, errorCode: OtpErrorCode.UNKNOWN }
        return {
            tokenPair: { accessToken, refreshToken: body.refresh_token ?? "" },
            errorCode: OtpErrorCode.NONE,
        }
    } catch {
        return { tokenPair: EMPTY_TOKEN_PAIR, errorCode: OtpErrorCode.UNKNOWN }
    }
}

export async function refreshTokens(refreshToken: string): Promise<ITokenPair> {
    try {
        const response = await fetch(`${process.env.API_BASE_URL}/api/v1/auth/token/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
            cache: "no-store",
        })
        if (!response.ok) return EMPTY_TOKEN_PAIR
        const body: { access_token?: string; refresh_token?: string } = await response.json()
        const accessToken = body.access_token ?? ""
        const hasAccessToken = Boolean(accessToken)
        if (!hasAccessToken) return EMPTY_TOKEN_PAIR
        return { accessToken, refreshToken: body.refresh_token ?? "" }
    } catch {
        return EMPTY_TOKEN_PAIR
    }
}
