# Playwright + Allure Testing Project

This is a Playwright end-to-end testing framework integrated with Allure reporting and visual regression testing.

## Architecture Overview

**Core Stack:**
- Playwright (v1.55+) for browser automation
- Allure Playwright reporter (v3.4.1) for test reporting with visual diffs
- TypeScript for test implementation

**Critical Dependency:** Allure CLI v2 (stable) is required - **NOT** `allure-commandline` npm package which installs v3 beta and breaks the Screen Diff Plugin. Users must manually install Allure v2 from GitHub releases.

## Test Organization

Tests live in `tests/` directory:
- `example.spec.ts` - Demonstration tests with Allure tags and visual regression
- `saucedemo.spec.ts` - Login page validation example
- `example.spec.ts-snapshots/` - Baseline screenshots per OS/browser (`*-chromium-win32.png`, `*-chromium-linux.png`)

## Key Workflows

### Running Tests Locally
```bash
npm run test                    # Run all tests
npm run test:ui                 # Interactive UI mode
npm run test -- --update-snapshots  # Update visual regression baselines
npm run test:smoke              # Run tests tagged "example"
npm run test:dev                # Run all except "example" tests
```

### Generating Allure Reports
1. Tests auto-generate `allure-results/` with JSON result files and attachments
2. Generate HTML report: `allure generate allure-results --clean`
3. View report: `allure open`

### CI/CD Pipeline
Two GitHub Actions workflows:
- `playwright.yml` - Basic test execution (manual trigger)
- `allure-report.yml` - Advanced workflow with:
  - Manual trigger with test type selection (smoke/nightly/dev)
  - Deploys reports to GitHub Pages under `/<test-type>/` subfolders
  - Maintains history for trend analysis (last 20 reports per type)
  - Uses `simple-elf/allure-report-action@53ebb757` for report generation

## Testing Patterns

### Allure Integration
Import and use Allure decorators from `allure-js-commons`:
```typescript
import * as allure from "allure-js-commons";

test('example', async ({ page }) => {
  await allure.tags("category", "feature");  // Tag tests for filtering
  // test code...
});
```

### Locator Strategy
Prefer `data-test` attributes for stable selectors:
```typescript
page.locator('[data-test="username"]')  // Preferred
page.getByRole('button', { name: 'Login' })  // Fallback for semantic elements
```

### Visual Regression
Use `toHaveScreenshot()` with tolerance for minor pixel differences:
```typescript
await expect(page).toHaveScreenshot({ maxDiffPixels: 100 });
```
When tests fail, Allure automatically attaches actual/expected/diff images as `.imagediff` files in `allure-results/`.

## Configuration

`playwright.config.ts` key settings:
- `testDir: './tests'` - Test location
- `fullyParallel: true` - All tests run in parallel locally
- `workers: process.env.CI ? 1 : undefined` - Serial execution on CI
- `retries: process.env.CI ? 2 : 0` - Auto-retry flaky tests on CI
- `reporter: [['html', { open: 'never' }], ["allure-playwright"]]` - Dual reporting
- Only `chromium` project enabled by default (Firefox/WebKit commented out)

## Project Conventions

- **No base URL** - Tests use absolute URLs (`https://playwright.dev/`, `https://www.saucedemo.com/`)
- **Screenshot naming** - Format: `{test-name}-{variant}-{browser}-{os}.png`
- **Test categorization** - Use Allure tags for smoke/nightly/dev test filtering
- **Trace collection** - `trace: 'on-first-retry'` captures debug info only on failures

## Healthcheck Subdirectory

The `healthcheck/` directory contains a standalone webpage validation tool for lightweight monitoring, independent of the Playwright testing framework.

### Purpose
Zero-dependency Node.js script for validating webpage health through HTTP checks - designed for quick validation without browser automation overhead.

### Core Features
- **HTTP Status Validation** - Verifies expected status codes
- **Response Time Monitoring** - Measures and alerts on slow responses (configurable thresholds)
- **Content Validation** - Checks for required headings and HTML elements
- **Zero Dependencies** - Uses only Node.js built-in modules (`https`, `url`)
- **Fast Execution** - Runs in ~1-2 seconds vs full browser automation

### Key Files
- `validate-webpage.js` - Main validation script with configurable `config` object
- `validate-local-html.js` - Test validator against local HTML file
- `validate.bat` / `validate.sh` - Platform-specific helper scripts
- `example-response.html` - Sample HTML for testing
- `README.md` / `USAGE.md` - Documentation

### Usage Patterns
```bash
# Default URL validation
node validate-webpage.js

# Custom URL via environment variable
TARGET_URL=https://example.com node validate-webpage.js

# Using helper scripts
validate.bat https://example.com  # Windows
./validate.sh https://example.com  # Unix/Linux/macOS
```

### Configuration
Edit the `config` object in `validate-webpage.js`:
- `url` - Target URL to validate
- `timeout` - Request timeout in milliseconds
- `maxResponseTime` - Response time threshold
- `requiredHeadings` - Array of heading text to verify
- `requiredElements` - Array of HTML elements to check

### Exit Codes
- `0` - All validations passed (CI-friendly)
- `1` - Validation failed or error occurred

### When to Use
- **Healthcheck**: Quick uptime/content checks without browser overhead
- **Playwright**: Complex UI interactions, JavaScript execution, visual testing
