"use client";

import { BottomSheet } from "./BottomSheet";

type Variant = "gold" | "danger";

interface Props {
  open: boolean;
  onClose: () => void;
  /** Optional emblem/icon shown centered at the top. */
  icon?: React.ReactNode;
  title: string;
  description?: string;
  /** Custom centered body (e.g. controls). Rendered between description and actions. */
  children?: React.ReactNode;
  primaryLabel?: string;
  onPrimary?: () => void;
  primaryVariant?: Variant;
  primaryDisabled?: boolean;
  secondaryLabel?: string;
}

const primaryStyles: Record<Variant, string> = {
  gold: "bg-gradient-to-b from-gold-bright to-gold text-[#2a1d05] shadow-[0_6px_24px_-8px_rgba(217,164,65,0.7)]",
  danger: "border border-danger/30 bg-danger/10 text-danger",
};

/**
 * Transversal dialog for the whole app. Bottom-sheet style, fully centered.
 * Use for confirmations, info, and simple action menus.
 */
export function AppDialog({
  open,
  onClose,
  icon,
  title,
  description,
  children,
  primaryLabel,
  onPrimary,
  primaryVariant = "gold",
  primaryDisabled,
  secondaryLabel,
}: Props) {
  return (
    <BottomSheet open={open} onClose={onClose} label={title}>
      <div className="flex flex-col items-center gap-3 pb-2 text-center">
        {icon && (
          <span className="dh-mark-glow flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/[0.12] text-gold">
            {icon}
          </span>
        )}
        <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="max-w-[34ch] text-sm leading-relaxed text-muted">{description}</p>
        )}

        {children && <div className="w-full pt-1">{children}</div>}

        {(primaryLabel || secondaryLabel) && (
          <div className="mt-3 flex w-full flex-col gap-2">
            {primaryLabel && (
              <button
                type="button"
                onClick={onPrimary}
                disabled={primaryDisabled}
                className={`flex h-12 w-full items-center justify-center gap-2 rounded-full font-semibold transition active:scale-[0.99] disabled:opacity-45 ${primaryStyles[primaryVariant]}`}
              >
                {primaryLabel}
              </button>
            )}
            {secondaryLabel && (
              <button
                type="button"
                onClick={onClose}
                className="flex h-12 w-full items-center justify-center rounded-full text-sm font-medium text-muted transition hover:text-foreground"
              >
                {secondaryLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
