import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const nextConfig: NextConfig = {
  images: {
    // Allow the ?v= cache-busting query (see src/lib/art.ts) on local art.
    // search:undefined ⇒ any query allowed; second entry keeps the default
    // (no query) for everything else.
    localPatterns: [
      { pathname: "/art/**" },
      { pathname: "/**", search: "" },
    ],
  },
};

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  // ponytail: disabled in dev to avoid caching noise while developing.
  disable: process.env.NODE_ENV === "development",
});

export default withSerwist(nextConfig);
