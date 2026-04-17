"use client"

import { useState, useEffect, useCallback } from "react"
import type { IAuthSession } from "../interfaces/auth-session.interface"
import type { ITokenPair } from "../interfaces/token-pair.interface"
import {
    EMPTY_AUTH_SESSION,
    BB_ACCESS_TOKEN_KEY,
    BB_REFRESH_TOKEN_KEY,
} from "../constants/auth.constant"
import { refreshTokens } from "../services/auth.service"
import { isTokenExpired } from "../utils/token-expiry.util"

interface UseAuthResult {
    session: IAuthSession
    isAuthenticated: boolean
    login: (tokenPair: ITokenPair) => void
    logout: () => void
    tryRefresh: () => Promise<boolean>
}

export function useAuth(): UseAuthResult {
    const [session, setSession] = useState<IAuthSession>(EMPTY_AUTH_SESSION)

    useEffect(() => {
        const accessToken = localStorage.getItem(BB_ACCESS_TOKEN_KEY) ?? ""
        const refreshToken = localStorage.getItem(BB_REFRESH_TOKEN_KEY) ?? ""
        const hasAccessToken = Boolean(accessToken)
        if (!hasAccessToken) return
        const tokenIsExpired = isTokenExpired(accessToken)
        if (tokenIsExpired) {
            localStorage.removeItem(BB_ACCESS_TOKEN_KEY)
            localStorage.removeItem(BB_REFRESH_TOKEN_KEY)
            return
        }
        setSession({ accessToken, refreshToken, endUserId: "", isAuthenticated: true })
    }, [])

    const login = useCallback((tokenPair: ITokenPair) => {
        localStorage.setItem(BB_ACCESS_TOKEN_KEY, tokenPair.accessToken)
        localStorage.setItem(BB_REFRESH_TOKEN_KEY, tokenPair.refreshToken)
        setSession({
            accessToken: tokenPair.accessToken,
            refreshToken: tokenPair.refreshToken,
            endUserId: "",
            isAuthenticated: true,
        })
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem(BB_ACCESS_TOKEN_KEY)
        localStorage.removeItem(BB_REFRESH_TOKEN_KEY)
        setSession(EMPTY_AUTH_SESSION)
    }, [])

    const tryRefresh = useCallback(async (): Promise<boolean> => {
        const storedRefreshToken = localStorage.getItem(BB_REFRESH_TOKEN_KEY) ?? ""
        const hasRefreshToken = Boolean(storedRefreshToken)
        if (!hasRefreshToken) {
            logout()
            return false
        }
        const tokenPair = await refreshTokens(storedRefreshToken)
        const hasNewToken = Boolean(tokenPair.accessToken)
        if (!hasNewToken) {
            logout()
            return false
        }
        login(tokenPair)
        return true
    }, [login, logout])

    const isAuthenticated = session.isAuthenticated

    return { session, isAuthenticated, login, logout, tryRefresh }
}
