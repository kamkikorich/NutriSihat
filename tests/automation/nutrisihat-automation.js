#!/usr/bin/env node
/**
 * NutriSihat BrowserOS Automation Script
 * Automates testing of the deployed NutriSihat application
 *
 * Usage: node nutrisihat-automation.js
 */

const BASE_URL = 'https://nutrisihat.vercel.app';

// Test scenarios
const testScenarios = [
  {
    name: 'Verify Landing Page',
    action: 'navigate',
    url: BASE_URL,
    checks: [
      'title contains "NutriSihat"',
      'h1 is visible',
      'dashboard cards are visible',
    ],
  },
  {
    name: 'Navigate to Meal Planner',
    action: 'navigate',
    url: `${BASE_URL}/meal-planner`,
    checks: [
      'text "Perancang Makanan" is visible',
      'tabs for days of week are visible',
      '7 day tabs exist',
    ],
  },
  {
    name: 'Test Meal Planner Tabs',
    action: 'click_sequence',
    elements: [
      { selector: '[role="tab"]:has-text("Isn")', description: 'Isnin tab' },
      { selector: '[role="tab"]:has-text("Sel")', description: 'Selasa tab' },
      { selector: '[role="tab"]:has-text("Rab")', description: 'Rabu tab' },
    ],
    checks: [
      'tab content changes',
      'meal slots are visible',
    ],
  },
  {
    name: 'Navigate to Food Guide',
    action: 'navigate',
    url: `${BASE_URL}/makanan`,
    checks: [
      'text "Panduan Makanan" is visible',
      'food cards are visible',
      'category filters exist',
    ],
  },
  {
    name: 'Navigate to Blood Sugar',
    action: 'navigate',
    url: `${BASE_URL}/gula-darah`,
    checks: [
      'text "Gula Darah" is visible',
      'input fields for readings exist',
    ],
  },
  {
    name: 'Test KKM Content',
    action: 'verify_content',
    url: `${BASE_URL}/meal-planner`,
    expectedTerms: [
      'suku',
      'separuh',
      'karbohidrat',
      'protein',
      'sayur',
    ],
    checks: [
      'KKM guidelines are present',
      'Suku-Separuh concept is explained',
    ],
  },
  {
    name: 'Screenshot for Documentation',
    action: 'screenshot',
    urls: [
      BASE_URL,
      `${BASE_URL}/meal-planner`,
      `${BASE_URL}/makanan`,
    ],
    outputDir: './test-results/',
    checks: [
      'screenshots saved successfully',
    ],
  },
];

// Report template
const generateReport = (results) => {
  const timestamp = new Date().toISOString();
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;

  return `
╔═══════════════════════════════════════════════════════════╗
║     NutriSihat Automation Test Report                     ║
╠═══════════════════════════════════════════════════════════╣
║  URL:     ${BASE_URL.padEnd(49)}║
║  Time:    ${timestamp.padEnd(49)}║
║  Status:  ${`${passed} passed, ${failed} failed`.padEnd(49)}║
╚═══════════════════════════════════════════════════════════╝

Test Results:
${results.map(r => `  ${r.status === 'PASS' ? '✅' : '❌'} ${r.name}`).join('\n')}

Summary:
  - Landing Page: ${results.find(r => r.name.includes('Landing'))?.status || 'N/A'}
  - Meal Planner: ${results.find(r => r.name.includes('Meal Planner'))?.status || 'N/A'}
  - Food Guide: ${results.find(r => r.name.includes('Food Guide'))?.status || 'N/A'}
  - Blood Sugar: ${results.find(r => r.name.includes('Blood Sugar'))?.status || 'N/A'}
  - KKM Content: ${results.find(r => r.name.includes('KKM'))?.status || 'N/A'}
`;
};

// Export for use with BrowserOS MCP
module.exports = {
  BASE_URL,
  testScenarios,
  generateReport,
};

// If run directly
if (require.main === module) {
  console.log('🤖 NutriSihat Browser Automation');
  console.log(`   Target: ${BASE_URL}`);
  console.log('   Mode: BrowserOS MCP Agent\n');
  console.log('Test Scenarios:');
  testScenarios.forEach((scenario, i) => {
    console.log(`  ${i + 1}. ${scenario.name}`);
  });
  console.log('\nRun with BrowserOS MCP tools to execute automation.');
}
