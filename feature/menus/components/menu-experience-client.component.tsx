"use client"

import { useState, useCallback } from "react"
import type { IFlatMenuItem } from "../interfaces/flat-menu-item.interface"
import { EMPTY_FLAT_MENU_ITEM } from "../constants/menu-item.constant"
import { useMenuScroll } from "../hooks/use-menu-scroll.hook"
import { MenuItemSlide } from "./menu-item-slide.component"
import { LoadingScreen } from "@/feature/loading/components/loading-screen.component"
import styles from "../styles/menu-experience.style.module.css"

interface MenuExperienceClientProps {
    items: IFlatMenuItem[]
    tenantSlug: string
}

export function MenuExperienceClient({ items, tenantSlug: _tenantSlug }: MenuExperienceClientProps) {
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const { activeIndex, canScrollUp, canScrollDown, handleScrollUp, handleScrollDown } =
        useMenuScroll(items)

    const activeItem: IFlatMenuItem = items[activeIndex] ?? EMPTY_FLAT_MENU_ITEM

    const handleLoadingComplete = useCallback(() => {
        setIsLoading(false)
    }, [])

    function handleAddToCart(_menuItemId: string) {
    }

    return (
        <main data-testid="menu-experience" className={styles.menuExperience}>
            {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

            <header className={styles.menuExperienceHeader}>
                <span className={styles.menuExperienceSectionLabel}>{activeItem.sectionName}</span>
                <span className={styles.menuExperienceCounter}>
                    {activeIndex + 1} / {items.length}
                </span>
            </header>

            <section className={styles.menuExperienceSlider}>
                {items.map((item, index) => (
                    <MenuItemSlide
                        key={item.id}
                        menuItem={item}
                        onAddToCart={handleAddToCart}
                        isVisible={index === activeIndex}
                        direction={index === activeIndex ? "entering" : "exiting"}
                    />
                ))}
            </section>

            <button
                type="button"
                data-testid="scroll-up"
                className={`${styles.scrollButton} ${styles.scrollButtonUp}`}
                onClick={handleScrollUp}
                disabled={!canScrollUp}
                aria-label="Ver item anterior"
            >
                ↑
            </button>

            <button
                type="button"
                data-testid="scroll-down"
                className={`${styles.scrollButton} ${styles.scrollButtonDown}`}
                onClick={handleScrollDown}
                disabled={!canScrollDown}
                aria-label="Ver siguiente item"
            >
                ↓
            </button>
        </main>
    )
}
