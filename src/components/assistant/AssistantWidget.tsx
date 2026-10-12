"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUp, RotateCcw, Sparkles, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { gsap, useGSAP, MOTION, EASE } from "@/lib/gsap";
import { lockScroll } from "@/lib/smooth-scroll";
import { track } from "@/lib/tracking";
import type { AgentErrorCode, AgentEvent } from "@/lib/agent/types";

type ChatMessage = { role: "user" | "assistant"; text: string };

// La conversation survit à un rechargement de page, pas à la fermeture de l'onglet.
const STORAGE_KEY = "kelenix_assistant";
const SUGGESTIONS = ["project", "services", "process"] as const;
const URL_PATTERN = /(https?:\/\/[^\s<>"]+[^\s<>".,;:!?)])/g;

// L'assistant écrit en texte simple ; seules les adresses web deviennent des liens.
function RichText({ text }: { text: string }) {
  return text.split(URL_PATTERN).map((part, i) =>
    i % 2 === 1 ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-2">
        {part.replace(/^https?:\/\//, "")}
      </a>
    ) : (
      part
    )
  );
}

function TypingDots({ label }: { label: string }) {
  const dots = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        gsap.to(dots.current!.children, { y: -3, opacity: 1, duration: 0.4, ease: "sine.inOut", stagger: { each: 0.14, repeat: -1, yoyo: true } });
      });
    },
    { scope: dots }
  );
  return (
    <span ref={dots} role="status" aria-label={label} className="inline-flex gap-1 py-2">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-1.5 w-1.5 rounded-full bg-muted opacity-50" />
      ))}
    </span>
  );
}

// Fenêtre de discussion avec l'assistant IA : il répond aux questions, qualifie le besoin du visiteur
// et transmet sa demande à l'équipe (elle arrive dans Admin → Messages → Devis).
// Bouton en bas à gauche sur ordinateur, en bas à droite au-dessus de la barre de devis sur mobile.
export default function AssistantWidget() {
  const t = useTranslations("assistant");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<AgentErrorCode | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "null");
      if (saved && Array.isArray(saved.messages)) {
        setMessages(saved.messages);
        setConversationId(saved.conversationId ?? null);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (busy) return;
    try {
      if (messages.length) sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ conversationId, messages }));
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, [busy, conversationId, messages]);

  useGSAP(
    () => {
      if (!open) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        gsap.from(panel.current, { y: 24, opacity: 0, duration: 0.35, ease: EASE, clearProps: "transform,opacity" });
      });
    },
    { dependencies: [open] }
  );

  useEffect(() => {
    if (!open) return;
    // Sur mobile la fenêtre occupe tout l'écran : la page derrière ne défile plus.
    const fullscreen = window.matchMedia("(max-width: 1023px)").matches;
    if (fullscreen) lockScroll(true);
    else field.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (fullscreen) lockScroll(false);
    };
  }, [open]);

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight });
  }, [messages, error, open]);

  const restart = () => {
    setMessages([]);
    setConversationId(null);
    setError(null);
  };

  const send = async (text: string) => {
    const message = text.trim();
    if (!message || busy) return;
    setInput("");
    setError(null);
    setBusy(true);
    // La bulle vide de l'assistant affiche les points d'attente, puis se remplit au fil de la réponse.
    setMessages((current) => [...current, { role: "user", text: message }, { role: "assistant", text: "" }]);
    const append = (delta: string) =>
      setMessages((current) => {
        const last = current[current.length - 1];
        return [...current.slice(0, -1), { ...last, text: last.text + delta }];
      });

    let failure: AgentErrorCode | null = null;
    try {
      const response = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, message, locale, page: pathname }),
      });
      if (!response.ok || !response.body) {
        failure = response.status === 429 ? "busy" : "unavailable";
      } else {
        // Une ligne JSON par événement ; une ligne peut arriver en plusieurs morceaux.
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line) continue;
            const event = JSON.parse(line) as AgentEvent;
            if (event.type === "text") append(event.text);
            else if (event.type === "lead") track({ name: "lead", source: "assistant" });
            else if (event.type === "done") setConversationId(event.conversationId);
            else failure = event.code;
          }
        }
      }
    } catch {
      failure = "unavailable";
    }

    if (failure) {
      // Rien reçu : on retire la bulle vide. Le message du visiteur reste affiché.
      setMessages((current) => (current[current.length - 1]?.text ? current : current.slice(0, -1)));
      if (failure === "expired") setConversationId(null);
      setError(failure);
    }
    setBusy(false);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("open")}
        className="fixed bottom-[calc(1rem+var(--quote-bar,0px))] right-4 z-40 flex h-13 cursor-pointer items-center gap-2 rounded-full bg-navy px-4 text-[15px] font-semibold text-white shadow-[0_14px_34px_-14px_rgba(11,31,58,0.7)] transition-colors hover:bg-azure lg:bottom-6 lg:left-6 lg:right-auto lg:px-5"
      >
        <Sparkles size={18} className="text-gold" />
        <span className="hidden sm:inline">{t("launcher")}</span>
      </button>
    );
  }

  return (
    <div
      ref={panel}
      role="dialog"
      aria-label={t("title")}
      className="fixed inset-0 z-[60] flex flex-col bg-white lg:inset-auto lg:bottom-6 lg:left-6 lg:h-[min(620px,calc(100dvh-3rem))] lg:w-[390px] lg:overflow-hidden lg:rounded-3xl lg:border lg:border-line lg:shadow-[0_24px_60px_-24px_rgba(11,31,58,0.45)]"
    >
      <header className="flex items-center gap-3 border-b border-line px-4 py-3.5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy text-gold">
          <Sparkles size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold leading-tight text-navy">{t("title")}</p>
          <p className="truncate text-[13px] text-muted">{t("subtitle")}</p>
        </div>
        {messages.length > 0 && (
          <button type="button" onClick={restart} disabled={busy} aria-label={t("restart")} title={t("restart")} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-mist hover:text-navy disabled:opacity-40">
            <RotateCcw size={16} />
          </button>
        )}
        <button type="button" onClick={() => setOpen(false)} aria-label={t("close")} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-mist hover:text-navy">
          <X size={18} />
        </button>
      </header>

      {/* data-lenis-prevent : la molette fait défiler la conversation, pas la page derrière */}
      <div ref={list} data-lenis-prevent aria-live="polite" className="flex flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-4 py-4">
        <p className="max-w-[88%] self-start whitespace-pre-wrap rounded-2xl rounded-tl-md bg-mist px-3.5 py-2.5 text-[15px] leading-relaxed text-navy">{t("greeting")}</p>

        {messages.map((message, i) => (
          <p
            key={i}
            className={cn(
              "max-w-[88%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-[15px] leading-relaxed",
              message.role === "user" ? "self-end rounded-tr-md bg-azure text-white" : "self-start rounded-tl-md bg-mist text-navy"
            )}
          >
            {message.text ? <RichText text={message.text.trimEnd()} /> : <TypingDots label={t("typing")} />}
          </p>
        ))}

        {messages.length === 0 && (
          <div className="mt-1 flex flex-col items-start gap-2">
            {SUGGESTIONS.map((key) => (
              <button key={key} type="button" onClick={() => send(t(`suggestions.${key}`))} className="cursor-pointer rounded-full border border-line bg-white px-3.5 py-2 text-left text-sm font-medium text-navy transition-colors hover:border-azure hover:text-azure">
                {t(`suggestions.${key}`)}
              </button>
            ))}
          </div>
        )}

        {error && (
          <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] leading-snug text-red-700">
            {t(`errors.${error}`)}
          </p>
        )}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          send(input);
        }}
        className="border-t border-line px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3"
      >
        <div className="flex items-end gap-2">
          <textarea
            ref={field}
            rows={1}
            value={input}
            maxLength={2000}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault();
                send(input);
              }
            }}
            placeholder={t("placeholder")}
            aria-label={t("placeholder")}
            className="max-h-28 min-h-11 flex-1 resize-none rounded-2xl border border-line bg-white px-3.5 py-2.5 text-base text-navy placeholder:text-muted/70 focus:border-azure focus:outline-none focus:ring-4 focus:ring-azure/10 lg:text-[15px]"
          />
          <button type="submit" disabled={busy || !input.trim()} aria-label={t("send")} className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-azure text-white transition-colors hover:bg-azure-dark disabled:cursor-not-allowed disabled:opacity-40">
            <ArrowUp size={18} />
          </button>
        </div>
        <p className="mt-2 px-1 text-[11px] leading-snug text-muted">
          {t("notice")}{" "}
          <Link href="/politique-de-confidentialite" className="underline underline-offset-2 hover:text-navy">
            {t("privacy")}
          </Link>
        </p>
      </form>
    </div>
  );
}
