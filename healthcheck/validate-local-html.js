#!/usr/bin/env node

/**
 * Test validator against local example-response.html
 * Useful for offline testing and development
 */

const fs = require('fs');
const path = require('path');

// Import validation logic and config
const { validateContent } = require('./validate-webpage');

// Configuration matching validate-webpage.js
const config = {
  requiredHeadings: [
    'Chosen by companies and open source projects'
  ],
  requiredElements: ['class=getStarted_Sjon', 'class="navbar__item navbar__link"']
};

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  dim: '\x1b[2m'
};

const exampleFile = path.join(__dirname, 'example-response.html');

console.log(`${colors.dim}Testing validation against local example file...${colors.reset}\n`);

try {
  const html = fs.readFileSync(exampleFile, 'utf8');
  const validation = validateContent(html, config.requiredHeadings, config.requiredElements);

  console.log('='.repeat(70));
  console.log(`${colors.blue}Local Example Validation Results${colors.reset}`);
  console.log('='.repeat(70));
  console.log(`${colors.dim}File: ${exampleFile}${colors.reset}\n`);

  // Headings
  console.log(`${colors.blue}► Required Headings${colors.reset}`);
  Object.entries(validation.headings).forEach(([heading, found]) => {
    if (found) {
      console.log(`  ${colors.green}✓${colors.reset} "${heading}"`);
    } else {
      console.log(`  ${colors.red}✗${colors.reset} "${heading}" ${colors.red}(MISSING)${colors.reset}`);
    }
  });

  // Elements
  console.log(`\n${colors.blue}► Required Elements${colors.reset}`);
  Object.entries(validation.elements).forEach(([element, count]) => {
    if (count > 0) {
      console.log(`  ${colors.green}✓${colors.reset} Found ${count} instance(s) of ${element}`);
    } else {
      console.log(`  ${colors.red}✗${colors.reset} Missing required element: ${element}`);
    }
  });

  // Summary
  console.log(`\n${colors.blue}► Test Result${colors.reset}`);
  if (validation.errors.length === 0) {
    console.log(`  ${colors.green}✓ PASSED${colors.reset} - Example HTML matches expected structure`);
  } else {
    console.log(`  ${colors.red}✗ FAILED${colors.reset} - ${validation.errors.length} error(s):`);
    validation.errors.forEach(error => {
      console.log(`    ${colors.red}•${colors.reset} ${error}`);
    });
  }

  console.log('='.repeat(70) + '\n');

  process.exit(validation.errors.length > 0 ? 1 : 0);

} catch (error) {
  console.error(`${colors.red}✗ ERROR:${colors.reset} ${error.message}\n`);
  process.exit(1);
}
