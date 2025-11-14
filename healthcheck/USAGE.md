# Webpage Validation Script

## Quick Start

```bash
# Validate the default URL
node validate-webpage.js

# Validate a custom URL
TARGET_URL=https://example.com node validate-webpage.js

# Test against local example file
node validate-local-html.js
```

## What It Validates

✅ **HTTP Status Code**: Checks response status (configurable expected status)  
✅ **Response Time**: Measures and warns if exceeds threshold (configurable)  
✅ **Required Headings**: Validates presence of specified heading elements  
✅ **Content Structure**: Verifies required HTML elements are present (configurable)

> All validation criteria are defined in the `config` object - see Configuration section below

## Features

- **Zero dependencies** - Uses only Node.js built-in modules
- **Fast execution** - Runs in ~1-2 seconds
- **Colored output** - Easy to read terminal results
- **Exit codes** - Integrates with CI/CD (0=pass, 1=fail)
- **Configurable** - Edit thresholds in the config object

## Files

| File | Purpose |
|------|---------|
| `validate-webpage.js` | Main validation script |
| `validate-local-html.js` | Test validator against local HTML file |
| `validate.bat` | Windows helper script |
| `validate.sh` | Unix/Linux/macOS helper script |
| `example-response.html` | Example HTML response for testing |

## Example Output

### Success
```
======================================================================
Webpage Validation Report
======================================================================
URL: https://playwright.dev/
Timestamp: 2025-11-13T10:12:19.118Z

► HTTP Status
  ✓ Status: 200 OK

► Response Time
  ✓ Response time: 564ms

► Content Validation
  Headings:
    ✓ "Heading 1"
    ✓ "Heading 2"
    ✓ "2025"
    ✓ "Another Required Heading"
  Elements:
    ✓ Found 2 instance(s) of class="news-article"
    ✓ Found 1 instance(s) of id="main-content"

► Summary
  ✓ PASSED - All validations successful
======================================================================
```

### Failure
```
► HTTP Status
  ✗ Status: 404 Not Found

► Content Validation
  Headings:
    ✗ "Heading 1" (MISSING)
    ✓ "Heading 2"
    ✓ "2025"
    ✗ "Another Required Heading" (MISSING)
  Elements:
    ✗ Missing required element: class="news-article"
    ✓ Found 1 instance(s) of id="main-content"

► Summary
  ✗ FAILED - 3 error(s) found
    • Missing heading: "Heading 1"
    • Missing heading: "Another Required Heading"
    • Missing required element: class="news-article"
```

## Configuration

Edit `config` object in `validate-webpage.js` to customize validation criteria:

```javascript
const config = {
  url: process.env.TARGET_URL || 'https://example.com',  // Target URL
  timeout: 10000,                    // Request timeout in milliseconds
  maxResponseTime: 3000,             // Warning threshold in milliseconds
  requiredHeadings: [                // List of required heading text
    'Heading 1',
    'Heading 2',
    new Date().getFullYear().toString()
  ],
  requiredElements: [                // List of required element patterns
    'class="news-article"',
    'id="main-content"'
  ]
};
```

**Configuration Options:**
- `url` - Target webpage to validate
- `timeout` - Maximum time to wait for response (ms)
- `maxResponseTime` - Threshold for slow response warning (ms)
- `requiredHeadings` - Array of heading text that must be present
- `requiredElements` - Array of HTML patterns/attributes to search for

## Integration Examples

### GitHub Actions
```yaml
- name: Health Check
  run: node healthcheck/validate-webpage.js
```

### Cron Job (Linux)
```bash
# Every hour
0 * * * * cd /path/to/project/healthcheck && node validate-webpage.js >> validation.log 2>&1
```

### PowerShell Scheduled Task (Windows)
```powershell
$action = New-ScheduledTaskAction -Execute "node" -Argument "C:\path\to\healthcheck\validate-webpage.js"
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Hours 1)
Register-ScheduledTask -Action $action -Trigger $trigger -TaskName "WebpageHealthCheck"
```

### Monitoring with Alert
```bash
#!/bin/bash
node validate-webpage.js
if [ $? -ne 0 ]; then
    # Send alert (email, Slack, etc.)
    echo "Website validation failed!" | mail -s "Alert" admin@example.com
fi
```

## Performance Comparison

| Tool | Execution Time | Memory | Dependencies |
|------|---------------|--------|--------------|
| **validate-webpage.js** | ~1-2s | ~15 MB | 0 (built-in only) |
| Playwright | ~5-10s | ~100+ MB | Multiple packages |
| Puppeteer | ~4-8s | ~80+ MB | Multiple packages |

## When to Use This vs Playwright

### Use this lightweight script when:
- ✅ Monitoring production uptime
- ✅ Quick health checks in CI/CD
- ✅ Validating static content
- ✅ Resource-constrained environments
- ✅ Need fast feedback loops

### Use Playwright when:
- 🎭 Testing JavaScript-heavy pages
- 🎭 Validating user interactions
- 🎭 Visual regression testing
- 🎭 Complex workflows
- 🎭 Cross-browser testing

## Troubleshooting

**SSL Certificate Errors**
```javascript
// Not recommended for production, but if needed:
// Add to options in fetchPage function:
rejectUnauthorized: false
```

**Slow Responses**
- Increase `timeout` in config
- Adjust `maxResponseTime` threshold

**Missing Headings**
- Verify exact text (case-sensitive)
- Check for HTML entities
- View source of the page
