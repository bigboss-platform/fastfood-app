"use client"

import { useEffect } from "react"
import styles from "../styles/loading-screen.style.module.css"

interface LoadingScreenProps {
    onComplete: () => void
}

const MINIMUM_DISPLAY_MS = 1500

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete()
        }, MINIMUM_DISPLAY_MS)

        return () => clearTimeout(timer)
    }, [onComplete])

    return (
        <div className={styles.loadingScreen} role="status" aria-label="Cargando">
            <div className={styles.loadingScreenLogo}>
                <span className={styles.loadingScreenLogoText}>BigBoss</span>
            </div>
        </div>
    )
}
