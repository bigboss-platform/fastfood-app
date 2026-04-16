import type { IMenuItem } from "./menu-item.interface"

export interface IMenuSection {
    id: string
    menuId: string
    name: string
    sortOrder: number
    isActive: boolean
    items: IMenuItem[]
}
