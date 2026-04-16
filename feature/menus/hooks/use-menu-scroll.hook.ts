"use client"

import { useState, useCallback } from "react"
import type { IMenuItem } from "../interfaces/menu-item.interface"

interface UseMenuScrollResult {
    activeIndex: number
    activeItem: IMenuItem
    canScrollUp: boolean
    canScrollDown: boolean
    handleScrollUp: () => void
    handleScrollDown: () => void
}

export function useMenuScroll(items: IMenuItem[]): UseMenuScrollResult {
    const [activeIndex, setActiveIndex] = useState<number>(0)

    const activeItem: IMenuItem = items[activeIndex] ?? {
        id: "",
        sectionId: "",
        name: "",
        description: "",
        price: 0,
        photoUrl: "",
        sortOrder: 0,
        isAvailable: false,
    }

    const handleScrollUp = useCallback(() => {
        setActiveIndex((current) => Math.max(0, current - 1))
    }, [])

    const handleScrollDown = useCallback(() => {
        setActiveIndex((current) => Math.min(items.length - 1, current + 1))
    }, [items.length])

    return {
        activeIndex,
        activeItem,
        canScrollUp: activeIndex > 0,
        canScrollDown: activeIndex < items.length - 1,
        handleScrollUp,
        handleScrollDown,
    }
}
