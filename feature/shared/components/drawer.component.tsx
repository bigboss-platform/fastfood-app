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
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => {
            document.body.style.overflow = ""
        }
    }, [isOpen])

    function handleOverlayClick() {
        onClose()
    }

    function handleKeyDown(event: React.KeyboardEvent) {
        if (event.key === "Escape") {
            onClose()
        }
    }

    return (
        <>
            {isOpen && (
                <div
                    className={styles.drawerOverlay}
                    onClick={handleOverlayClick}
                    aria-hidden="true"
                />
            )}
            <aside
                className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}
                aria-label={ariaLabel}
                aria-hidden={!isOpen}
                onKeyDown={handleKeyDown}
            >
                {children}
            </aside>
        </>
    )
}
