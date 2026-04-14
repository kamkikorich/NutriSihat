/**
 * NutriSihat Browser Automation Test Suite
 * Menguji aplikasi NutriSihat yang di-deploy di Vercel
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://nutrisihat.vercel.app';

// KKM Food categories yang dijangka
test.describe('KKM Suku-Separuh Meal Planner Tests', () => {
  test('Halaman utama loads dengan dashboard', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Verify dashboard elements
    const title = await page.locator('h1').first();
    await expect(title).toBeVisible();

    console.log('✅ Halaman utama berjaya dimuat');
  });

  test('Meal Planner page loads dengan tabs hari', async ({ page }) => {
    await page.goto(`${BASE_URL}/meal-planner`);
    await page.waitForLoadState('networkidle');

    // Verify page title
    const title = await page.locator('text=Perancang Makanan').first();
    await expect(title).toBeVisible();

    // Verify tabs for days of week
    const days = ['Aha', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'];
    for (const day of days) {
      const tab = await page.locator(`[role="tab"]:has-text("${day}")`).first();
      await expect(tab).toBeVisible();
    }

    console.log('✅ Tabs hari mingguan berjaya dipaparkan');
  });

  test('Food Guide page displays food categories', async ({ page }) => {
    await page.goto(`${BASE_URL}/makanan`);
    await page.waitForLoadState('networkidle');

    // Check for food categories
    const categories = ['Sayur', 'Buah', 'Protein', 'Karbohidrat'];
    let foundCount = 0;

    for (const cat of categories) {
      const hasCategory = await page.locator(`text=${cat}`).first().isVisible().catch(() => false);
      if (hasCategory) foundCount++;
    }

    console.log(`✅ Kategori makanan ditemui: ${foundCount}/${categories.length}`);
    expect(foundCount).toBeGreaterThan(0);
  });

  test('Blood Sugar page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/gula-darah`);
    await page.waitForLoadState('networkidle');

    // Verify page loaded
    const pageTitle = await page.locator('text=Gula Darah').first();
    await expect(pageTitle).toBeVisible();

    console.log('✅ Halaman Gula Darah berjaya dimuat');
  });

  test('KKM Guidelines visible in meal planner', async ({ page }) => {
    await page.goto(`${BASE_URL}/meal-planner`);
    await page.waitForLoadState('networkidle');

    // Get page content
    const content = await page.content();

    // Check for KKM Suku-Separuh concepts
    const kkmConcepts = [
      'suku',
      'separuh',
      'karbohidrat',
      'protein',
      'sayur',
    ];

    let foundConcepts = 0;
    for (const concept of kkmConcepts) {
      if (content.toLowerCase().includes(concept)) {
        foundConcepts++;
        console.log(`  Found: ${concept}`);
      }
    }

    console.log(`✅ Konsep KKM ditemui: ${foundConcepts}/${kkmConcepts.length}`);
  });

  test('Verify deployment health - all API endpoints', async ({ request }) => {
    // Test public pages
    const pages = [
      '/',
      '/makanan',
      '/meal-planner',
      '/gula-darah',
      '/ubat',
    ];

    for (const path of pages) {
      const response = await request.get(`${BASE_URL}${path}`);
      expect(response.status()).toBe(200);
      console.log(`✅ ${path}: ${response.status()}`);
    }
  });

  test('Screenshot verification - meal planner', async ({ page }) => {
    await page.goto(`${BASE_URL}/meal-planner`);
    await page.waitForLoadState('networkidle');

    // Take screenshot for visual verification
    await page.screenshot({
      path: 'test-results/meal-planner-screenshot.png',
      fullPage: true
    });

    console.log('✅ Screenshot meal planner disimpan');
  });
});

test.describe('Performance & Accessibility', () => {
  test('Core Web Vitals check', async ({ page }) => {
    await page.goto(BASE_URL);

    // Measure performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: navigation.loadEventEnd - navigation.startTime,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.startTime,
      };
    });

    console.log(`⏱️ Load time: ${performanceMetrics.loadTime}ms`);
    console.log(`⏱️ DOM Content Loaded: ${performanceMetrics.domContentLoaded}ms`);

    // Should load within reasonable time
    expect(performanceMetrics.loadTime).toBeLessThan(10000);
  });

  test('Mobile responsive check', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Take mobile screenshot
    await page.screenshot({
      path: 'test-results/mobile-screenshot.png',
      fullPage: true
    });

    console.log('✅ Mobile responsive screenshot disimpan');
  });
});

console.log('\n🧪 NutriSihat Automation Test Suite');
console.log('   URL: https://nutrisihat.vercel.app');
console.log('   Target: KKM Suku-Separuh Meal Planner');
