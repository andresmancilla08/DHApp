"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BottomSheet } from "@/components/ui/BottomSheet";

interface Props {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  initialTitle?: string;
  initialBody?: string;
  pending?: boolean;
  onSubmit: (title: string | undefined, body: string) => void;
}

/** Shared create/edit form for a journal entry (bottom sheet). */
export function JournalForm({ open, onClose, isEdit, initialTitle, initialBody, pending, onSubmit }: Props) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(initialTitle ?? "");
  const [body, setBody] = useState(initialBody ?? "");

  // Reset fields whenever the sheet (re)opens with fresh data.
  useEffect(() => {
    if (open) {
      setTitle(initialTitle ?? "");
      setBody(initialBody ?? "");
    }
  }, [open, initialTitle, initialBody]);

  return (
    <BottomSheet open={open} onClose={onClose} label={isEdit ? t("journal.editTitle") : t("journal.newTitle")}>
      <div className="flex flex-col gap-3 pb-2">
        <h2 className="text-center font-display text-xl font-semibold text-foreground">
          {isEdit ? t("journal.editTitle") : t("journal.newTitle")}
        </h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted">{t("journal.fieldTitle")}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("journal.fieldTitlePlaceholder")}
            maxLength={80}
            className="h-11 rounded-2xl border border-border bg-surface-2/40 px-3.5 text-sm text-foreground placeholder:text-muted/50 focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted">{t("journal.fieldBody")}</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={t("journal.fieldBodyPlaceholder")}
            rows={7}
            className="resize-none rounded-2xl border border-border bg-surface-2/40 px-3.5 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted/50 focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
          />
        </div>

        <button
          type="button"
          onClick={() => body.trim() && onSubmit(title.trim() || undefined, body.trim())}
          disabled={!body.trim() || pending}
          className="mt-1 flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-b from-gold-bright to-gold font-semibold text-[#2a1d05] shadow-[0_6px_24px_-8px_rgba(217,164,65,0.7)] transition active:scale-[0.99] disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-bright"
        >
          {pending ? t("journal.saving") : t("journal.save")}
        </button>
      </div>
    </BottomSheet>
  );
}
