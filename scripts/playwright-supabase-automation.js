#!/usr/bin/env node
/**
 * Playwright Automation untuk Supabase Dashboard
 * Automates running SQL migration through Supabase web interface
 *
 * Prerequisites:
 * - Supabase project email/password
 * - Run: npx playwright install chromium
 *
 * Usage: node scripts/playwright-supabase-automation.js
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Configuration - Update these with your Supabase credentials
const SUPABASE_PROJECT_REF = 'oasowmrkydwufexxxwjc'; // Your project reference
const SUPABASE_DASHBOARD_URL = `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}`;
const SQL_EDITOR_URL = `${SUPABASE_DASHBOARD_URL}/sql/new`;

// Read the migration SQL
const migrationPath = path.join(__dirname, '..', 'supabase', 'kkm_meal_planner_migration.sql');
const migrationSql = fs.readFileSync(migrationPath, 'utf-8');

async function runMigrationWithPlaywright() {
  console.log('\n🚀 ===========================================');
  console.log('   Supabase Dashboard Automation');
  console.log('   Playwright-powered SQL Migration');
  console.log('   ===========================================\n');

  // Launch browser
  const browser = await chromium.launch({
    headless: false, // Set to true for headless mode
    slowMo: 100, // Slow down for visibility
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });

  const page = await context.newPage();

  try {
    // Step 1: Navigate to Supabase Dashboard
    console.log('📍 Step 1: Opening Supabase Dashboard...');
    console.log(`   URL: ${SUPABASE_DASHBOARD_URL}`);

    await page.goto(SUPABASE_DASHBOARD_URL);

    // Check if already logged in or needs login
    const needsLogin = await page.locator('input[type="email"]').isVisible().catch(() => false);

    if (needsLogin) {
      console.log('\n⚠️  Login Required');
      console.log('   Please login manually or set up auto-login with:');
      console.log('   1. SUPABASE_EMAIL environment variable');
      console.log('   2. SUPABASE_PASSWORD environment variable');

      // Wait for user to login manually
      console.log('\n⏳ Waiting for manual login (60 seconds)...');
      await page.waitForSelector('text=SQL Editor', { timeout: 60000 });
    }

    // Step 2: Navigate to SQL Editor
    console.log('\n📍 Step 2: Opening SQL Editor...');

    // Click on SQL Editor in the sidebar
    await page.click('text=SQL Editor');
    await page.waitForLoadState('networkidle');

    // Step 3: Create new query
    console.log('\n📍 Step 3: Creating new query...');

    // Look for "New query" button
    const newQueryButton = await page.locator('text=New query').first();
    if (await newQueryButton.isVisible().catch(() => false)) {
      await newQueryButton.click();
      await page.waitForTimeout(1000);
    }

    // Step 4: Paste SQL migration
    console.log('\n📍 Step 4: Pasting migration SQL...');

    // Find the SQL editor textarea or Monaco editor
    const editorSelector = '.monaco-editor, [data-testid="sql-editor"], textarea[placeholder*="SQL"]';

    // Try to find and fill the SQL editor
    const editor = await page.locator(editorSelector).first();

    if (await editor.isVisible().catch(() => false)) {
      // Clear any existing content
      await editor.click();
      await page.keyboard.press('Control+a');
      await page.keyboard.press('Delete');

      // Type the SQL (in chunks if it's too large)
      const chunkSize = 5000;
      for (let i = 0; i < migrationSql.length; i += chunkSize) {
        const chunk = migrationSql.slice(i, i + chunkSize);
        await page.keyboard.type(chunk);
        await page.waitForTimeout(100);
      }

      console.log(`   ✅ Pasted ${migrationSql.length} characters of SQL`);
    } else {
      console.log('   ⚠️  Could not find SQL editor');
      console.log('   Please paste the SQL manually from: supabase/kkm_meal_planner_migration.sql');
    }

    // Step 5: Run the query
    console.log('\n📍 Step 5: Running migration...');

    // Look for Run button
    const runButton = await page.locator('button:has-text("Run"), [data-testid="run-query"]').first();

    if (await runButton.isVisible().catch(() => false)) {
      await runButton.click();
      console.log('   ✅ Migration executed');
    } else {
      console.log('   ⚠️  Could not find Run button');
      console.log('   Please click Run manually');
    }

    // Step 6: Wait for results
    console.log('\n📍 Step 6: Waiting for results...');
    await page.waitForTimeout(5000);

    // Check for success indicators
    const successIndicator = await page.locator('text=Success, text=Rows affected, .success-message').first();
    const errorIndicator = await page.locator('text=Error, .error-message, .toast-error').first();

    if (await successIndicator.isVisible().catch(() => false)) {
      console.log('   ✅ Migration completed successfully!');
    } else if (await errorIndicator.isVisible().catch(() => false)) {
      console.log('   ❌ Migration encountered errors');
      const errorText = await errorIndicator.textContent();
      console.log(`   Error: ${errorText}`);
    } else {
      console.log('   ⏳ Check the results in the browser');
    }

    // Step 7: Take screenshot
    console.log('\n📍 Step 7: Taking screenshot...');
    await page.screenshot({
      path: 'test-results/supabase-migration.png',
      fullPage: true,
    });
    console.log('   ✅ Screenshot saved: test-results/supabase-migration.png');

    console.log('\n✨ ===========================================');
    console.log('   Automation Complete');
    console.log('   ===========================================');
    console.log('\n   Next steps:');
    console.log('   1. Verify migration results in the browser');
    console.log('   2. Test the application at https://nutrisihat.vercel.app');
    console.log('   3. Check Meal Planner shows KKM foods');
    console.log('\n===========================================\n');

    // Keep browser open for user verification
    console.log('⏳ Browser will remain open for 30 seconds...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('\n❌ Automation error:', error.message);
    console.log('\n⚠️  Fallback: Please run the migration manually');
    console.log('   1. Go to: https://app.supabase.com/project/' + SUPABASE_PROJECT_REF);
    console.log('   2. SQL Editor → New Query');
    console.log('   3. Paste content from: supabase/kkm_meal_planner_migration.sql');
    console.log('   4. Click Run');

    // Take error screenshot
    await page.screenshot({
      path: 'test-results/supabase-error.png',
      fullPage: true,
    });

  } finally {
    await browser.close();
    console.log('   Browser closed');
  }
}

// Check if Playwright is installed
async function checkPlaywright() {
  try {
    require('playwright');
    return true;
  } catch (e) {
    return false;
  }
}

// Main
async function main() {
  const hasPlaywright = await checkPlaywright();

  if (!hasPlaywright) {
    console.log('\n❌ Playwright is not installed');
    console.log('\n📦 Installing Playwright...');
    console.log('   Run: npm install -D playwright\n');
    process.exit(1);
  }

  // Check for environment variables (optional)
  if (process.env.SUPABASE_EMAIL && process.env.SUPABASE_PASSWORD) {
    console.log('✅ Found Supabase credentials in environment variables');
  } else {
    console.log('\n⚠️  Note: No auto-login credentials found');
    console.log('   You will need to login manually in the browser');
    console.log('\n   To enable auto-login, set these environment variables:');
    console.log('   - SUPABASE_EMAIL');
    console.log('   - SUPABASE_PASSWORD\n');
  }

  // Run the automation
  await runMigrationWithPlaywright();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
