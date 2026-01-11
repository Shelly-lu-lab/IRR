import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages 部署时使用仓库名作为 base
  // 如果部署到 https://用户名.github.io/irr-calculator/，就设置 base: '/irr-calculator/'
  // 如果部署到自定义域名或根路径，设置 base: '/'
  base: '/irr-calculator/',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'antd-vendor': ['antd'],
          'chart-vendor': ['echarts', 'echarts-for-react'],
        }
      }
    }
  }
});

