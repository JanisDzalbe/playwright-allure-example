#!/usr/bin/env node

/**
 * Lightweight webpage validator
 * Validates response status, timing, and content structure
 * Uses only Node.js built-in modules (no external dependencies)
 */

const https = require('https');
const { URL } = require('url');


/**
 * Validation results for HTML content structure
 * @typedef {Object} Configuration
 * @property {string} url - Target URL to validate
 * @property {number} timeout - Request timeout in milliseconds
 * @property {number} maxResponseTime - Maximum acceptable response time in milliseconds
 * @property {string[]} requiredHeadings - List of required headings to check in HTML
 * @property {string[]} requiredElements - List of required HTML elements to check in HTML
 */

/**
 * HTTP response object with status, timing, and content
 * @typedef {Object} HttpResponse
 * @property {number} statusCode - The HTTP status code
 * @property {string} statusMessage - The HTTP status message
 * @property {number} responseTime - Response time in milliseconds
 * @property {string} html - The HTML content of the response
 * @property {object} headers - HTTP response headers
 */

/**
 * Validation results for HTML content structure
 * @typedef {Object} ValidationResult
 * @property {Object<string, boolean>} headings - Map of required headings to their presence status
 * @property {Object<string, number>} elements - Map of required elements to their count
 * @property {string[]} errors - Array of validation error messages
 * @property {string[]} warnings - Array of validation warning messages
 */

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    dim: '\x1b[2m'
};

/**
 * Fetch webpage and measure response time
 * @param {string} url - The URL to fetch
 * @param {number} timeout - Request timeout in milliseconds
 * @returns {Promise<HttpResponse>} Response object with status, timing, and content
 */
function fetchPage(url, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const urlObj = new URL(url);

        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || 443,
            path: urlObj.pathname + urlObj.search,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: timeout
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const responseTime = Date.now() - startTime;
                resolve({
                    statusCode: res.statusCode,
                    statusMessage: res.statusMessage,
                    responseTime,
                    html: data,
                    headers: res.headers
                });
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error(`Request timeout after ${timeout}ms`));
        });

        req.end();
    });
}

/**
 * Validate HTML content structure
 * @param {string} html - The HTML content to validate
 * @param {string[]} requiredHeadings - List of required headings to check
 * @param {string[]} requiredElements - List of required elements to check
 * @returns {ValidationResult} Validation results object
 */
function validateContent(html, requiredHeadings, requiredElements) {
    const results = {
        headings: {},
        elements: {},
        errors: [],
        warnings: []
    };

    // Check for required headings
    requiredHeadings.forEach(heading => {
        // Handle HTML entities in heading text
        const escapedHeading = heading
            .replace(/'/g, "(?:'|&#x27;|&#39;)")
            .replace(/"/g, '(?:"|&quot;)');

        const headingRegex = new RegExp(`<h[1-6][^>]*>\\s*${escapedHeading}\\s*</h[1-6]>`, 'i');
        const found = headingRegex.test(html);

        results.headings[heading] = found;

        if (!found) {
            results.errors.push(`Missing heading: "${heading}"`);
        }
    });

    // Handle required elements 
    for (const element of requiredElements) {
        const elementRegex = new RegExp(element, 'g');
        const matches = html.match(elementRegex);
        const count = matches ? matches.length : 0;
        results.elements[element] = count;

        if (count === 0) {
            results.errors.push(`Missing required element: ${element}`);
        }
    }

    return results;
}

/**
 * Format and print validation results
 * @param {HttpResponse} response - HTTP response object
 * @param {ValidationResult} validation - Validation results object
 * @param {Configuration} configuration - Configuration object
 * @returns {number} Exit code (0 for success, 1 for failure)
 */
function printResults(response, validation, configuration) {
    console.log('\n' + '='.repeat(70));
    console.log(`${colors.blue}Webpage Validation Report${colors.reset}`);
    console.log('='.repeat(70));
    console.log(`${colors.dim}URL: ${configuration.url}${colors.reset}`);
    console.log(`${colors.dim}Timestamp: ${new Date().toISOString()}${colors.reset}\n`);

    // Status Check
    console.log(`${colors.blue}► HTTP Status${colors.reset}`);
    if (response.statusCode === 200) {
        console.log(`  ${colors.green}✓${colors.reset} Status: ${response.statusCode} ${response.statusMessage}`);
    } else {
        console.log(`  ${colors.red}✗${colors.reset} Status: ${response.statusCode} ${response.statusMessage}`);
    }

    // Response Time Check
    console.log(`\n${colors.blue}► Response Time${colors.reset}`);
    if (response.responseTime < configuration.maxResponseTime) {
        console.log(`  ${colors.green}✓${colors.reset} Response time: ${response.responseTime}ms`);
    } else {
        console.log(`  ${colors.yellow}⚠${colors.reset} Response time: ${response.responseTime}ms (threshold: ${configuration.maxResponseTime}ms)`);
    }

    // Content Validation
    console.log(`\n${colors.blue}► Content Validation${colors.reset}`);

    // Headings
    console.log(`  Headings:`);
    Object.entries(validation.headings).forEach(([heading, found]) => {
        if (found) {
            console.log(`    ${colors.green}✓${colors.reset} "${heading}"`);
        } else {
            console.log(`    ${colors.red}✗${colors.reset} "${heading}" ${colors.red}(MISSING)${colors.reset}`);
        }
    });

    // Elements
    console.log(`  Elements:`);
    Object.entries(validation.elements).forEach(([element, count]) => {
        if (count > 0) {
            console.log(`    ${colors.green}✓${colors.reset} Found ${count} instance(s) of ${element}`);
        } else {
            console.log(`    ${colors.red}✗${colors.reset} Missing required element: ${element}`);
        }
    });

    // Summary
    console.log(`\n${colors.blue}► Summary${colors.reset}`);
    const hasErrors = validation.errors.length > 0 || response.statusCode !== 200;
    const hasWarnings = response.responseTime >= configuration.maxResponseTime;

    if (hasErrors) {
        console.log(`  ${colors.red}✗ FAILED${colors.reset} - ${validation.errors.length} error(s) found`);
        validation.errors.forEach(error => {
            console.log(`    ${colors.red}•${colors.reset} ${error}`);
        });
    } else {
        console.log(`  ${colors.green}✓ PASSED${colors.reset} - All validations successful`);
    }

    if (hasWarnings) {
        console.log(`  ${colors.yellow}⚠ WARNING${colors.reset} - Slow response time detected`);
    }

    console.log('='.repeat(70) + '\n');

    return hasErrors ? 1 : 0;
}

/**
 * Main execution
 * @param {Configuration} configuration - Configuration object for validation
 * @returns {Promise<void>}
 */
async function main(configuration) {
    console.log(`${colors.dim}Starting webpage validation...${colors.reset}`);

    try {
        const response = await fetchPage(configuration.url, configuration.timeout);
        const validation = validateContent(response.html, configuration.requiredHeadings, configuration.requiredElements);
        const exitCode = printResults(response, validation, configuration);

        process.exit(exitCode);
    } catch (error) {
        console.error(`\n${colors.red}✗ ERROR:${colors.reset} ${error.message}\n`);
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    /** @type {Configuration} */
    const playwrightDevConfig = {
        url: process.env.TARGET_URL || 'https://playwright.dev/',
        timeout: 10000, // 10 seconds
        maxResponseTime: 3000, // 3 seconds warning threshold
        requiredHeadings: [
            "Chosen by companies and open source projects"
        ],
        requiredElements: ['class=getStarted_Sjon', 'class="navbar__item navbar__link"']
    };
    main(playwrightDevConfig);
}

module.exports = { fetchPage, validateContent, main };
