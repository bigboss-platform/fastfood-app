import { fetchMenu } from "../services/menu.service"
import { MenuExperienceClient } from "../components/menu-experience-client.component"
import type { IMenu } from "../interfaces/menu.interface"
import type { IFlatMenuItem } from "../interfaces/flat-menu-item.interface"
import styles from "../styles/menu-experience.style.module.css"

interface MenuExperienceContainerProps {
    tenantSlug: string
}

function flattenMenuItems(menu: IMenu): IFlatMenuItem[] {
    return [...menu.sections]
        .sort((sectionA, sectionB) => sectionA.sortOrder - sectionB.sortOrder)
        .flatMap((section) =>
            [...section.items]
                .sort((itemA, itemB) => itemA.sortOrder - itemB.sortOrder)
                .map((item) => ({ ...item, sectionName: section.name }))
        )
}

export async function MenuExperienceContainer({ tenantSlug }: MenuExperienceContainerProps) {
    const menu = await fetchMenu(tenantSlug)
    const flatItems = flattenMenuItems(menu)

    if (flatItems.length === 0) {
        return (
            <main className={styles.menuUnavailable}>
                <p className={styles.menuUnavailableText}>Menú no disponible en este momento.</p>
            </main>
        )
    }

    return <MenuExperienceClient items={flatItems} tenantSlug={tenantSlug} />
}
