"use client"

import { useState } from "react"
import type { IMenu } from "../interfaces/menu.interface"
import type { IMenuSection } from "../interfaces/menu-section.interface"
import { useMenuScroll } from "../hooks/use-menu-scroll.hook"
import { MenuItemSlide } from "./menu-item-slide.component"
import { LoadingScreen } from "@/feature/loading/components/loading-screen.component"
import styles from "../styles/menu-experience.style.module.css"

interface MenuExperienceClientProps {
    menu: IMenu
    tenantSlug: string
}

export function MenuExperienceClient({ menu, tenantSlug }: MenuExperienceClientProps) {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [activeSection, setActiveSection] = useState<IMenuSection>(
        menu.sections[0] ?? { id: "", menuId: "", name: "", sortOrder: 0, isActive: true, items: [] }
    )

    const { activeItem, activeIndex, canScrollUp, canScrollDown, handleScrollUp, handleScrollDown } =
        useMenuScroll(activeSection.items)

    function handleLoadingComplete() {
        setIsLoading(false)
    }

    function handleAddToCart(menuItemId: string) {
        // Cart drawer opens — wired in next iteration
    }

    if (isLoading) {
        return <LoadingScreen onComplete={handleLoadingComplete} />
    }

    return (
        <main className={styles.menuExperience}>
            <section className={styles.menuExperienceSlider}>
                {activeSection.items.map((item, index) => (
                    <MenuItemSlide
                        key={item.id}
                        menuItem={item}
                        onAddToCart={handleAddToCart}
                        isVisible={index === activeIndex}
                        direction={index === activeIndex ? "idle" : "exiting"}
                    />
                ))}
            </section>

            {canScrollUp && (
                <button
                    type="button"
                    className={`${styles.scrollButton} ${styles.scrollButtonUp}`}
                    onClick={handleScrollUp}
                    aria-label="Ver item anterior"
                >
                    ↑
                </button>
            )}

            {canScrollDown && (
                <button
                    type="button"
                    className={`${styles.scrollButton} ${styles.scrollButtonDown}`}
                    onClick={handleScrollDown}
                    aria-label="Ver siguiente item"
                >
                    ↓
                </button>
            )}
        </main>
    )
}
