"use client"

import { useState, useCallback } from "react"
import type { ICart } from "../interfaces/cart.interface"
import type { ICartItem } from "../interfaces/cart-item.interface"
import type { ITokenPair } from "@/feature/auth/interfaces/token-pair.interface"
import { EMPTY_CART_ITEM } from "../constants/cart.constant"
import { calculateTotals } from "../utils/calculate-totals.util"
import { useAuth } from "@/feature/auth/hooks/use-auth.hook"
import type { IMenuItem } from "@/feature/menus/interfaces/menu-item.interface"

interface UseCartResult {
    cart: ICart
    isDrawerOpen: boolean
    isAuthFlowVisible: boolean
    isCheckoutVisible: boolean
    accessToken: string
    handleAddItem: (menuItem: IMenuItem) => void
    handleIncreaseQuantity: (cartItemId: string) => void
    handleDecreaseQuantity: (cartItemId: string) => void
    handleNoteChange: (cartItemId: string, note: string) => void
    handleOpenDrawer: () => void
    handleCloseDrawer: () => void
    handleClearCart: () => void
    clearCart: () => void
    handleCheckout: () => void
    handleAuthSuccess: (tokenPair: ITokenPair) => void
    handleCancelCheckout: () => void
    handleCompleteCheckout: () => void
}

export function useCart(): UseCartResult {
    const [cartItems, setCartItems] = useState<ICartItem[]>([])
    const [deliveryCost, setDeliveryCost] = useState<number>(0)
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
    const [isAuthFlowVisible, setIsAuthFlowVisible] = useState<boolean>(false)
    const [isCheckoutVisible, setIsCheckoutVisible] = useState<boolean>(false)

    const { isAuthenticated, login, session } = useAuth()

    const cart: ICart = calculateTotals(cartItems, deliveryCost)

    const handleAddItem = useCallback((menuItem: IMenuItem) => {
        setCartItems((current) => {
            const existingItem = current.find((item) => item.menuItemId === menuItem.id)
            const itemAlreadyInCart = Boolean(existingItem)
            if (itemAlreadyInCart) {
                return current.map((item) =>
                    item.menuItemId === menuItem.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            const newItem: ICartItem = {
                ...EMPTY_CART_ITEM,
                id: `${menuItem.id}-${Date.now()}`,
                menuItemId: menuItem.id,
                menuItemName: menuItem.name,
                menuItemPhotoUrl: menuItem.photoUrl,
                price: menuItem.price,
                quantity: 1,
            }
            return [...current, newItem]
        })
        setIsDrawerOpen(true)
    }, [])

    const handleIncreaseQuantity = useCallback((cartItemId: string) => {
        setCartItems((current) =>
            current.map((item) =>
                item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
            )
        )
    }, [])

    const handleDecreaseQuantity = useCallback((cartItemId: string) => {
        setCartItems((current) => {
            const updated = current.map((item) =>
                item.id === cartItemId ? { ...item, quantity: item.quantity - 1 } : item
            )
            return updated.filter((item) => item.quantity > 0)
        })
    }, [])

    const handleNoteChange = useCallback((cartItemId: string, note: string) => {
        setCartItems((current) =>
            current.map((item) => (item.id === cartItemId ? { ...item, note } : item))
        )
    }, [])

    const handleOpenDrawer = useCallback(() => setIsDrawerOpen(true), [])
    const handleCloseDrawer = useCallback(() => setIsDrawerOpen(false), [])
    const handleClearCart = useCallback(() => {
        setCartItems([])
        setDeliveryCost(0)
    }, [])

    const handleCheckout = useCallback(() => {
        if (isAuthenticated) {
            setIsDrawerOpen(false)
            setIsCheckoutVisible(true)
            return
        }
        setIsAuthFlowVisible(true)
    }, [isAuthenticated])

    const handleAuthSuccess = useCallback(
        (tokenPair: ITokenPair) => {
            login(tokenPair)
            setIsAuthFlowVisible(false)
            setIsDrawerOpen(false)
            setIsCheckoutVisible(true)
        },
        [login]
    )

    const handleCancelCheckout = useCallback(() => {
        setIsCheckoutVisible(false)
        setIsDrawerOpen(true)
    }, [])

    const handleCompleteCheckout = useCallback(() => {
        setIsCheckoutVisible(false)
    }, [])

    return {
        cart,
        isDrawerOpen,
        isAuthFlowVisible,
        isCheckoutVisible,
        accessToken: session.accessToken,
        handleAddItem,
        handleIncreaseQuantity,
        handleDecreaseQuantity,
        handleNoteChange,
        handleOpenDrawer,
        handleCloseDrawer,
        handleClearCart,
        clearCart: handleClearCart,
        handleCheckout,
        handleAuthSuccess,
        handleCancelCheckout,
        handleCompleteCheckout,
    }
}
