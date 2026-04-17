import type { Metadata } from "next"
import { notFound } from "next/navigation"

interface TenantLayoutProps {
    children: React.ReactNode
    params: Promise<{ "tenant-slug": string }>
}

export async function generateMetadata({ params }: TenantLayoutProps): Promise<Metadata> {
    const { "tenant-slug": tenantSlug } = await params
    return {
        title: tenantSlug,
    }
}

export default async function TenantLayout({ children, params }: TenantLayoutProps) {
    const { "tenant-slug": tenantSlug } = await params

    let themeResponse: Response | undefined
    try {
        themeResponse = await fetch(
            `${process.env.API_BASE_URL}/api/v1/tenants/${tenantSlug}/theme`,
            { cache: "no-store" }
        )
    } catch {
    }

    if (themeResponse?.status === 404) {
        notFound()
    }

    let theme: Record<string, string> | undefined
    try {
        if (themeResponse?.ok) {
            const body: { data?: Record<string, string> } = await themeResponse.json()
            theme = body.data
        }
    } catch {
    }

    const tenantCssVariables = theme
        ? `
        :root {
            --color-primary: ${theme["primary_color"]};
            --color-primary-hover: ${theme["primary_color_hover"]};
            --color-secondary: ${theme["secondary_color"]};
            --color-background: ${theme["background_color"]};
            --color-surface: ${theme["surface_color"]};
            --color-text-primary: ${theme["text_primary_color"]};
            --color-text-secondary: ${theme["text_secondary_color"]};
            --color-loading-background: ${theme["loading_screen_background_color"]};
            --font-family-base: '${theme["font_family_name"]}', system-ui, sans-serif;
        }
        `
        : ""

    return (
        <>
            {tenantCssVariables !== "" && (
                <style id="tenant-theme" dangerouslySetInnerHTML={{ __html: tenantCssVariables }} />
            )}
            {theme?.["font_family_url"] && (
                <link rel="stylesheet" href={theme["font_family_url"]} />
            )}
            {children}
        </>
    )
}
