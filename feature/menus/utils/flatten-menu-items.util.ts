import type { IMenu } from "../interfaces/menu.interface"
import type { IFlatMenuItem } from "../interfaces/flat-menu-item.interface"

export function flattenMenuItems(menu: IMenu): IFlatMenuItem[] {
    return [...menu.sections]
        .sort((sectionA, sectionB) => sectionA.sortOrder - sectionB.sortOrder)
        .flatMap((section) =>
            [...section.items]
                .sort((itemA, itemB) => itemA.sortOrder - itemB.sortOrder)
                .map((item) => ({ ...item, sectionName: section.name }))
        )
}
