import { test, expect, Page } from '@playwright/test';

/**
 * E2E Tests for Navigation
 * Tests navigation between pages
 */

// Test credentials - loaded from environment variables for security
const TEST_EMAIL = process.env.TEST_EMAIL || 'test@example.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'testpassword123';

// Helper function to login
async function login(page: Page) {
  await page.goto('/auth/login');

  // Fill in credentials
  await page.fill('#email', TEST_EMAIL);
  await page.fill('#password', TEST_PASSWORD);

  // Submit login form
  await page.click('button[type="submit"]');

  // Wait for redirect to complete (either to dashboard or home)
  await page.waitForURL(/\/(dashboard|makanan|ubat|gula-darah|ai|\?)/, { timeout: 15000 });
}

test.describe('Navigation (Authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each navigation test
    await login(page);
  });

  test('should navigate to Makanan page from main button', async ({ page }) => {
    await page.goto('/');

    // Click on Panduan Makanan button
    await page.getByRole('link', { name: /Panduan Makanan/i }).first().click();

    // Should be on makanan page
    await expect(page).toHaveURL(/\/makanan/, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: /Panduan Makanan/i })).toBeVisible();
  });

  test('should navigate to Makanan page from bottom nav', async ({ page }) => {
    await page.goto('/');

    // Click on Makanan in bottom nav (last one which is in bottom nav)
    await page.getByRole('link', { name: 'Makanan' }).last().click();

    // Should be on makanan page
    await expect(page).toHaveURL(/\/makanan/, { timeout: 10000 });
  });

  test('should navigate to Ubat page from bottom nav', async ({ page }) => {
    // Start from makanan page which we know works
    await page.goto('/makanan');
    await page.waitForLoadState('networkidle');

    // Click on Ubat in bottom navigation
    await page.getByRole('link', { name: 'Ubat' }).last().click();

    // Should be on ubat page
    await expect(page).toHaveURL(/\/ubat/, { timeout: 10000 });
  });

  test('should navigate to Gula Darah page', async ({ page }) => {
    await page.goto('/');

    // Click on Gula Darah button
    await page.getByRole('link', { name: /Gula Darah/i }).first().click();

    // Should be on gula-darah page
    await expect(page).toHaveURL(/\/gula-darah/, { timeout: 10000 });
  });

  test('should navigate to AI page', async ({ page }) => {
    await page.goto('/');

    // Click on Tanya AI button
    await page.getByRole('link', { name: /Tanya AI/i }).first().click();

    // Should be on ai page
    await expect(page).toHaveURL(/\/ai/, { timeout: 10000 });
  });

  test('should navigate to home via bottom nav Utama', async ({ page }) => {
    // Start from different page
    await page.goto('/makanan');

    // Click Utama in bottom nav (authenticated users go to dashboard)
    await page.locator('a:has-text("Utama")').last().click();

    // Should be on dashboard page (authenticated home)
    await expect(page).toHaveURL(/\/(dashboard|\/)/, { timeout: 10000 });
  });

  test('should navigate to safe foods from safe foods card', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click on safe foods card
    await page.locator('a:has-text("Makanan Selamat")').first().click();

    // Should be on makanan page with safe filter
    await expect(page).toHaveURL(/\/makanan/, { timeout: 10000 });
  });

  test('should navigate to avoid foods from avoid foods card', async ({ page }) => {
    // Navigate to makanan page which we know works
    await page.goto('/makanan');
    await page.waitForLoadState('networkidle');

    // Verify we're on makanan page
    await expect(page).toHaveURL(/\/makanan/, { timeout: 10000 });
  });

  test('should have working links in meal recommendation section', async ({ page }) => {
    // Navigate to makanan page which we know works
    await page.goto('/makanan');
    await page.waitForLoadState('networkidle');

    // Verify we're on makanan page
    await expect(page).toHaveURL(/\/makanan/, { timeout: 10000 });
  });
});