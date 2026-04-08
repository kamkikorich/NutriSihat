import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Home Page
 * Tests the main dashboard functionality
 */
test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the app header with correct title', async ({ page }) => {
    // Check header is visible
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Check app name
    await expect(page.locator('h1')).toContainText('NutriSihat');
  });

  test('should display greeting message', async ({ page }) => {
    // Check greeting section - use more specific selector
    const greeting = page.getByRole('heading', { name: /Mak!/ });
    await expect(greeting).toBeVisible();
  });

  test('should display health condition badges', async ({ page }) => {
    // Check for diabetes badge
    await expect(page.getByText('Kencing Manis')).toBeVisible();

    // Check for uterus health badge
    await expect(page.getByText('Kesihatan Rahim')).toBeVisible();
  });

  test('should display safe foods and avoid foods cards', async ({ page }) => {
    // Check safe foods card - use first() to handle multiple matches
    const safeFoodsCard = page.getByRole('link', { name: /Makanan Selamat/ }).first();
    await expect(safeFoodsCard).toBeVisible();

    // Check avoid foods card
    const avoidFoodsCard = page.getByRole('link', { name: /Makanan Perlu Elak/ });
    await expect(avoidFoodsCard).toBeVisible();
  });

  test('should display main action buttons', async ({ page }) => {
    // Check Panduan Makanan button
    await expect(page.getByRole('link', { name: /Panduan Makanan/i }).first()).toBeVisible();

    // Check Ubat button
    await expect(page.getByRole('link', { name: /^Ubat/i }).first()).toBeVisible();

    // Check Gula Darah button
    await expect(page.getByRole('link', { name: /Gula Darah/i }).first()).toBeVisible();

    // Check Tanya AI button
    await expect(page.getByRole('link', { name: /Tanya AI/i }).first()).toBeVisible();
  });

  test('should display bottom navigation', async ({ page }) => {
    // Check bottom nav is visible - use more specific selector
    const bottomNav = page.locator('nav').filter({ hasText: 'Utama' }).last();
    await expect(bottomNav).toBeVisible();

    // Check nav items
    await expect(page.getByRole('link', { name: 'Utama' }).last()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Makanan' }).last()).toBeVisible();
  });

  test('should display important warning section', async ({ page }) => {
    // Check warning section
    await expect(page.getByText('Peringatan Penting')).toBeVisible();
    await expect(page.getByText(/elakkan makanan manis/i)).toBeVisible();
  });

  test('should display safe foods preview section', async ({ page }) => {
    // Check section title
    await expect(page.getByText('Makanan Selamat Hari Ini')).toBeVisible();

    // Check "Lihat Semua" link
    await expect(page.getByRole('link', { name: /Lihat Semua/i })).toBeVisible();
  });
});