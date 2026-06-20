"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onClose: () => void;
  label?: string;
  children: React.ReactNode;
}

/** Mobile-native bottom sheet: scrim + slide-up panel, safe-area aware. */
export function BottomSheet({ open, onClose, label, children }: Props) {
  const { t } = useTranslation();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        aria-label={t("common.close")}
        onClick={onClose}
        className="dh-scrim absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className="dh-sheet pb-safe relative mx-auto w-full max-w-md rounded-t-3xl border-t border-border-strong bg-surface px-5 pt-3 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.9)]"
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-foreground/15" />
        {children}
      </div>
    </div>,
    document.body,
  );
}
