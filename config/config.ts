import { defineConfig } from 'umi'
import routes from './routes'
import path from 'path'

const resolve = (p: string) => path.resolve(__dirname, p)

export default defineConfig({
  alias: {
    config: resolve('../config')
  },
  svgr: {},
  svgo: {},
  icons: {
    include: [
      'local:common/logo',
      'local:menu/company',
      'local:menu/archive',
      'local:menu/account',
      'local:menu/audit'
    ]
  },
  routes: routes,
  npmClient: 'pnpm',
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:3000',
      changeOrigin: true
      // 'pathRewrite': { '^/api' : '' },
    }
  }
})
