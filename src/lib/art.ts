// Cache-busting for static art. The service worker (Serwist) and Next's image
// optimizer key their cache on the URL, so when an art file is replaced under
// the same path the old version keeps being served. Bump ART_VERSION whenever
// any image under /public/art is re-exported to force a fresh fetch.
export const ART_VERSION = "4";

export function artUrl(path: string): string {
  return `${path}?v=${ART_VERSION}`;
}
