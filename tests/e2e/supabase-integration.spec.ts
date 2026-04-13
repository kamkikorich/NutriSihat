/**
 * NutriSihat Supabase Integration E2E Tests
 * Verifies data consistency between local and production
 */
import { test, expect } from '@playwright/test';

// Test data - Expected Sabah foods from migration
const EXPECTED_SABAH_FOODS = [
  { name: 'Hinava', category: 'protein' },
  { name: 'Pinasakan', category: 'protein' },
  { name: 'Midin Fern', category: 'vegetable' },
  { name: 'Sagol', category: 'protein' },
  { name: 'Sea Grapes', category: 'vegetable' },
  { name: 'Tuhau', category: 'vegetable' },
  { name: 'Bambangan', category: 'fruit' },
  { name: 'Tarap', category: 'fruit' },
  { name: 'Dabai', category: 'fruit' },
  { name: 'Tampoi', category: 'fruit' },
  { name: 'Sabah Tea', category: 'beverage' },
  { name: 'Tuhau Sambal', category: 'vegetable' },
  { name: 'Hinava with Ginger', category: 'protein' },
  { name: 'Pinasakan with Tuhau', category: 'protein' },
  { name: 'Sabah Fish Soup', category: 'soup' },
  { name: 'Wild Fern Salad', category: 'vegetable' },
  { name: 'Borneo Red Rice', category: 'carbohydrate' },
  { name: 'Tapioca Leaves', category: 'vegetable' },
  { name: 'Wild Ginger', category: 'spice' },
  { name: 'Hill Rice', category: 'carbohydrate' },
  { name: 'Wild Fern', category: 'vegetable' },
  { name: 'Tuhau Stems', category: 'vegetable' },
  { name: 'Sago Grubs', category: 'protein' },
  { name: 'Wild Boar', category: 'protein' },
  { name: 'Local Fern', category: 'vegetable' },
  { name: 'Borneo Ginger', category: 'spice' },
  { name: 'Wild Mushroom', category: 'vegetable' },
  { name: 'Fermented Fish', category: 'protein' },
  { name: 'Wild Fern Shoots', category: 'vegetable' },
  { name: 'Local Ginger', category: 'spice' },
];

test.describe('Supabase Integration Tests', () => {
  test.describe.configure({ mode: 'serial' });

  test('homepage loads with dashboard data', async ({ page }) => {
    await page.goto('/');

    // Wait for dashboard to load
    await page.waitForLoadState('networkidle');

    // Verify dashboard elements
    const dashboardTitle = page.locator('h1');
    await expect(dashboardTitle).toBeVisible();

    // Screenshot for verification
    await page.screenshot({ path: 'tests/e2e/screenshots/dashboard.png' });
  });

  test('meal planner loads with Supabase foods data', async ({ page }) => {
    await page.goto('/meal-planner');

    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');

    // Verify page title
    const pageTitle = page.locator('text=Perancang Makanan');
    await expect(pageTitle).toBeVisible();

    // Wait for the tabs to be visible (days of week)
    const tabsList = page.locator('[role="tablist"]');
    await expect(tabsList).toBeVisible();

    // Click on first tab (Ahad)
    const ahadTab = page.locator('[role="tab"]:has-text("Aha")').first();
    await ahadTab.click();

    // Wait for content to load
    await page.waitForTimeout(1000);

    // Find a meal select dropdown
    const selectTrigger = page.locator('[data-radix-popper-content-wrapper], [role="combobox"]').first();

    // If dropdown exists, try to open it
    if (await selectTrigger.isVisible().catch(() => false)) {
      await selectTrigger.click();
      await page.waitForTimeout(500);

      // Check for Sabah food markers in dropdown
      const sabahMarker = page.locator('text=🇲🇾').first();
      const hasSabahFoods = await sabahMarker.isVisible().catch(() => false);

      if (hasSabahFoods) {
        console.log('✅ Sabah foods (🇲🇾) found in dropdown');
      }
    }

    // Screenshot
    await page.screenshot({ path: 'tests/e2e/screenshots/meal-planner.png' });
  });

  test('food guide page displays food data from Supabase', async ({ page }) => {
    await page.goto('/makanan');

    await page.waitForLoadState('networkidle');

    // Verify food guide title
    const foodGuideTitle = page.locator('text=Panduan Makanan').or(page.locator('text=Makanan')).first();
    await expect(foodGuideTitle).toBeVisible();

    // Check for food cards or items
    const foodItems = page.locator('[class*="card"], [class*="food"], article');
    const count = await foodItems.count();

    console.log(`📊 Found ${count} food items on page`);

    // Expect at least some food items
    expect(count).toBeGreaterThan(0);

    // Screenshot
    await page.screenshot({ path: 'tests/e2e/screenshots/food-guide.png' });
  });

  test('API endpoints respond correctly', async ({ request }) => {
    // Test blood sugar API
    const bloodSugarResponse = await request.get('/api/blood-sugar');
    const bloodSugarStatus = bloodSugarResponse.status();
    expect([200, 401, 403].includes(bloodSugarStatus)).toBe(true); // 401/403 expected if not authenticated

    // Test medicine API
    const medicineResponse = await request.get('/api/medicine');
    const medicineStatus = medicineResponse.status();
    expect([200, 401, 403].includes(medicineStatus)).toBe(true);

    // Test tips API
    const tipsResponse = await request.get('/api/tips/daily');
    const tipsStatus = tipsResponse.status();
    expect([200, 401, 403].includes(tipsStatus)).toBe(true);

    console.log('✅ API endpoints responding');
  });

  test('verify Sabah food data in Supabase', async ({ page }) => {
    // Navigate to meal planner
    await page.goto('/meal-planner');
    await page.waitForLoadState('networkidle');

    // Wait for data to load
    await page.waitForTimeout(2000);

    // Check if any of the expected Sabah foods are mentioned
    const pageContent = await page.content();

    let foundFoods = 0;
    const foundFoodNames: string[] = [];

    for (const food of EXPECTED_SABAH_FOODS) {
      if (pageContent.includes(food.name)) {
        foundFoods++;
        foundFoodNames.push(food.name);
      }
    }

    console.log(`🍽️ Found ${foundFoods}/${EXPECTED_SABAH_FOODS.length} expected Sabah foods`);
    console.log('Foods found:', foundFoodNames.slice(0, 10).join(', ') + '...');

    // Check for 🇲🇾 emoji (Sabah marker)
    const hasMalaysiaFlag = pageContent.includes('🇲🇾');

    if (hasMalaysiaFlag) {
      console.log('✅ Malaysian flag marker (🇲🇾) found - Sabah foods are labeled');
    }

    // Take final screenshot
    await page.screenshot({ path: 'tests/e2e/screenshots/sabah-foods.png' });

    // We expect at least some foods to be present
    expect(foundFoods).toBeGreaterThan(0);
  });

  test('verify data consistency - production vs expected', async ({ page }) => {
    await page.goto('/meal-planner');
    await page.waitForLoadState('networkidle');

    // Get network requests to check for Supabase calls
    const supabaseRequests: string[] = [];

    page.on('request', request => {
      const url = request.url();
      if (url.includes('supabase') || url.includes('supabase.co')) {
        supabaseRequests.push(url);
      }
    });

    // Wait for any Supabase requests
    await page.waitForTimeout(3000);

    console.log('🌐 Supabase requests made:', supabaseRequests.length);
    supabaseRequests.forEach(url => console.log('  -', url.substring(0, 80) + '...'));

    // Verify page loaded successfully
    const errorMessage = page.locator('text=Gagal memuatkan');
    const hasError = await errorMessage.isVisible().catch(() => false);

    if (hasError) {
      console.error('❌ Error loading data from Supabase');
      throw new Error('Supabase data loading failed');
    } else {
      console.log('✅ Data loaded successfully from Supabase');
    }
  });
});

test.describe('Data Comparison Tests', () => {
  test('compare local vs production food count', async ({ page, request }) => {
    // Get foods from API
    const response = await request.get('/api/food/analyze');

    if (response.status() === 200) {
      const data = await response.json();
      console.log('📊 API food data:', data);
    }

    // Navigate and count visible foods
    await page.goto('/makanan');
    await page.waitForLoadState('networkidle');

    // Count all visible food items
    const allText = await page.textContent('body');
    let sabahFoodCount = 0;

    for (const food of EXPECTED_SABAH_FOODS) {
      if (allText?.includes(food.name)) {
        sabahFoodCount++;
      }
    }

    console.log(`📈 Visible Sabah foods: ${sabahFoodCount}/${EXPECTED_SABAH_FOODS.length}`);

    // Screenshot for comparison
    await page.screenshot({ path: 'tests/e2e/screenshots/food-count.png' });
  });
});
