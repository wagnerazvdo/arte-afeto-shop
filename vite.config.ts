// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  // Force-on nitro outside Lovable so self-deploys (Vercel/Netlify) get a real
  // SSR build instead of a static `dist/` (which causes 404 on every route
  // other than `/`). Inside Lovable this override is ignored and Cloudflare
  // is used. On Vercel, Nitro auto-detects the `VERCEL` env var and uses the
  // `vercel` preset; we pin it explicitly here for clarity.
  nitro: { preset: "vercel" },
});
