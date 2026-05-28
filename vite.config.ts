import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { sentryVitePlugin } from '@sentry/vite-plugin'


export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), '')
  const isProduction = mode === 'production'

  return {
    plugins: [
      react(),

      isProduction && env.VITE_SENTRY_DSN
        ? sentryVitePlugin({
            org: env.SENTRY_ORG,
            project: env.SENTRY_PROJECT,
            authToken: env.SENTRY_AUTH_TOKEN,
            sourcemaps: {
              assets: './dist/**',
              filesToDeleteAfterUpload: ['./dist/**/*.map'], // Delete source maps after upload for security
            },
            telemetry: false,
          })
        : undefined,
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@/components': path.resolve(__dirname, './src/components'),
        '@/features': path.resolve(__dirname, './src/features'),
        '@/hooks': path.resolve(__dirname, './src/hooks'),
        '@/store': path.resolve(__dirname, './src/store'),
        '@/services': path.resolve(__dirname, './src/services'),
        '@/utils': path.resolve(__dirname, './src/utils'),
        '@/types': path.resolve(__dirname, './src/types'),
        '@/theme': path.resolve(__dirname, './src/theme'),
        '@/constants': path.resolve(__dirname, './src/constants'),
      },
    },
    server: {
      port: 5173,
      host: true, // Listen on all addresses
      proxy: {
        '/api': {
          target: env.VITE_API_GATEWAY_URL || 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
    preview: {
      port: 4173,
      host: true,
    },
    build: {

      sourcemap: isProduction ? 'hidden' : true,

      target: 'es2020',

      minify: 'terser',

      rollupOptions: {
        output: {

          manualChunks(id) {

            if (id.includes('node_modules')) {

              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                return 'react-vendor'
              }

              if (id.includes('@reduxjs') || id.includes('react-redux')) {
                return 'redux-vendor'
              }

              if (id.includes('@mui') || id.includes('@emotion')) {
                return 'ui-vendor'
              }

              if (id.includes('react-hook-form') || id.includes('zod')) {
                return 'form-vendor'
              }

              if (id.includes('framer-motion')) {
                return 'animation-vendor'
              }

              if (id.includes('recharts')) {
                return 'charts-vendor'
              }

              if (id.includes('@sentry')) {
                return 'monitoring-vendor'
              }

              if (id.includes('socket.io-client')) {
                return 'websocket-vendor'
              }

              return 'vendor'
            }
          },

          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.') || []
            const ext = info[info.length - 1]
            

            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || '')) {
              return `assets/images/[name]-[hash][extname]`
            }
            if (/woff2?|ttf|otf|eot/i.test(ext || '')) {
              return `assets/fonts/[name]-[hash][extname]`
            }
            return `assets/[name]-[hash][extname]`
          },

          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
        },
      },

      chunkSizeWarningLimit: 1000,

      cssCodeSplit: true,

      reportCompressedSize: true,

      outDir: 'dist',

      assetsDir: 'assets',

      emptyOutDir: true,
    },

    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@reduxjs/toolkit',
        'react-redux',
        'react-hook-form',
        'zod',
        '@hookform/resolvers/zod',
      ],
      exclude: ['@sentry/react'], // Exclude from pre-bundling
    },

    define: {
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || '1.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
  }
})
