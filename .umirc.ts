import { defineConfig } from 'umi'
const path = require('path')
const resolve = (p: string) => path.resolve(__dirname, p)

export default defineConfig({
  svgr: {},
  svgo: {},
  icons: {
    include: ['local:import', 'local:audit', 'local:search', 'local:logo']
  },
  routes: [
    { path: '/', component: 'index' },
    { path: '/login', component: 'login' },
    { path: '/import', component: 'import' },
    { path: '/search', component: 'search' },
    { path: '/audit', component: 'audit' }
  ],
  npmClient: 'pnpm',
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:3000',
      changeOrigin: true
      // 'pathRewrite': { '^/api' : '' },
    }
  }
})
