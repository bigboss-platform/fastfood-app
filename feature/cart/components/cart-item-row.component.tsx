"use client"

import type { ICartItem } from "../interfaces/cart-item.interface"
import { formatPrice } from "../utils/format-price.util"
import styles from "../styles/cart-item-row.style.module.css"

interface CartItemRowProps {
    cartItem: ICartItem
    onIncrease: (id: string) => void
    onDecrease: (id: string) => void
    onNoteChange: (id: string, note: string) => void
}

export function CartItemRow({ cartItem, onIncrease, onDecrease, onNoteChange }: CartItemRowProps) {
    return (
        <li data-testid="cart-item" className={styles.cartItemRow}>
            <div className={styles.cartItemMain}>
                <span className={styles.cartItemName}>{cartItem.menuItemName}</span>
                <span className={styles.cartItemUnitPrice}>{formatPrice(cartItem.price)}</span>
                <div className={styles.cartItemControls}>
                    <button
                        type="button"
                        data-testid="cart-item-decrease"
                        className={styles.cartItemControlButton}
                        onClick={() => onDecrease(cartItem.id)}
                        aria-label="Disminuir cantidad"
                    >
                        −
                    </button>
                    <span className={styles.cartItemQuantity}>{cartItem.quantity}</span>
                    <button
                        type="button"
                        data-testid="cart-item-increase"
                        className={styles.cartItemControlButton}
                        onClick={() => onIncrease(cartItem.id)}
                        aria-label="Aumentar cantidad"
                    >
                        +
                    </button>
                </div>
                <span className={styles.cartItemLineTotal}>
                    {formatPrice(cartItem.price * cartItem.quantity)}
                </span>
            </div>
            <input
                type="text"
                className={styles.cartItemNote}
                placeholder="Nota para este producto"
                value={cartItem.note}
                onChange={(event) => onNoteChange(cartItem.id, event.target.value)}
                aria-label={`Nota para ${cartItem.menuItemName}`}
            />
        </li>
    )
}
