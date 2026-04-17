import type { IMenuItem } from "../interfaces/menu-item.interface"
import type { IFlatMenuItem } from "../interfaces/flat-menu-item.interface"
import type { IMenu } from "../interfaces/menu.interface"

export const EMPTY_MENU_ITEM: IMenuItem = {
    id: "",
    sectionId: "",
    name: "",
    description: "",
    price: 0,
    photoUrl: "",
    sortOrder: 0,
    isAvailable: false,
}

export const EMPTY_FLAT_MENU_ITEM: IFlatMenuItem = {
    id: "",
    sectionId: "",
    name: "",
    description: "",
    price: 0,
    photoUrl: "",
    sortOrder: 0,
    isAvailable: false,
    sectionName: "",
}

export const EMPTY_MENU: IMenu = {
    id: "",
    tenantId: "",
    isActive: false,
    sections: [],
}
