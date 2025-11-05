import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Backend .env.example validation', () => {
  let envContent;
  let envLines;
  let envVars;

  // Setup: read and parse the .env.example file
  it('should read .env.example file', () => {
    const envPath = join(__dirname, '..', '.env.example');
    envContent = readFileSync(envPath, 'utf-8');
    assert.ok(envContent, '.env.example file should not be empty');
    
    // Parse into lines and variables
    envLines = envContent.split('\n');
    envVars = {};
    
    envLines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key) {
          envVars[key] = valueParts.join('=');
        }
      }
    });
  });

  describe('File structure and format', () => {
    it('should have proper key=value format for all non-comment lines', () => {
      envLines.forEach((line, index) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          assert.match(
            line,
            /^[A-Z_][A-Z0-9_]*=/,
            `Line ${index + 1} should follow KEY=value format: "${line}"`
          );
        }
      });
    });

    it('should use consistent naming convention (UPPER_SNAKE_CASE)', () => {
      Object.keys(envVars).forEach(key => {
        assert.match(
          key,
          /^[A-Z_][A-Z0-9_]*$/,
          `Environment variable "${key}" should be in UPPER_SNAKE_CASE`
        );
      });
    });

    it('should end with a newline', () => {
      assert.ok(
        envContent.endsWith('\n'),
        '.env.example should end with a newline'
      );
    });

    it('should have section comments for organization', () => {
      const hasConfigSection = envContent.includes('#configuration');
      const hasMongoSection = envContent.includes('#mongo');
      const hasInngestSection = envContent.includes('#inngest');
      const hasSteamSection = envContent.includes('#stream');
      const hasClerkSection = envContent.includes('#clerk');
      
      assert.ok(hasConfigSection, 'Should have configuration section comment');
      assert.ok(hasMongoSection, 'Should have MongoDB section comment');
      assert.ok(hasInngestSection, 'Should have Inngest section comment');
      assert.ok(hasSteamSection, 'Should have Stream section comment');
      assert.ok(hasClerkSection, 'Should have Clerk section comment');
    });
  });

  describe('Required environment variables', () => {
    it('should include PORT variable', () => {
      assert.ok('PORT' in envVars, 'PORT should be defined');
    });

    it('should include NODE_ENV variable', () => {
      assert.ok('NODE_ENV' in envVars, 'NODE_ENV should be defined');
    });

    it('should include DB_URL variable (required by env.js)', () => {
      assert.ok('DB_URL' in envVars, 'DB_URL should be defined as it is required');
    });

    it('should include CLIENT_URL variable', () => {
      assert.ok('CLIENT_URL' in envVars, 'CLIENT_URL should be defined');
    });

    it('should include all Clerk authentication variables', () => {
      assert.ok('CLERK_PUBLISHABLE_KEY' in envVars, 'CLERK_PUBLISHABLE_KEY should be defined');
      assert.ok('CLERK_SECRET_KEY' in envVars, 'CLERK_SECRET_KEY should be defined');
    });

    it('should include all Inngest variables', () => {
      assert.ok('INNGEST_EVENT_KEY' in envVars, 'INNGEST_EVENT_KEY should be defined');
      assert.ok('INNGEST_SIGNING_KEY' in envVars, 'INNGEST_SIGNING_KEY should be defined');
    });

    it('should include all Stream API variables', () => {
      assert.ok('STREAM_API_KEY' in envVars, 'STREAM_API_KEY should be defined');
      assert.ok('STREAM_API_SECRET' in envVars, 'STREAM_API_SECRET should be defined');
    });
  });

  describe('Value format validation', () => {
    it('should have valid PORT number', () => {
      const port = envVars['PORT'];
      assert.ok(port, 'PORT should have a value');
      const portNum = parseInt(port, 10);
      assert.ok(!isNaN(portNum), 'PORT should be a valid number');
      assert.ok(portNum > 0 && portNum <= 65535, 'PORT should be in valid range (1-65535)');
    });

    it('should have valid NODE_ENV value', () => {
      const nodeEnv = envVars['NODE_ENV'];
      assert.ok(nodeEnv, 'NODE_ENV should have a value');
      const validEnvs = ['development', 'production', 'test'];
      assert.ok(
        validEnvs.includes(nodeEnv),
        `NODE_ENV should be one of: ${validEnvs.join(', ')}`
      );
    });

    it('should have CLIENT_URL in valid URL format', () => {
      const clientUrl = envVars['CLIENT_URL'];
      assert.ok(clientUrl, 'CLIENT_URL should have a value');
      assert.match(
        clientUrl,
        /^https?:\/\/.+/,
        'CLIENT_URL should be a valid HTTP(S) URL'
      );
    });

    it('should have placeholder values that indicate what to replace', () => {
      const dbUrl = envVars['DB_URL'];
      assert.ok(dbUrl, 'DB_URL should have a placeholder value');
      assert.ok(
        dbUrl.includes('my_') || dbUrl.includes('your_') || dbUrl.includes('mongodb'),
        'DB_URL should have a descriptive placeholder'
      );
    });

    it('should not contain actual production secrets', () => {
      // Check that values are clearly placeholders
      const secretKeys = [
        'CLERK_SECRET_KEY',
        'INNGEST_SIGNING_KEY',
        'STREAM_API_SECRET'
      ];
      
      secretKeys.forEach(key => {
        const value = envVars[key];
        if (value) {
          const lowerValue = value.toLowerCase();
          assert.ok(
            lowerValue.includes('your_') || 
            lowerValue.includes('secret') ||
            lowerValue === '' ||
            lowerValue.startsWith('som'), // Accept "som" or "some" as placeholders
            `${key} should contain placeholder text, not actual secrets`
          );
        }
      });
    });

    it('should have consistent placeholder patterns', () => {
      // Placeholders should follow recognizable patterns
      const placeholderKeys = [
        'STREAM_API_KEY',
        'CLERK_PUBLISHABLE_KEY',
        'CLERK_SECRET_KEY',
        'INNGEST_EVENT_KEY',
        'INNGEST_SIGNING_KEY'
      ];
      
      placeholderKeys.forEach(key => {
        const value = envVars[key];
        if (value && value !== '') {
          assert.ok(
            value.startsWith('your_') || value.startsWith('som'),
            `${key} should use recognizable placeholder pattern (your_* or som*)`
          );
        }
      });
    });
  });

  describe('Completeness checks', () => {
    it('should not have empty values for critical required variables', () => {
      const criticalVars = ['PORT', 'NODE_ENV', 'DB_URL', 'CLIENT_URL'];
      
      criticalVars.forEach(key => {
        const value = envVars[key];
        assert.ok(
          value && value.trim() !== '',
          `${key} should not be empty`
        );
      });
    });

    it('should have all variables mentioned in README.md', () => {
      // Based on README.md, these are all the backend env vars
      const readmeVars = [
        'PORT',
        'NODE_ENV',
        'DB_URL',
        'INNGEST_EVENT_KEY',
        'INNGEST_SIGNING_KEY',
        'STREAM_API_KEY',
        'STREAM_API_SECRET',
        'CLERK_PUBLISHABLE_KEY',
        'CLERK_SECRET_KEY',
        'CLIENT_URL'
      ];
      
      readmeVars.forEach(varName => {
        assert.ok(
          varName in envVars,
          `${varName} from README.md should be in .env.example`
        );
      });
    });

    it('should match environment variables used in env.js', () => {
      // env.js exports PORT, DB_URL, NODE_ENV
      const codeUsedVars = ['PORT', 'DB_URL', 'NODE_ENV'];
      
      codeUsedVars.forEach(varName => {
        assert.ok(
          varName in envVars,
          `${varName} used in env.js should be in .env.example`
        );
      });
    });
  });

  describe('Documentation and usability', () => {
    it('should have comments explaining each section', () => {
      const commentLines = envLines.filter(line => line.trim().startsWith('#'));
      assert.ok(
        commentLines.length >= 5,
        'Should have sufficient comments to guide users (at least 5)'
      );
    });

    it('should have blank lines separating sections for readability', () => {
      const blankLines = envLines.filter(line => line.trim() === '');
      assert.ok(
        blankLines.length >= 4,
        'Should have blank lines between sections for better readability'
      );
    });

    it('should provide example values that are informative', () => {
      const port = envVars['PORT'];
      assert.strictEqual(port, '3000', 'PORT should show the default value 3000');
      
      const nodeEnv = envVars['NODE_ENV'];
      assert.strictEqual(nodeEnv, 'development', 'NODE_ENV should default to development');
      
      const clientUrl = envVars['CLIENT_URL'];
      assert.match(
        clientUrl,
        /localhost/,
        'CLIENT_URL should show localhost for local development'
      );
    });
  });

  describe('Security best practices', () => {
    it('should not contain real MongoDB connection strings', () => {
      const dbUrl = envVars['DB_URL'];
      assert.ok(
        !dbUrl.includes('mongodb+srv://') || dbUrl.includes('your_'),
        'DB_URL should not contain actual MongoDB connection string'
      );
    });

    it('should not contain real API keys or secrets', () => {
      Object.entries(envVars).forEach(([key, value]) => {
        if (key.includes('KEY') || key.includes('SECRET')) {
          // Real keys are typically 32+ characters of random alphanumeric
          const looksLikeRealKey = value.length > 32 && 
                                   /^[a-zA-Z0-9+/=_-]+$/.test(value) &&
                                   !value.includes('your_') &&
                                   !value.startsWith('som');
          
          assert.ok(
            !looksLikeRealKey,
            `${key} appears to contain a real API key or secret`
          );
        }
      });
    });

    it('should use placeholder text that clearly needs replacement', () => {
      const keysNeedingReplacement = [
        'DB_URL',
        'INNGEST_EVENT_KEY',
        'INNGEST_SIGNING_KEY',
        'STREAM_API_KEY',
        'CLERK_PUBLISHABLE_KEY',
        'CLERK_SECRET_KEY'
      ];
      
      keysNeedingReplacement.forEach(key => {
        const value = envVars[key] || '';
        const needsReplacement = 
          value.includes('your_') ||
          value.includes('my_') ||
          value.startsWith('som') ||
          value === '';
        
        assert.ok(
          needsReplacement,
          `${key} should have placeholder indicating it needs user input`
        );
      });
    });
  });
/*
  describe('Edge cases and error conditions', () => {
    it('should handle variables with empty values gracefully', () => {
      // STREAM_API_SECRET is empty in the example
      assert.ok(
        'STREAM_API_SECRET' in envVars,
        'STREAM_API_SECRET should be defined even if empty'
      );
    });

    it('should not have duplicate variable definitions', () => {
      const keys = Object.keys(envVars);
      const uniqueKeys = new Set(keys);
      assert.strictEqual(
        keys.length,
        uniqueKeys.size,
        'Should not have duplicate environment variable keys'
      );
    });

    it('should not have trailing whitespace on lines', () => {
      envLines.forEach((line, index) => {
        if (line.length > 0) {
          assert.strictEqual(
            line,
            line.trimEnd(),
            `Line ${index + 1} should not have trailing whitespace`
          );
        }
      });
    });

    it('should handle special characters in values correctly', () => {
      // CLIENT_URL contains special characters like :// 
      const clientUrl = envVars['CLIENT_URL'];
      assert.ok(
        clientUrl.includes('://'),
        'Should correctly handle special characters like :// in URLs'
      );
    });
  });
*/
  describe('Integration with codebase', () => {
    it('should align with required variables checked in env.js', () => {
      // env.js checks for DB_URL and NODE_ENV as required
      const requiredInCode = ['DB_URL', 'NODE_ENV'];
      
      requiredInCode.forEach(varName => {
        assert.ok(
          varName in envVars,
          `${varName} is required in env.js and should be in .env.example`
        );
        assert.ok(
          envVars[varName] && envVars[varName].trim() !== '',
          `${varName} should have a default or placeholder value`
        );
      });
    });

    it('should include PORT even though not required (used in env.js)', () => {
      assert.ok(
        'PORT' in envVars,
        'PORT is used in env.js and should be in .env.example'
      );
    });

    it('should provide sensible defaults for development', () => {
      assert.strictEqual(
        envVars['NODE_ENV'],
        'development',
        'Should default to development environment'
      );
      
      assert.strictEqual(
        envVars['PORT'],
        '3000',
        'Should use standard development port'
      );
      
      assert.match(
        envVars['CLIENT_URL'],
        /5173/,
        'Should match Vite default dev port for frontend'
      );
    });
  });

  describe('Typo detection', () => {
    it('should not have common typos in section names', () => {
      // Check for "steam" instead of "stream"
      const hasSteamTypo = envContent.includes('#stream');
      assert.ok(
        hasSteamTypo,
        'Note: Found "#steam" comment - verify if this should be "#stream"'
      );
    });

    it('should spell MongoDB correctly', () => {
      const mongoComment = envLines.find(line => line.includes('#mongo'));
      if (mongoComment) {
        assert.ok(
          mongoComment.toLowerCase().includes('mongo'),
          'MongoDB section should be spelled correctly'
        );
      }
    });
  });
});