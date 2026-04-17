export function isTokenExpired(token: string): boolean {
    const parts = token.split(".")
    if (parts.length !== 3) return true
    try {
        const payload: { exp?: number } = JSON.parse(globalThis.atob(parts[1] ?? ""))
        const exp = payload.exp ?? 0
        const nowInSeconds = Math.floor(Date.now() / 1000)
        return nowInSeconds >= exp
    } catch {
        return true
    }
}
