import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { commandPanelDevApi } from './src/dev/handlers-middleware';

export default defineConfig(({ mode }) => {
  // Load .env into process.env so the dev API middleware (api/chat.ts, api/data.ts)
  // can read OPENROUTER_API_KEY / ANTHROPIC_API_KEY at request time. We read both the
  // repo root and this app (app overrides), so a key placed in either .env works.
  // Vite only exposes VITE_-prefixed vars to the client bundle; these stay server-side.
  const appDir = process.cwd();
  const repoRoot = path.resolve(appDir, '../..');
  Object.assign(process.env, loadEnv(mode, repoRoot, ''), loadEnv(mode, appDir, ''));
  return {
    plugins: [react(), tailwindcss(), commandPanelDevApi()],
  };
});
