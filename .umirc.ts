import { defineConfig } from "umi";

export default defineConfig({
  svgr: {},
  svgo: {},
  icons: {
    include: ['local:import', 'local:audit', 'local:search']
  },
  routes: [
    { path: "/", component: "index" },
    { path: "/login", component: "login" },
    { path: "/import", component: "import" },
    { path: "/search", component: "search" },
    { path: "/audit", component: "audit" },
  ],
  npmClient: 'pnpm',
  proxy: {
    '/api': {
      'target': 'http://127.0.0.1:3000',
      'changeOrigin': true,
      // 'pathRewrite': { '^/api' : '' },
    },
  },
});
