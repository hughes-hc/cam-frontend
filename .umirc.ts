import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/import", component: "import" },
    { path: "/search", component: "search" },
    { path: "/audit", component: "audit" },
  ],
  npmClient: 'pnpm'
});
