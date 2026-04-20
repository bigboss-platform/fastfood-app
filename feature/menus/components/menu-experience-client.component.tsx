"use client"

import { useState, useCallback, useEffect } from "react"
import type { IFlatMenuItem } from "../interfaces/flat-menu-item.interface"
import { EMPTY_FLAT_MENU_ITEM } from "../constants/menu-item.constant"
import { useMenuScroll } from "../hooks/use-menu-scroll.hook"
import { MenuItemSlide } from "./menu-item-slide.component"
import { LoadingScreen } from "@/feature/loading/components/loading-screen.component"
import { useCart } from "@/feature/cart/hooks/use-cart.hook"
import { CartDrawer } from "@/feature/cart/components/cart-drawer.component"
import { AuthFlow } from "@/feature/auth/components/auth-flow.component"
import { ActiveOrderContainer } from "@/feature/orders/containers/active-order.container"
import { CheckoutContainer } from "@/feature/orders/containers/checkout.container"
import { BB_ACTIVE_ORDER_ID_KEY } from "@/feature/orders/constants/order.constant"
import styles from "../styles/menu-experience.style.module.css"

interface MenuExperienceClientProps {
    items: IFlatMenuItem[]
    tenantSlug: string
    whatsappNumber: string
}

export function MenuExperienceClient({
    items,
    tenantSlug,
    whatsappNumber,
}: MenuExperienceClientProps) {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [activeOrderId, setActiveOrderId] = useState<string>("")

    useEffect(() => {
        const storedOrderId = localStorage.getItem(BB_ACTIVE_ORDER_ID_KEY) ?? ""
        const hasActiveOrder = Boolean(storedOrderId)
        if (!hasActiveOrder) return
        setActiveOrderId(storedOrderId)
    }, [])

    const handleReturnToMenu = useCallback(() => {
        setActiveOrderId("")
    }, [])

    const { activeIndex, canScrollUp, canScrollDown, handleScrollUp, handleScrollDown } =
        useMenuScroll(items)

    const activeItem: IFlatMenuItem = items[activeIndex] ?? EMPTY_FLAT_MENU_ITEM

    const {
        cart,
        isDrawerOpen,
        isAuthFlowVisible,
        isCheckoutVisible,
        accessToken,
        handleAddItem,
        handleIncreaseQuantity,
        handleDecreaseQuantity,
        handleNoteChange,
        handleOpenDrawer,
        handleCloseDrawer,
        clearCart,
        handleCheckout,
        handleAuthSuccess,
        handleCompleteCheckout,
    } = useCart()

    const handleLoadingComplete = useCallback(() => {
        setIsLoading(false)
    }, [])

    const handleOrderPlaced = useCallback(
        (orderId: string) => {
            handleCompleteCheckout()
            setActiveOrderId(orderId)
        },
        [handleCompleteCheckout]
    )

    function handleAddToCart(menuItemId: string) {
        const menuItem = items.find((item) => item.id === menuItemId)
        if (!menuItem) return
        handleAddItem(menuItem)
    }

    const hasItemsInCart = Boolean(cart.itemCount)
    const hasActiveOrder = Boolean(activeOrderId)

    if (hasActiveOrder) {
        return (
            <ActiveOrderContainer
                orderId={activeOrderId}
                tenantSlug={tenantSlug}
                whatsappNumber={whatsappNumber}
                onReturnToMenu={handleReturnToMenu}
            />
        )
    }

    if (isCheckoutVisible) {
        return (
            <CheckoutContainer
                tenantSlug={tenantSlug}
                cart={cart}
                accessToken={accessToken}
                clearCart={clearCart}
                onOrderPlaced={handleOrderPlaced}
            />
        )
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

            {hasItemsInCart && (
                <button
                    type="button"
                    data-testid="cart-badge"
                    className={styles.cartBadgeButton}
                    onClick={handleOpenDrawer}
                    aria-label={`Abrir carrito, ${cart.itemCount} productos`}
                >
                    🛒
                    <span className={styles.cartBadgeCount}>{cart.itemCount}</span>
                </button>
            )}

            <CartDrawer
                cart={cart}
                isOpen={isDrawerOpen}
                isAuthLoading={false}
                onClose={handleCloseDrawer}
                onIncreaseQuantity={handleIncreaseQuantity}
                onDecreaseQuantity={handleDecreaseQuantity}
                onNoteChange={handleNoteChange}
                onCheckout={handleCheckout}
                authFlowNode={
                    isAuthFlowVisible && (
                        <AuthFlow tenantId={tenantSlug} onAuthSuccess={handleAuthSuccess} />
                    )
                }
            />
        </main>
    )
}
