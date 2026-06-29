import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { commandPanelDevApi } from './src/dev/handlers-middleware';

export default defineConfig({
  plugins: [react(), commandPanelDevApi()],
});
