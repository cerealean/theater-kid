import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://localhost:4321' },
  webServer: {
    command: 'npx http-server dist/theater-kid/browser -p 4321 -c-1',
    port: 4321,
    timeout: 120_000,
    reuseExistingServer: true,
  },
});
