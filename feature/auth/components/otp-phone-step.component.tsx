"use client"

import { useState } from "react"
import { requestOtp } from "../services/auth.service"
import styles from "../styles/auth-flow.style.module.css"

interface OtpPhoneStepProps {
    tenantId: string
    onSuccess: (phone: string) => void
}

export function OtpPhoneStep({ tenantId, onSuccess }: OtpPhoneStepProps) {
    const [phone, setPhone] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("")

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault()
        const hasPhone = Boolean(phone.trim())
        if (!hasPhone) {
            setErrorMessage("Ingresa tu número de teléfono")
            return
        }
        setIsLoading(true)
        setErrorMessage("")
        const result = await requestOtp(phone.trim(), tenantId)
        setIsLoading(false)
        const requestSucceeded = Boolean(result.expiresInSeconds)
        if (!requestSucceeded) {
            setErrorMessage("Error al enviar el código. Intenta de nuevo.")
            return
        }
        onSuccess(phone.trim())
    }

    const hasError = Boolean(errorMessage)

    return (
        <div data-testid="otp-phone-step" className={styles.authStep}>
            <h3 className={styles.authStepTitle}>Ingresa tu número</h3>
            <p className={styles.authStepSubtitle}>Te enviaremos un código de verificación</p>
            <form onSubmit={handleSubmit} className={styles.authForm}>
                <input
                    data-testid="otp-phone-input"
                    type="tel"
                    inputMode="tel"
                    placeholder="+52XXXXXXXXXX"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className={styles.authInput}
                    disabled={isLoading}
                    autoFocus
                />
                {hasError && <p className={styles.authError}>{errorMessage}</p>}
                <button
                    data-testid="otp-request-button"
                    type="submit"
                    className={styles.authButton}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className={styles.authSpinner} aria-hidden="true" />
                    ) : (
                        "Enviar código"
                    )}
                </button>
            </form>
        </div>
    )
}
