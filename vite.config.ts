import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const isProd = mode === 'production'
  
  return {
    plugins: [vue()],
    base: env.VITE_BASE_URL,
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    define: {
      // 定义全局常量
      __APP_ENV__: JSON.stringify(env.VITE_PUBLIC_PATH),
      'process.env.NODE_ENV': JSON.stringify(mode)
    },
    preview: {
      host: true,
      port: 5173,
      strictPort: true,
      allowedHosts: true
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE,
          changeOrigin: true
        }
      }
    }
  }
})