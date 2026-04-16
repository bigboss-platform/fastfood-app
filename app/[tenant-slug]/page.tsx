import { MenuExperienceContainer } from "@/feature/menus/containers/menu-experience.container"

interface TenantPageProps {
    params: Promise<{ "tenant-slug": string }>
}

export default async function TenantPage({ params }: TenantPageProps) {
    const { "tenant-slug": tenantSlug } = await params
    return <MenuExperienceContainer tenantSlug={tenantSlug} />
}
