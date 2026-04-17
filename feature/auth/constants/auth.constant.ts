import type { IAuthSession } from "../interfaces/auth-session.interface"
import type { ITokenPair } from "../interfaces/token-pair.interface"

export const EMPTY_AUTH_SESSION: IAuthSession = {
    accessToken: "",
    refreshToken: "",
    endUserId: "",
    isAuthenticated: false,
}

export const EMPTY_TOKEN_PAIR: ITokenPair = {
    accessToken: "",
    refreshToken: "",
}

export const OTP_CODE_LENGTH = 6
export const BB_ACCESS_TOKEN_KEY = "bb_access_token"
export const BB_REFRESH_TOKEN_KEY = "bb_refresh_token"
