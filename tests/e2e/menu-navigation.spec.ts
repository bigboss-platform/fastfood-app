import { test, expect } from "@playwright/test"

const TENANT_SLUG = process.env["E2E_TENANT_SLUG"] ?? "demo-fastfood"
const BASE_URL = `/${TENANT_SLUG}`

test.describe("Menu Navigation", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(BASE_URL)
        await page.waitForSelector("[data-testid='menu-experience']", { timeout: 10000 })
    })

    test("loading screen appears then transitions to menu", async ({ page }) => {
        await page.goto(BASE_URL)
        const loadingScreen = page.getByTestId("loading-screen")
        await expect(loadingScreen).toBeVisible()
        await expect(loadingScreen).not.toBeVisible({ timeout: 5000 })
        await expect(page.getByTestId("menu-experience")).toBeVisible()
    })

    test("displays menu items with name, description and price", async ({ page }) => {
        const firstItem = page.getByTestId("menu-item").first()
        await expect(firstItem.getByTestId("menu-item-name")).toBeVisible()
        await expect(firstItem.getByTestId("menu-item-price")).toBeVisible()
    })

    test("scroll down button navigates to next item", async ({ page }) => {
        const scrollDown = page.getByTestId("scroll-down")
        await expect(scrollDown).toBeVisible()
        await scrollDown.click()
        await expect(page.getByTestId("menu-item").nth(1)).toBeVisible()
    })

    test("scroll up is disabled on first item", async ({ page }) => {
        const scrollUp = page.getByTestId("scroll-up")
        await expect(scrollUp).toBeDisabled()
    })

    test("agregar button opens cart drawer", async ({ page }) => {
        await page.getByTestId("add-to-cart").first().click()
        await expect(page.getByTestId("cart-drawer")).toBeVisible()
    })
})
