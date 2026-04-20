import { test, expect } from "@playwright/test"

const TENANT_SLUG = process.env["E2E_TENANT_SLUG"] ?? "demo-fastfood"
const BASE_URL = `/${TENANT_SLUG}`
const TEST_PHONE = process.env["E2E_TEST_PHONE"] ?? "+521234567890"
const TEST_OTP_CODE = process.env["E2E_TEST_OTP_CODE"] ?? "000000"
const TEST_ADDRESS = "Av. Insurgentes Sur 1234, Ciudad de México"

async function authenticateUser(page: Parameters<typeof test>[1] extends (args: { page: infer P }) => unknown ? P : never) {
    await page.goto(BASE_URL)
    await page.waitForSelector("[data-testid='menu-experience']", { timeout: 10000 })
    await page.getByTestId("add-to-cart").first().click()
    await page.getByTestId("checkout-button").click()
    await page.getByTestId("otp-phone-input").fill(TEST_PHONE)
    await page.getByTestId("otp-request-button").click()
    await page.getByTestId("otp-code-input").fill(TEST_OTP_CODE)
    await page.getByTestId("otp-verify-button").click()
    await page.waitForSelector("[data-testid='delivery-options']")
}

test.describe("Order Flow — Delivery", () => {
    test("selecting delivery shows address input", async ({ page }) => {
        await authenticateUser(page)

        await page.getByTestId("delivery-type-delivery").click()
        await expect(page.getByTestId("delivery-address-input")).toBeVisible()
    })

    test("shows map when delivery is selected", async ({ page }) => {
        await authenticateUser(page)

        await page.getByTestId("delivery-type-delivery").click()
        await expect(page.getByTestId("delivery-map")).toBeVisible({ timeout: 5000 })
    })

    test("shows delivery cost estimate", async ({ page }) => {
        await authenticateUser(page)

        await page.getByTestId("delivery-type-delivery").click()
        await page.getByTestId("delivery-address-input").fill(TEST_ADDRESS)

        await expect(page.getByTestId("delivery-cost")).toBeVisible({ timeout: 10000 })
    })

    test("completes a delivery order end-to-end", async ({ page }) => {
        await authenticateUser(page)

        await page.getByTestId("delivery-type-delivery").click()
        await page.getByTestId("delivery-address-input").fill(TEST_ADDRESS)
        await page.waitForSelector("[data-testid='delivery-cost']", { timeout: 10000 })
        await page.getByTestId("confirm-address-button").click()
        await page.getByTestId("confirm-order-button").click()

        await expect(page.getByTestId("active-order-view")).toBeVisible()
        await expect(page.getByTestId("order-status")).toContainText("recibido")
    })
})
