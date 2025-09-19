# Playwright + Allure Integration

This project demonstrates how to integrate [Playwright](https://playwright.dev/) end-to-end testing with [Allure](https://docs.qameta.io/allure/) reporting for test reporting and visual regression analysis.

## Features

- Automated browser testing with Playwright
- Visual regression testing with screenshot comparisons
- Allure reporting with screenshot and diff attachments

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Install dependencies:
	```sh
	npm install
	```

2. Install Playwright browsers (if not already):
	```sh
	npx playwright install
	```

3. Download and install Allure:
> ⚠️ **Warning:**  
> Do **not** use the `allure-commandline` npm package — it uses Allure v3 beta, which is not compatible with the Screen Diff Plugin.

- Download the latest stable release from the [Allure GitHub releases page](https://github.com/allure-framework/allure2/releases).
- Unzip the downloaded file and add the `bin` directory to your system's PATH.
- Check installation by running:
    ```sh
    allure --version
    ```

## Running Tests

Run all tests:
```sh
npm run test
# or
npx playwright test
```

Run tests with UI:
```sh
npm run test:ui
# or
npx playwright test --ui
```

Run all tests and update screenshots:
```sh
npm run test -- --update-snapshots
# or
npx playwright test -- --update-snapshots
```

## Allure Reporting

1. Run tests to generate Allure results:
	```sh
    npm run test
	```

2. Generate the Allure report:
	```sh
	allure generate allure-results --clean
	```

3. Open the Allure report:
	```sh
	allure open
	```

## Project Structure

- `tests/` - Example Playwright test specs
- `playwright.config.ts` - Playwright configuration (includes Allure reporter)
- `playwright-report/` - Playwright's built-in HTML report (generated after test run)
- `allure-results/` - Allure raw results (generated after test run)

## Example Test

See `tests/example.spec.ts` for sample tests, including:

- Title and navigation checks
- Visual regression with screenshot comparison

## Visual Regression

Visual regression tests use Playwright's `toHaveScreenshot` assertion. If a screenshot comparison fails, the test attaches actual, expected, and diff images to the Allure report for easy debugging.

## Troubleshooting

- If Allure report generation fails, ensure the `allure-results` folder exists and contains results from a recent test run.
- For Playwright or Allure CLI issues, check the official docs:
  - [Playwright Docs](https://playwright.dev/docs/intro)
  - [Allure Docs](https://docs.qameta.io/allure/)

## License

ISC
