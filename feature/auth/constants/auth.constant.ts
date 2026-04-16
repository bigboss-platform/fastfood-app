import type { IAuthSession } from "../interfaces/auth-session.interface"

export const EMPTY_AUTH_SESSION: IAuthSession = {
    accessToken: "",
    refreshToken: "",
    endUserId: "",
    isAuthenticated: false,
}

export const OTP_CODE_LENGTH = 6
