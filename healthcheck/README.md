## Webpage Validator (`validate-webpage.js`)

A lightweight, zero-dependency JavaScript validation script for monitoring webpage health.

### Features

- ✅ **HTTP Status Validation** - Checks response status code
- ⏱️ **Response Time Monitoring** - Measures and alerts on slow responses
- 📄 **Content Validation** - Verifies required page elements:
  - Configurable heading text validation
  - Configurable HTML element/attribute validation
  - All criteria defined in `config` object

### Requirements

- Node.js (v12+)
- **No external dependencies** - uses only built-in Node.js modules

### Usage

**Basic Usage:**
```bash
node validate-webpage.js
```

**Custom URL:**
```bash
TARGET_URL=https://example.com node validate-webpage.js
```

**Using Helper Scripts:**
```bash
# Windows
validate.bat
validate.bat https://example.com

# Linux/macOS
chmod +x validate.sh
./validate.sh
./validate.sh https://example.com
```

**Test Against Local Example:**
```bash
node validate-local-html.js
```

### Configuration

Edit the `config` object in the script to customize validation parameters.

### Exit Codes

- `0` - All validations passed
- `1` - Validation failed or error occurred

### Performance

- **Execution time**: ~1-2 seconds (depending on network)
- **Memory footprint**: Minimal (~10-20 MB)
- **No package installation** required
- **Fast startup**: No dependency loading
