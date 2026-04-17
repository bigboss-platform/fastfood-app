"use client"

import { useState, useEffect } from "react"
import type { ITokenPair } from "../interfaces/token-pair.interface"
import { verifyOtp } from "../services/auth.service"
import { OtpErrorCode } from "../enums/otp-error-code.enum"
import { OTP_CODE_LENGTH } from "../constants/auth.constant"
import styles from "../styles/auth-flow.style.module.css"

interface OtpCodeStepProps {
    phone: string
    tenantId: string
    onSuccess: (tokenPair: ITokenPair) => void
    onBack: () => void
}

const ERROR_MESSAGES: Record<OtpErrorCode, string> = {
    [OtpErrorCode.NONE]: "",
    [OtpErrorCode.WRONG_CODE]: "Código incorrecto",
    [OtpErrorCode.EXPIRED]: "Código expirado, solicita uno nuevo",
    [OtpErrorCode.MAX_ATTEMPTS]: "Demasiados intentos, solicita un nuevo código",
    [OtpErrorCode.UNKNOWN]: "Error al verificar el código. Intenta de nuevo.",
}

export function OtpCodeStep({ phone, tenantId, onSuccess, onBack }: OtpCodeStepProps) {
    const [code, setCode] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [errorCode, setErrorCode] = useState<OtpErrorCode>(OtpErrorCode.NONE)
    const [shouldGoBack, setShouldGoBack] = useState<boolean>(false)

    useEffect(() => {
        if (!shouldGoBack) return
        const timeoutId = setTimeout(() => {
            onBack()
        }, 2000)
        return () => clearTimeout(timeoutId)
    }, [shouldGoBack, onBack])

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault()
        const hasFullCode = code.length === OTP_CODE_LENGTH
        if (!hasFullCode) {
            setErrorCode(OtpErrorCode.UNKNOWN)
            return
        }
        setIsLoading(true)
        setErrorCode(OtpErrorCode.NONE)
        const result = await verifyOtp(phone, code, tenantId)
        setIsLoading(false)
        const hasErrorCode = Boolean(result.errorCode)
        if (!hasErrorCode) {
            onSuccess(result.tokenPair)
            return
        }
        setErrorCode(result.errorCode)
        const needsNewCode =
            result.errorCode === OtpErrorCode.EXPIRED ||
            result.errorCode === OtpErrorCode.MAX_ATTEMPTS
        if (needsNewCode) {
            setShouldGoBack(true)
        }
    }

    const hasError = Boolean(errorCode)
    const isDisabled = isLoading || shouldGoBack

    return (
        <div data-testid="otp-code-step" className={styles.authStep}>
            <h3 className={styles.authStepTitle}>Código de verificación</h3>
            <p className={styles.authStepSubtitle}>Enviado a {phone}</p>
            <form onSubmit={handleSubmit} className={styles.authForm}>
                <input
                    data-testid="otp-code-input"
                    type="text"
                    inputMode="numeric"
                    maxLength={OTP_CODE_LENGTH}
                    placeholder="000000"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    className={styles.authInput}
                    disabled={isDisabled}
                    autoFocus
                />
                {hasError && (
                    <p data-testid="otp-error" className={styles.authError}>
                        {ERROR_MESSAGES[errorCode]}
                    </p>
                )}
                <button
                    data-testid="otp-verify-button"
                    type="submit"
                    className={styles.authButton}
                    disabled={isDisabled}
                >
                    {isLoading ? (
                        <span className={styles.authSpinner} aria-hidden="true" />
                    ) : (
                        "Verificar"
                    )}
                </button>
            </form>
            <button
                type="button"
                className={styles.authBackLink}
                onClick={onBack}
                disabled={isLoading}
            >
                Cambiar número
            </button>
        </div>
    )
}
