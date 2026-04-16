import { describe, it, expect } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useMenuScroll } from "@/feature/menus/hooks/use-menu-scroll.hook"
import type { IMenuItem } from "@/feature/menus/interfaces/menu-item.interface"

function makeItem(id: string): IMenuItem {
    return { id, sectionId: "s1", name: `Item ${id}`, description: "", price: 10, photoUrl: "", sortOrder: 0, isAvailable: true }
}

const ITEMS: IMenuItem[] = [makeItem("1"), makeItem("2"), makeItem("3"), makeItem("4"), makeItem("5")]

describe("useMenuScroll", () => {
    it("starts at index 0", () => {
        const { result } = renderHook(() => useMenuScroll(ITEMS))
        expect(result.current.activeIndex).toBe(0)
    })

    it("scrolling down increments activeIndex", () => {
        const { result } = renderHook(() => useMenuScroll(ITEMS))
        act(() => {
            result.current.handleScrollDown()
        })
        expect(result.current.activeIndex).toBe(1)
    })

    it("scrolling up decrements activeIndex", () => {
        const { result } = renderHook(() => useMenuScroll(ITEMS))
        act(() => {
            result.current.handleScrollDown()
            result.current.handleScrollDown()
            result.current.handleScrollUp()
        })
        expect(result.current.activeIndex).toBe(1)
    })

    it("canScrollUp is false at first item", () => {
        const { result } = renderHook(() => useMenuScroll(ITEMS))
        expect(result.current.canScrollUp).toBe(false)
    })

    it("canScrollUp is true after scrolling down", () => {
        const { result } = renderHook(() => useMenuScroll(ITEMS))
        act(() => {
            result.current.handleScrollDown()
        })
        expect(result.current.canScrollUp).toBe(true)
    })

    it("canScrollDown is false at last item", () => {
        const { result } = renderHook(() => useMenuScroll(ITEMS))
        act(() => {
            for (let i = 0; i < ITEMS.length - 1; i++) {
                result.current.handleScrollDown()
            }
        })
        expect(result.current.canScrollDown).toBe(false)
    })

    it("does not scroll below 0", () => {
        const { result } = renderHook(() => useMenuScroll(ITEMS))
        act(() => {
            result.current.handleScrollUp()
        })
        expect(result.current.activeIndex).toBe(0)
    })

    it("does not scroll beyond last item", () => {
        const { result } = renderHook(() => useMenuScroll(ITEMS))
        act(() => {
            for (let i = 0; i < ITEMS.length + 5; i++) {
                result.current.handleScrollDown()
            }
        })
        expect(result.current.activeIndex).toBe(ITEMS.length - 1)
    })

    it("activeItem reflects the current index", () => {
        const { result } = renderHook(() => useMenuScroll(ITEMS))
        act(() => {
            result.current.handleScrollDown()
        })
        expect(result.current.activeItem.id).toBe("2")
    })
})
