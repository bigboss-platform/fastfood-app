import Image from "next/image"
import type { IMenuItem } from "../interfaces/menu-item.interface"
import styles from "../styles/menu-item-slide.style.module.css"

interface MenuItemSlideProps {
    menuItem: IMenuItem
    onAddToCart: (menuItemId: string) => void
    isVisible: boolean
    direction: "entering" | "exiting" | "idle"
}

export function MenuItemSlide({
    menuItem,
    onAddToCart,
    isVisible,
    direction,
}: MenuItemSlideProps) {
    function handleAddToCartClick() {
        onAddToCart(menuItem.id)
    }

    return (
        <article
            data-testid="menu-item"
            className={`${styles.menuItemSlide} ${styles[direction]} ${!isVisible ? styles.hidden : ""}`}
            aria-hidden={!isVisible}
        >
            <div className={styles.menuItemSlidePhoto}>
                {menuItem.photoUrl !== "" ? (
                    <Image
                        src={menuItem.photoUrl}
                        alt={menuItem.name}
                        fill
                        className={styles.menuItemSlideImage}
                        sizes="100vw"
                    />
                ) : (
                    <div className={styles.menuItemSlidePhotoPlaceholder} aria-hidden="true" />
                )}
            </div>
            <div className={styles.menuItemSlideContent}>
                <h1 data-testid="menu-item-name" className={styles.menuItemSlideName}>
                    {menuItem.name}
                </h1>
                <p className={styles.menuItemSlideDescription}>{menuItem.description}</p>
                <span data-testid="menu-item-price" className={styles.menuItemSlidePrice}>
                    ${menuItem.price.toFixed(2)}
                </span>
                <button
                    type="button"
                    data-testid="add-to-cart"
                    className={styles.menuItemSlideButton}
                    onClick={handleAddToCartClick}
                    disabled={!menuItem.isAvailable}
                    aria-label={`Agregar ${menuItem.name} al carrito`}
                >
                    {menuItem.isAvailable ? "Agregar" : "No disponible"}
                </button>
            </div>
        </article>
    )
}
