"use client"

import { useState } from "react"
import type { ITokenPair } from "../interfaces/token-pair.interface"
import { OtpPhoneStep } from "./otp-phone-step.component"
import { OtpCodeStep } from "./otp-code-step.component"
import { OtpStep } from "../enums/otp-step.enum"
import styles from "../styles/auth-flow.style.module.css"

interface AuthFlowProps {
    onAuthSuccess: (tokenPair: ITokenPair) => void
}

export function AuthFlow({ onAuthSuccess }: AuthFlowProps) {
    const [step, setStep] = useState<OtpStep>(OtpStep.PHONE)
    const [phone, setPhone] = useState<string>("")

    function handlePhoneSuccess(submittedPhone: string) {
        setPhone(submittedPhone)
        setStep(OtpStep.CODE)
    }

    function handleBack() {
        setStep(OtpStep.PHONE)
    }

    const isPhoneStep = step === OtpStep.PHONE

    return (
        <div data-testid="auth-flow" className={styles.authFlow}>
            {isPhoneStep ? (
                <OtpPhoneStep onSuccess={handlePhoneSuccess} />
            ) : (
                <OtpCodeStep phone={phone} onSuccess={onAuthSuccess} onBack={handleBack} />
            )}
        </div>
    )
}
