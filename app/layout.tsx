import type { Metadata } from "next"
import { TENANT_SLUG } from "@/feature/shared/constants/tenant.constant"
import "./globals.css"

export const metadata: Metadata = {
    title: "BigBoss FastFood",
    description: "Order your food online",
}

interface RootLayoutProps {
    children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
    let themeResponse: Response | undefined
    try {
        themeResponse = await fetch(
            `${process.env.API_BASE_URL}/api/v1/tenants/${TENANT_SLUG}/theme`,
            { cache: "no-store" }
        )
    } catch {}

    let theme: Record<string, string> | undefined
    try {
        if (themeResponse?.ok) {
            const body: { data?: Record<string, string> } = await themeResponse.json()
            theme = body.data
        }
    } catch {}

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
        <html lang="es">
            <head>
                {theme?.["font_family_url"] && (
                    <link rel="stylesheet" href={theme["font_family_url"]} />
                )}
                {tenantCssVariables !== "" && (
                    <style id="tenant-theme" dangerouslySetInnerHTML={{ __html: tenantCssVariables }} />
                )}
            </head>
            <body>{children}</body>
        </html>
    )
}
