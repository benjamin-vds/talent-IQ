# Backend .env.example Validation Tests

This directory contains comprehensive validation tests for the `backend/.env.example` file to ensure it remains accurate, secure, and helpful for developers setting up the project.

## Running Tests

```bash
# From the backend directory
npm test

# Or from the repository root
npm test --prefix backend
```

## Test Coverage

### 1. File Structure and Format (5 tests)
- **Key=value format**: Validates all non-comment lines follow proper environment variable syntax
- **Naming convention**: Ensures all variables use UPPER_SNAKE_CASE
- **Newline ending**: Verifies file ends with a newline character
- **Section comments**: Checks for organizational comments (configuration, MongoDB, Inngest, Stream, Clerk)

### 2. Required Environment Variables (7 tests)
Validates presence of all critical environment variables:
- `PORT` - Server port configuration
- `NODE_ENV` - Environment mode (development/production/test)
- `DB_URL` - MongoDB connection string (required by env.js)
- `CLIENT_URL` - Frontend URL for CORS
- `CLERK_PUBLISHABLE_KEY` & `CLERK_SECRET_KEY` - Authentication
- `INNGEST_EVENT_KEY` & `INNGEST_SIGNING_KEY` - Background jobs
- `STREAM_API_KEY` & `STREAM_API_SECRET` - Video streaming

### 3. Value Format Validation (6 tests)
- **PORT**: Must be a valid number between 1-65535
- **NODE_ENV**: Must be one of: development, production, test
- **CLIENT_URL**: Must be a valid HTTP(S) URL format
- **Placeholders**: Verifies descriptive placeholder values (your_*, my_*, som*)
- **No secrets**: Ensures no actual production secrets are committed
- **Consistency**: Checks placeholder patterns are consistent

### 4. Completeness Checks (3 tests)
- **Critical variables**: Ensures PORT, NODE_ENV, DB_URL, CLIENT_URL have values
- **README alignment**: All variables from README.md are present
- **Code usage**: Variables used in env.js are documented

### 5. Documentation and Usability (3 tests)
- **Comments**: At least 5 comment lines to guide users
- **Blank lines**: At least 4 blank lines for readability
- **Informative examples**: PORT=3000, NODE_ENV=development, CLIENT_URL with localhost

### 6. Security Best Practices (3 tests)
- **No real MongoDB strings**: Prevents accidental credential commits
- **No real API keys**: Detects keys longer than 32 characters that look authentic
- **Clear placeholders**: Ensures all secrets have obvious placeholder text

### 7. Edge Cases and Error Conditions (4 tests)
- **Empty values**: Handles variables like STREAM_API_SECRET that may be empty
- **No duplicates**: Ensures each variable is defined only once
- **No trailing whitespace**: Prevents formatting issues
- **Special characters**: Validates URL special characters (://) are handled correctly

### 8. Integration with Codebase (3 tests)
- **env.js alignment**: DB_URL and NODE_ENV are required as per env.js validation
- **PORT inclusion**: PORT is included even though not strictly required
- **Development defaults**: Sensible defaults for local development (port 3000, localhost, Vite port 5173)

### 9. Typo Detection (2 tests)
- **Section name typos**: Flags "#steam" (should be "#stream"?)
- **MongoDB spelling**: Verifies "mongo" is spelled correctly

## What These Tests Prevent

1. **Security Issues**
   - Accidentally committing real API keys or secrets
   - Exposing production database credentials
   - Including live authentication keys

2. **Setup Problems**
   - Missing required environment variables
   - Incorrect value formats (invalid URLs, port numbers)
   - Missing documentation for new variables

3. **Inconsistencies**
   - Divergence between .env.example and actual code requirements
   - Mismatch between backend and frontend configurations
   - README.md and .env.example disagreements

4. **Developer Experience Issues**
   - Unclear placeholder values
   - Missing organizational comments
   - Poor formatting and readability

## Adding New Environment Variables

When adding a new environment variable to the project:

1. Add it to `backend/.env.example` with a clear placeholder value
2. Add an organizational comment if starting a new section
3. Run `npm test` to ensure it follows conventions
4. Update these tests if the variable has special validation requirements
5. Update the README.md to document the new variable

## Test Framework

These tests use Node.js built-in test runner (available in Node 18+):
- Native `node:test` module
- Native `node:assert` module
- No external dependencies required
- Fast execution (<200ms)

## Continuous Integration

These tests should be run:
- Before committing changes to .env.example
- In CI/CD pipelines
- When onboarding new developers
- After updating dependencies that require new env vars

## Example Test Output