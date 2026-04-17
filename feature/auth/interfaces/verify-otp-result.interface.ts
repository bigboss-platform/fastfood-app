import type { ITokenPair } from "./token-pair.interface"
import type { OtpErrorCode } from "../enums/otp-error-code.enum"

export interface IVerifyOtpResult {
    tokenPair: ITokenPair
    errorCode: OtpErrorCode
}
