import { test, expect } from "@playwright/test"

const TENANT_SLUG = process.env["E2E_TENANT_SLUG"] ?? "demo-fastfood"
const BASE_URL = `/${TENANT_SLUG}`
const TEST_PHONE = process.env["E2E_TEST_PHONE"] ?? "+521234567890"
const TEST_OTP_CODE = process.env["E2E_TEST_OTP_CODE"] ?? "000000"

test.describe("OTP Authentication Flow", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(BASE_URL)
        await page.waitForSelector("[data-testid='menu-experience']", { timeout: 10000 })
    })

    test("adding item and proceeding to checkout prompts auth if not logged in", async ({ page }) => {
        await page.getByTestId("add-to-cart").first().click()
        await page.getByTestId("checkout-button").click()
        await expect(page.getByTestId("otp-phone-input")).toBeVisible()
    })

    test("phone number submission shows OTP code input", async ({ page }) => {
        await page.getByTestId("add-to-cart").first().click()
        await page.getByTestId("checkout-button").click()

        await page.getByTestId("otp-phone-input").fill(TEST_PHONE)
        await page.getByTestId("otp-request-button").click()

        await expect(page.getByTestId("otp-code-input")).toBeVisible()
    })

    test("correct OTP code authenticates and proceeds to delivery options", async ({ page }) => {
        await page.getByTestId("add-to-cart").first().click()
        await page.getByTestId("checkout-button").click()

        await page.getByTestId("otp-phone-input").fill(TEST_PHONE)
        await page.getByTestId("otp-request-button").click()

        await page.getByTestId("otp-code-input").fill(TEST_OTP_CODE)
        await page.getByTestId("otp-verify-button").click()

        await expect(page.getByTestId("delivery-options")).toBeVisible()
    })

    test("wrong OTP code shows error message", async ({ page }) => {
        await page.getByTestId("add-to-cart").first().click()
        await page.getByTestId("checkout-button").click()

        await page.getByTestId("otp-phone-input").fill(TEST_PHONE)
        await page.getByTestId("otp-request-button").click()

        await page.getByTestId("otp-code-input").fill("999999")
        await page.getByTestId("otp-verify-button").click()

        await expect(page.getByTestId("otp-error")).toBeVisible()
    })
})
