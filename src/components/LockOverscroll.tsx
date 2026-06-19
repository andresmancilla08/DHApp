"use client";

import { useEffect } from "react";

/**
 * Disables browser pull-to-refresh / overscroll bounce while mounted.
 * Used on auth screens (outside the session); restored on unmount so the
 * home keeps native pull-to-refresh.
 */
export function LockOverscroll() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overscrollBehaviorY;
    const prevBody = body.style.overscrollBehaviorY;
    html.style.overscrollBehaviorY = "none";
    body.style.overscrollBehaviorY = "none";
    return () => {
      html.style.overscrollBehaviorY = prevHtml;
      body.style.overscrollBehaviorY = prevBody;
    };
  }, []);

  return null;
}
