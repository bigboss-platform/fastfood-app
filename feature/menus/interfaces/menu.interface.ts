import type { IMenuSection } from "./menu-section.interface"

export interface IMenu {
    id: string
    tenantId: string
    isActive: boolean
    sections: IMenuSection[]
}
