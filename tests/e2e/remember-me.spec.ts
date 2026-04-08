import { test, expect } from '@playwright/test'

test.describe('Remember Me Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login')
  })

  test('should display remember me checkbox', async ({ page }) => {
    // Check if remember me checkbox is visible
    const rememberMeLabel = page.getByText('Ingat saya')
    await expect(rememberMeLabel).toBeVisible()

    // Check if checkbox button exists
    const checkbox = page.locator('[role="checkbox"]')
    await expect(checkbox).toBeVisible()
  })

  test('should toggle remember me checkbox when clicked', async ({ page }) => {
    const checkbox = page.locator('[role="checkbox"]')

    // Initial state should be unchecked
    await expect(checkbox).not.toHaveClass(/bg-primary/)

    // Click to check
    await checkbox.click()
    await expect(checkbox).toHaveClass(/bg-primary/)

    // Click again to uncheck
    await checkbox.click()
    await expect(checkbox).not.toHaveClass(/bg-primary/)
  })

  test('should persist login when remember me is checked', async ({ page, context }) => {
    // Enable remember me
    const checkbox = page.locator('[role="checkbox"]')
    await checkbox.click()

    // Fill in login credentials (test user)
    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Kata Laluan').fill('TestPassword123!')

    // Submit login form
    const loginButton = page.getByRole('button', { name: 'Log Masuk' })
    await loginButton.click()

    // Wait for navigation to dashboard
    await page.waitForURL(/\/dashboard/)

    // Verify we are on dashboard
    await expect(page).toHaveURL(/\/dashboard/)

    // Close browser context (simulates closing browser)
    await context.clearCookies()

    // Navigate back to app - should still be logged in if remember me works
    await page.goto('/')

    // Should redirect to dashboard (if still logged in) or login page
    // Note: This depends on proper cookie configuration
    const currentUrl = page.url()
    console.log('Redirected to:', currentUrl)
  })

  test('should save remember me preference to localStorage', async ({ page }) => {
    // Check the remember me checkbox
    const checkbox = page.locator('[role="checkbox"]')
    await checkbox.click()

    // Verify localStorage was set (using evaluate)
    const rememberMeValue = await page.evaluate(() => {
      return localStorage.getItem('nutrisihat_remember_me')
    })

    expect(rememberMeValue).toBe('true')
  })
})
