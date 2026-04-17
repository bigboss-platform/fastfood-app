import { fetchMenu } from "../services/menu.service"
import { MenuExperienceClient } from "../components/menu-experience-client.component"
import { flattenMenuItems } from "../utils/flatten-menu-items.util"
import styles from "../styles/menu-experience.style.module.css"

interface MenuExperienceContainerProps {
    tenantSlug: string
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
