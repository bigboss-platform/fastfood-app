import { fetchMenu } from "../services/menu.service"
import { MenuExperienceClient } from "../components/menu-experience-client.component"
import { EMPTY_MENU } from "../constants/menu-item.constant"

interface MenuExperienceContainerProps {
    tenantSlug: string
}

export async function MenuExperienceContainer({ tenantSlug }: MenuExperienceContainerProps) {
    const menu = await fetchMenu(tenantSlug)

    return <MenuExperienceClient menu={menu} tenantSlug={tenantSlug} />
}
