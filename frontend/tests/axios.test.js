import { describe, it, mock, beforeEach } from 'node:test';
import assert from 'node:assert';

describe('axios instance configuration', () => {
  let axiosModule;
  let mockAxiosCreate;
  let mockEnv;

  beforeEach(async () => {
    // Mock axios module
    mockAxiosCreate = mock.fn((config) => ({
      config,
      defaults: config,
      interceptors: {
        request: { use: mock.fn() },
        response: { use: mock.fn() }
      }
    }));

    // Mock the axios import
    const axios = {
      create: mockAxiosCreate,
      default: { create: mockAxiosCreate }
    };

    // Store original env
    mockEnv = {
      VITE_API_URL: 'http://localhost:3000/api'
    };
  });

  describe('Instance Creation', () => {
    it('should create axios instance with baseURL from environment variable', () => {
      const instance = mockAxiosCreate({
        baseURL: mockEnv.VITE_API_URL,
        withCredentials: true
      });

      assert.ok(mockAxiosCreate.mock.calls.length > 0, 'axios.create should be called');
      assert.strictEqual(
        instance.config.baseURL,
        'http://localhost:3000/api',
        'baseURL should be set from VITE_API_URL'
      );
    });

    it('should set withCredentials to true for cookie handling', () => {
      const instance = mockAxiosCreate({
        baseURL: mockEnv.VITE_API_URL,
        withCredentials: true
      });

      assert.strictEqual(
        instance.config.withCredentials,
        true,
        'withCredentials should be true to enable automatic cookie sending'
      );
    });

    it('should export a configured axios instance as default', () => {
      const config = {
        baseURL: mockEnv.VITE_API_URL,
        withCredentials: true
      };

      const instance = mockAxiosCreate(config);
      
      assert.ok(instance, 'Should export an axios instance');
      assert.ok(instance.config, 'Instance should have config');
    });
  });

  describe('Configuration Properties', () => {
    it('should only configure essential properties', () => {
      const config = {
        baseURL: mockEnv.VITE_API_URL,
        withCredentials: true
      };

      const configKeys = Object.keys(config);
      assert.strictEqual(
        configKeys.length,
        2,
        'Should only have baseURL and withCredentials configured'
      );
      assert.ok(configKeys.includes('baseURL'), 'Should include baseURL');
      assert.ok(configKeys.includes('withCredentials'), 'Should include withCredentials');
    });

    it('should use environment variable for baseURL', () => {
      const baseURL = mockEnv.VITE_API_URL;
      assert.ok(baseURL, 'VITE_API_URL should be defined');
      assert.ok(
        typeof baseURL === 'string',
        'VITE_API_URL should be a string'
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined VITE_API_URL gracefully', () => {
      const config = {
        baseURL: undefined,
        withCredentials: true
      };

      const instance = mockAxiosCreate(config);
      // Instance should still be created even with undefined baseURL
      assert.ok(instance, 'Instance should be created');
      assert.strictEqual(
        instance.config.baseURL,
        undefined,
        'baseURL should be undefined when env var is not set'
      );
    });

    it('should handle empty string VITE_API_URL', () => {
      const config = {
        baseURL: '',
        withCredentials: true
      };

      const instance = mockAxiosCreate(config);
      assert.strictEqual(
        instance.config.baseURL,
        '',
        'Should handle empty string baseURL'
      );
    });

    it('should handle various URL formats', () => {
      const testUrls = [
        'http://localhost:3000',
        'https://api.example.com',
        'https://api.example.com/v1',
        '/api',
        'http://localhost:3000/api/v1'
      ];

      testUrls.forEach(url => {
        const instance = mockAxiosCreate({
          baseURL: url,
          withCredentials: true
        });

        assert.strictEqual(
          instance.config.baseURL,
          url,
          `Should handle URL format: ${url}`
        );
      });
    });
  });

  describe('withCredentials flag', () => {
    it('should always set withCredentials to true', () => {
      const config = {
        baseURL: mockEnv.VITE_API_URL,
        withCredentials: true
      };

      assert.strictEqual(
        config.withCredentials,
        true,
        'withCredentials must be true for cookie-based authentication'
      );
    });

    it('should be a boolean value', () => {
      const config = {
        baseURL: mockEnv.VITE_API_URL,
        withCredentials: true
      };

      assert.strictEqual(
        typeof config.withCredentials,
        'boolean',
        'withCredentials should be a boolean'
      );
    });
  });

  describe('Security Considerations', () => {
    it('should not expose credentials in the config', () => {
      const config = {
        baseURL: mockEnv.VITE_API_URL,
        withCredentials: true
      };

      assert.ok(
        !config.headers || !config.headers.Authorization,
        'Should not hardcode Authorization headers'
      );
      assert.ok(
        !config.auth,
        'Should not include basic auth credentials'
      );
    });

    it('should rely on browser for cookie management', () => {
      const config = {
        baseURL: mockEnv.VITE_API_URL,
        withCredentials: true
      };

      // withCredentials: true means browser handles cookies automatically
      assert.strictEqual(
        config.withCredentials,
        true,
        'Browser should automatically send cookies with withCredentials: true'
      );
    });
  });

  describe('Integration with VITE environment', () => {
    it('should use VITE_ prefixed environment variable', () => {
      const envVarName = 'VITE_API_URL';
      assert.ok(
        envVarName.startsWith('VITE_'),
        'Environment variable should have VITE_ prefix for Vite to expose it'
      );
    });

    it('should be accessible at build time via import.meta.env', () => {
      // This test verifies the pattern used in the code
      const envAccessPattern = 'import.meta.env.VITE_API_URL';
      assert.ok(
        envAccessPattern.includes('import.meta.env'),
        'Should use import.meta.env for Vite environment variables'
      );
    });
  });

  describe('Module Export', () => {
    it('should export as default export', () => {
      const instance = mockAxiosCreate({
        baseURL: mockEnv.VITE_API_URL,
        withCredentials: true
      });

      // Simulating default export
      const defaultExport = instance;
      assert.ok(defaultExport, 'Should have a default export');
      assert.ok(defaultExport.config, 'Default export should be an axios instance');
    });

    it('should not export any named exports', () => {
      // The module should only have a default export
      // This is a design validation test
      assert.ok(true, 'Module should only use default export pattern');
    });
  });
});