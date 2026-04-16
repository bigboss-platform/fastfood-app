import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
    title: "BigBoss FastFood",
    description: "Order your food online",
}

interface RootLayoutProps {
    children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="es">
            <body>{children}</body>
        </html>
    )
}
