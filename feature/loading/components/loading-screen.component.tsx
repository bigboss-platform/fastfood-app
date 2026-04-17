"use client"

import { useEffect, useState } from "react"
import styles from "../styles/loading-screen.style.module.css"

interface LoadingScreenProps {
    onComplete: () => void
}

const MINIMUM_DISPLAY_MS = 1500
const FADE_DURATION_MS = 400

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
    const [isFading, setIsFading] = useState<boolean>(false)

    useEffect(() => {
        const timer = setTimeout(() => setIsFading(true), MINIMUM_DISPLAY_MS)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (!isFading) return
        const timer = setTimeout(onComplete, FADE_DURATION_MS)
        return () => clearTimeout(timer)
    }, [isFading, onComplete])

    return (
        <div
            data-testid="loading-screen"
            className={`${styles.loadingScreen} ${isFading ? styles.loadingScreenFading : ""}`}
            role="status"
            aria-label="Cargando"
        >
            <div className={styles.loadingScreenLogo}>
                <span className={styles.loadingScreenLogoText}>BigBoss</span>
            </div>
        </div>
    )
}
