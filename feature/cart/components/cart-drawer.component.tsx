"use client"

import type { ICart } from "../interfaces/cart.interface"
import { Drawer } from "@/feature/shared/components/drawer.component"
import { CartItemRow } from "./cart-item-row.component"
import { formatPrice } from "../utils/format-price.util"
import styles from "../styles/cart-drawer.style.module.css"

interface CartDrawerProps {
    cart: ICart
    isOpen: boolean
    isAuthLoading: boolean
    onClose: () => void
    onIncreaseQuantity: (cartItemId: string) => void
    onDecreaseQuantity: (cartItemId: string) => void
    onNoteChange: (cartItemId: string, note: string) => void
    onCheckout: () => void
}

export function CartDrawer({
    cart,
    isOpen,
    isAuthLoading,
    onClose,
    onIncreaseQuantity,
    onDecreaseQuantity,
    onNoteChange,
    onCheckout,
}: CartDrawerProps) {
    const hasItems = cart.items.length > 0

    return (
        <Drawer isOpen={isOpen} onClose={onClose} ariaLabel="Carrito de compras">
            <div data-testid="cart-drawer" className={styles.cartDrawer}>
                <header className={styles.cartDrawerHeader}>
                    <h2 className={styles.cartDrawerTitle}>Tu pedido</h2>
                    <button
                        type="button"
                        data-testid="cart-close"
                        className={styles.cartDrawerClose}
                        onClick={onClose}
                        aria-label="Cerrar carrito"
                    >
                        ✕
                    </button>
                </header>

                {hasItems ? (
                    <>
                        <ul className={styles.cartItemsList}>
                            {cart.items.map((item) => (
                                <CartItemRow
                                    key={item.id}
                                    cartItem={item}
                                    onIncrease={onIncreaseQuantity}
                                    onDecrease={onDecreaseQuantity}
                                    onNoteChange={onNoteChange}
                                />
                            ))}
                        </ul>

                        <div className={styles.cartDrawerFooter}>
                            <div className={styles.cartTotals}>
                                <div className={styles.cartTotalsRow}>
                                    <span>Subtotal</span>
                                    <span>{formatPrice(cart.subtotal)}</span>
                                </div>
                                <div className={styles.cartTotalsRow}>
                                    <span>Domicilio</span>
                                    <span className={styles.cartDeliveryPending}>Por calcular</span>
                                </div>
                                <div className={`${styles.cartTotalsRow} ${styles.cartTotalsTotal}`}>
                                    <span>Total</span>
                                    <span>{formatPrice(cart.total)}</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                data-testid="checkout-button"
                                className={styles.checkoutButton}
                                onClick={onCheckout}
                                disabled={isAuthLoading}
                                aria-busy={isAuthLoading}
                            >
                                {isAuthLoading ? (
                                    <span className={styles.checkoutSpinner} aria-hidden="true" />
                                ) : (
                                    "Ir a pagar"
                                )}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className={styles.cartEmpty}>
                        <p className={styles.cartEmptyTitle}>Tu carrito está vacío</p>
                        <p className={styles.cartEmptyHint}>Agregar productos</p>
                    </div>
                )}
            </div>
        </Drawer>
    )
}
