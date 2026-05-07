import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Single physical entry for `@blazeo.com/calendar-client` (hoisted or nested under `file:..` parent). */
function calendarClientEntry() {
  const candidates = [
    path.resolve(__dirname, "node_modules/@blazeo.com/calendar-client/dist/index.mjs"),
    path.resolve(__dirname, "../node_modules/@blazeo.com/calendar-client/dist/index.mjs"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return candidates[0];
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, "."), "");
  const proxyTarget = (env.VITE_DEV_PROXY_TARGET ?? "").trim().replace(/\/+$/, "");

  /** Avoid browser CORS during local dev: requests go to same origin, Vite forwards to API. */
  const devProxy =
    proxyTarget.length > 0
      ? {
          "/blazeo-api": {
            target: proxyTarget,
            changeOrigin: true,
            secure: true,
            rewrite: (reqPath) => reqPath.replace(/^\/blazeo-api/, "") || "/",
          },
        }
      : undefined;

  return {
    plugins: [react()],
    /** Ensure one instance so `configure()` and models share the same store. */
    resolve: {
      // `file:..` appointment-client is symlinked; `true` can resolve the same dep twice → two `getConfig()` stores.
      preserveSymlinks: false,
      dedupe: ["@blazeo.com/calendar-client", "mobx", "mobx-state-tree"],
      alias: {
        "@blazeo.com/calendar-client": calendarClientEntry(),
      },
    },
    optimizeDeps: {
      exclude: ["appointment-client", "@blazeo.com/calendar-client", "mobx", "mobx-state-tree"],
    },
    server: {
      port: 5173,
      open: true,
      ...(devProxy ? { proxy: devProxy } : {}),
    },
  };
});
