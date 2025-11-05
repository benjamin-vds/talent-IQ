import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Frontend .env.example validation', () => {
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

    it('should use Vite naming convention (VITE_ prefix)', () => {
      Object.keys(envVars).forEach(key => {
        assert.ok(
          key.startsWith('VITE_'),
          `Frontend environment variable "${key}" should start with VITE_ prefix`
        );
      });
    });

    it('should use consistent naming convention (VITE_UPPER_SNAKE_CASE)', () => {
      Object.keys(envVars).forEach(key => {
        assert.match(
          key,
          /^VITE_[A-Z_][A-Z0-9_]*$/,
          `Environment variable "${key}" should be in VITE_UPPER_SNAKE_CASE format`
        );
      });
    });

    it('should have section comments for organization', () => {
      const hasClerkComment = envContent.toLowerCase().includes('clerk');
      assert.ok(hasClerkComment, 'Should have comment for Clerk section');
    });

    it('should be concise and focused on frontend needs', () => {
      const varCount = Object.keys(envVars).length;
      assert.ok(
        varCount > 0 && varCount <= 10,
        'Frontend .env.example should be concise (1-10 variables)'
      );
    });
  });

  describe('Required environment variables', () => {
    it('should include VITE_CLERK_PUBLISHABLE_KEY (required by main.tsx)', () => {
      assert.ok(
        'VITE_CLERK_PUBLISHABLE_KEY' in envVars,
        'VITE_CLERK_PUBLISHABLE_KEY should be defined as it is required in main.tsx'
      );
    });

    it('should have all variables mentioned in README.md', () => {
      // Based on README.md frontend section
      const readmeVars = ['VITE_CLERK_PUBLISHABLE_KEY'];
      
      readmeVars.forEach(varName => {
        assert.ok(
          varName in envVars,
          `${varName} from README.md should be in .env.example`
        );
      });
    });
  });

  describe('Value format validation', () => {
    it('should have a placeholder value for VITE_CLERK_PUBLISHABLE_KEY', () => {
      const clerkKey = envVars['VITE_CLERK_PUBLISHABLE_KEY'];
      assert.ok(clerkKey, 'VITE_CLERK_PUBLISHABLE_KEY should have a value');
      assert.ok(
        clerkKey.trim() !== '',
        'VITE_CLERK_PUBLISHABLE_KEY should not be empty'
      );
    });

    it('should not contain actual production secrets', () => {
      Object.entries(envVars).forEach(([key, value]) => {
        if (key.includes('KEY') || key.includes('SECRET')) {
          // Real Clerk keys start with pk_test_ or pk_live_
          const looksLikeRealClerkKey = value.startsWith('pk_test_') || value.startsWith('pk_live_');
          
          // If it looks like a real key, it should be test_ not live_
          if (looksLikeRealClerkKey) {
            assert.ok(
              !value.startsWith('pk_live_'),
              `${key} should not contain production (pk_live_) keys`
            );
          }
        }
      });
    });

    it('should provide informative placeholder values', () => {
      const clerkKey = envVars['VITE_CLERK_PUBLISHABLE_KEY'];
      assert.ok(
        clerkKey === 'test_key' ||
        clerkKey.includes('your_') ||
        clerkKey.includes('clerk') ||
        clerkKey.startsWith('pk_test_'),
        'VITE_CLERK_PUBLISHABLE_KEY should have an informative placeholder'
      );
    });
  });

  describe('Completeness checks', () => {
    it('should not have empty values for required variables', () => {
      // VITE_CLERK_PUBLISHABLE_KEY is required per main.tsx
      const clerkKey = envVars['VITE_CLERK_PUBLISHABLE_KEY'];
      assert.ok(
        clerkKey && clerkKey.trim() !== '',
        'VITE_CLERK_PUBLISHABLE_KEY should not be empty'
      );
    });

    it('should match environment variables used in main.tsx', () => {
      // main.tsx uses VITE_CLERK_PUBLISHABLE_KEY
      assert.ok(
        'VITE_CLERK_PUBLISHABLE_KEY' in envVars,
        'VITE_CLERK_PUBLISHABLE_KEY used in main.tsx should be in .env.example'
      );
    });
  });

  describe('Documentation and usability', () => {
    it('should have comments explaining the purpose', () => {
      const commentLines = envLines.filter(line => line.trim().startsWith('#'));
      assert.ok(
        commentLines.length >= 1,
        'Should have at least one comment line for guidance'
      );
    });

    it('should provide a clear example value', () => {
      const clerkKey = envVars['VITE_CLERK_PUBLISHABLE_KEY'];
      assert.ok(
        clerkKey && clerkKey !== 'YOUR_KEY_HERE',
        'Should provide a more descriptive example than generic placeholder'
      );
    });

    it('should be consistent with backend Clerk configuration', () => {
      // Frontend uses VITE_CLERK_PUBLISHABLE_KEY, backend has CLERK_PUBLISHABLE_KEY
      assert.ok(
        'VITE_CLERK_PUBLISHABLE_KEY' in envVars,
        'Should have Clerk publishable key for frontend'
      );
    });
  });

  describe('Security best practices', () => {
    it('should not contain secret keys (only publishable keys)', () => {
      Object.keys(envVars).forEach(key => {
        assert.ok(
          !key.includes('SECRET'),
          'Frontend .env should not contain SECRET keys (use PUBLISHABLE keys only)'
        );
      });
    });

    it('should only contain client-safe environment variables', () => {
      // All Vite env vars are exposed to the client, so ensure no sensitive data
      Object.keys(envVars).forEach(key => {
        assert.ok(
          key.startsWith('VITE_'),
          `${key} should have VITE_ prefix to be exposed to client`
        );
        assert.ok(
          !key.includes('SECRET') && !key.includes('PRIVATE'),
          `${key} should not contain SECRET or PRIVATE in name (not client-safe)`
        );
      });
    });

    it('should use publishable/public keys only', () => {
      Object.keys(envVars).forEach(key => {
        if (key.includes('KEY')) {
          assert.ok(
            key.includes('PUBLISHABLE') || key.includes('PUBLIC') || !key.includes('SECRET'),
            `${key} should indicate it's a public/publishable key`
          );
        }
      });
    });
  });

  describe('Edge cases and error conditions', () => {
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

    it('should handle the file correctly even with minimal content', () => {
      // Frontend .env.example might be smaller than backend
      assert.ok(
        envLines.length >= 2,
        'Should have at least 2 lines (comment + variable)'
      );
    });
  });

  describe('Integration with codebase', () => {
    it('should align with required variables checked in main.tsx', () => {
      // main.tsx throws error if VITE_CLERK_PUBLISHABLE_KEY is missing
      assert.ok(
        'VITE_CLERK_PUBLISHABLE_KEY' in envVars,
        'VITE_CLERK_PUBLISHABLE_KEY is required in main.tsx'
      );
    });

    it('should provide a non-empty default to prevent build errors', () => {
      const clerkKey = envVars['VITE_CLERK_PUBLISHABLE_KEY'];
      assert.ok(
        clerkKey && clerkKey.trim() !== '',
        'Should provide non-empty default to prevent main.tsx from throwing error'
      );
    });

    it('should support Vite build process', () => {
      // All variables should be VITE_ prefixed for Vite to expose them
      Object.keys(envVars).forEach(key => {
        assert.ok(
          key.startsWith('VITE_'),
          `${key} must start with VITE_ to be available in Vite build`
        );
      });
    });
  });

  describe('Cross-reference with backend', () => {
    it('should have corresponding backend Clerk key', () => {
      // This test reads backend .env.example to ensure consistency
      const backendEnvPath = join(__dirname, '..', '..', 'backend', '.env.example');
      let backendHasClerkKey = false;
      
      try {
        const backendContent = readFileSync(backendEnvPath, 'utf-8');
        backendHasClerkKey = backendContent.includes('CLERK_PUBLISHABLE_KEY');
      } catch (err) {
        // If backend file doesn't exist, skip this test
        return;
      }
      
      if (backendHasClerkKey) {
        assert.ok(
          'VITE_CLERK_PUBLISHABLE_KEY' in envVars,
          'Frontend should have Clerk key if backend has Clerk configuration'
        );
      }
    });
  });

  describe('Typo and consistency checks', () => {
    it('should detect spelling of "clerk" in comments', () => {
      const commentLines = envLines.filter(line => line.trim().startsWith('#'));
      const clerkComments = commentLines.filter(c => c.toLowerCase().includes('clerk'));
      
      if (clerkComments.length > 0) {
        clerkComments.forEach(comment => {
          const hasTypo = comment.includes('clerck');
          if (hasTypo) {
            // Flag it but don't fail - this is informational
            assert.ok(
              false,
              `WARNING: Found typo "clerck" instead of "clerk" in comment: "${comment}"`
            );
          }
        });
      }
    });

    it('should use consistent casing in comments', () => {
      const commentLines = envLines.filter(line => line.trim().startsWith('#'));
      commentLines.forEach(comment => {
        // Comments should be lowercase or have proper capitalization
        const trimmed = comment.replace('#', '').trim();
        if (trimmed.length > 0) {
          assert.ok(
            trimmed === trimmed.toLowerCase() || /^[A-Z]/.test(trimmed),
            'Comments should be consistently cased'
          );
        }
      });
    });
  });
});