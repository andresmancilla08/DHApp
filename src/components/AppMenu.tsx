"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { logout } from "@/lib/auth/actions";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { BottomSheet } from "@/components/ui/BottomSheet";

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M15 12H4m0 0 3.5-3.5M4 12l3.5 3.5M14 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AppMenu({ username }: { username: string }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const initial = username.charAt(0).toUpperCase();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={t("nav.menu")}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-gold/[0.12] font-display text-lg font-semibold text-gold transition active:scale-95"
      >
        {initial}
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)} label={t("nav.menu")}>
        <div className="flex flex-col items-center gap-5 pb-2 text-center">
          {/* Identity */}
          <div className="flex flex-col items-center gap-2">
            <span className="dh-mark-glow flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/[0.12] font-display text-2xl font-semibold text-gold">
              {initial}
            </span>
            <div>
              <p className="text-xs text-muted">{t("nav.signedInAs")}</p>
              <p className="max-w-[24ch] truncate font-display text-lg font-semibold text-foreground">
                {username}
              </p>
            </div>
          </div>

          {/* Language */}
          <div className="flex w-full flex-col items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted">
              {t("locale.label")}
            </span>
            <LocaleSwitcher fullWidth />
          </div>

          {/* Sign out */}
          <form action={logout} className="w-full">
            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-danger/30 bg-danger/10 font-medium text-danger transition active:scale-[0.99]"
            >
              <LogoutIcon className="h-5 w-5" />
              {t("nav.signOut")}
            </button>
          </form>
        </div>
      </BottomSheet>
    </>
  );
}
