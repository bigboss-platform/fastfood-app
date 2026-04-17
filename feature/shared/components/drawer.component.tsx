"use client"

import { useEffect } from "react"
import styles from "../styles/drawer.style.module.css"

interface DrawerProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    ariaLabel?: string
}

export function Drawer({ isOpen, onClose, children, ariaLabel = "Panel lateral" }: DrawerProps) {
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : ""
        return () => {
            document.body.style.overflow = ""
        }
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) return
        function handleKeyDown(event: KeyboardEvent) {
            const isEscapeKey = event.key === "Escape"
            if (isEscapeKey) onClose()
        }
        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [isOpen, onClose])

    return (
        <>
            {isOpen && (
                <div
                    className={styles.drawerOverlay}
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}
            <aside
                className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}
                aria-label={ariaLabel}
                aria-hidden={!isOpen}
            >
                {children}
            </aside>
        </>
    )
}
