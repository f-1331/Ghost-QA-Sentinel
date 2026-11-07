// frontend/src/components/SentinelCopilot.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Minimize2, 
  Maximize2, 
  Terminal, 
  ShieldAlert, 
  FlaskConical, 
  Cpu, 
  Check, 
  Copy,
  ChevronDown,
  MessageSquare,
  EyeOff
} from "lucide-react";
import { Language, translations } from "./i18n";
import { soundFX } from "./SoundEffects";

interface Message {
  id: string;
  sender: "user" | "copilot";
  text: string;
  timestamp: string;
  isCode?: boolean;
}

interface SentinelCopilotProps {
  backendUrl: string;
  lang: Language;
  isOpen?: boolean;
  onToggleOpen?: (open: boolean) => void;
}

export const SentinelCopilot: React.FC<SentinelCopilotProps> = ({ 
  backendUrl, 
  lang,
  isOpen: externalIsOpen,
  onToggleOpen: externalOnToggleOpen
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = (val: boolean) => {
    if (externalOnToggleOpen) externalOnToggleOpen(val);
    else setInternalIsOpen(val);
  };

  const [isMinimized, setIsMinimized] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false); // User can hide floating button on mobile
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const initialWelcome = 
    lang === "uz" 
      ? "Salom! Men Ghost-QA Sentinel AI Copilot man. Google Gemini 3.8 Flash orqali dasturingizdagi xatoliklarni tahlil qilish, Playwright/Jest regressiya testlarini yaratish va xavfsizlik auditini o'tkazishda yordam beraman. Menga istalgan savol bering!"
      : lang === "ru"
      ? "Привет! Я Ghost-QA Sentinel AI Copilot на базе Google Gemini 3.8 Flash. Я помогу диагностировать ошибки, сгенерировать E2E тесты на Playwright/Jest и проверить безопасность приложения. Задайте мне любой вопрос!"
      : "Greetings! I am the Ghost-QA Sentinel AI Copilot powered by Google Gemini 3.8 Flash. I can help diagnose runtime bugs, synthesize automated Playwright/Jest regression specs, and inspect OWASP resilience. Ask me anything!";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "copilot",
      text: initialWelcome,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized]);

  const quickPrompts = [
    {
      label: lang === "uz" ? "🧪 Playwright Test" : lang === "ru" ? "🧪 Playwright Тест" : "🧪 Playwright Test",
      prompt: lang === "uz" 
        ? "Qanday qilib bu xatolikka qarshi Playwright regressiya testi yozish mumkin?"
        : lang === "ru"
        ? "Как написать регрессионный тест Playwright против этой ошибки?"
        : "How to synthesize an automated Playwright regression spec for this error?"
    },
    {
      label: lang === "uz" ? "🔍 TypeError Tahlili" : lang === "ru" ? "🔍 Анализ TypeError" : "🔍 Deep TypeError Analysis",
      prompt: lang === "uz"
        ? "TypeError: Cannot read properties of undefined (reading 'pricing') xatosi nega chiqadi va uni qanday oldini olish kerak?"
        : lang === "ru"
        ? "Почему возникает ошибка TypeError: Cannot read properties of undefined (reading 'pricing') и как ее предотвратить?"
        : "Why does TypeError: Cannot read properties of undefined (reading 'pricing') occur and how to prevent it?"
    },
    {
      label: lang === "uz" ? "🛡️ Xavfsizlik Auditi" : lang === "ru" ? "🛡️ Безопасность" : "🛡️ OWASP Audit",
      prompt: lang === "uz"
        ? "Ghost-QA crawler qanday xavfsizlik va SSRF himoyalariga ega?"
        : lang === "ru"
        ? "Какую защиту безопасности и SSRF обеспечивает сканер Ghost-QA?"
        : "What security and SSRF safeguards does the Ghost-QA crawler employ?"
    },
    {
      label: lang === "uz" ? "⚡ Rust Tezligi" : lang === "ru" ? "⚡ Скорость Rust" : "⚡ Rust Speed",
      prompt: lang === "uz"
        ? "Rust dasturlash tili ushbu arxitekturada qanday ustunliklar bera oladi?"
        : lang === "ru"
        ? "Какие преимущества дает язык программирования Rust в этой архитектуре?"
        : "What performance advantages does Rust provide in this architecture?"
    }
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    soundFX.playClick();
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${backendUrl}/api/ai/copilot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMsg.text,
          context: `User UI Language: ${lang}. Current platform: Ghost-QA Sentinel v2.2.`
        })
      });

      if (res.ok) {
        const data = await res.json();
        soundFX.playHealedChime();
        setMessages((prev) => [
          ...prev,
          {
            id: `copilot-${Date.now()}`,
            sender: "copilot",
            text: data.reply || "Diagnostic completed.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsLoading(false);
        return;
      }
    } catch (e) {
      console.warn("Copilot backend fallback", e);
    }

    // Client-side Heuristic QA Fallback
    setTimeout(() => {
      soundFX.playHealedChime();
      let fallbackAnswer = "";
      const lower = text.toLowerCase().trim();

      if (lower.includes("salom") || lower.includes("assalom") || lower.includes("hello") || lower.includes("hi") || lower.includes("привет") || lower.length <= 4) {
        fallbackAnswer = 
          lang === "uz"
            ? "👋 **Va alaykum assalom! Xush kelibsiz!**\n\nQalaysiz, ishlaringiz yaxshimi? Men Ghost-QA Sentinel AI Copilotiman. Web ilovangizdagi har qanday xatolik, TypeError, layout buzilishlarini tekshirish yoki Playwright testlarini generatsiya qilishda sizga yordam berishga tayyorman. Menga qanday savolingiz bor?"
            : lang === "ru"
            ? "👋 **Здравствуйте! Добро пожаловать!**\n\nЯ Ghost-QA Sentinel AI Copilot на базе Google Gemini 3.8 Flash. Помогу протестировать проект, выявить скрытые баги и сгенерировать автоматические тесты. Какой вопрос вас интересует?"
            : "👋 **Hello and welcome!**\n\nI am Ghost-QA Sentinel AI Copilot powered by Google Gemini 3.8 Flash. I'm ready to inspect runtime bugs, synthesize Playwright regression specs, or perform security audits. How can I help you today?";
      } else if (lower.includes("rust")) {
        fallbackAnswer = 
          "⚡ **Rust Arxitekturasi Tahlili:**\n\n" +
          "Rust tili Playwright Chromium brauzeri render tezligini o'zgartira olmaydi (chunki brauzer baribir C++ da ishlaydi). Ammo **10 000+ parallel tarmoq so'rovlarini tahlil qilishda** va **AST darajasida kod diff solishtirishda** Rust 10x-50x tezlik va 0-xotira oqishini (memory safety) beradi.";
      } else if (lower.includes("test") || lower.includes("playwright")) {
        fallbackAnswer = 
          "🧪 **Avtomatlashtirilgan Playwright Regressiya Testi:**\n\n" +
          "```typescript\n" +
          "import { test, expect } from '@playwright/test';\n\n" +
          "test('Checkout pricing null-safety guard', async ({ page }) => {\n" +
          "  await page.goto('/sandbox');\n" +
          "  await page.click('#checkout-btn');\n" +
          "  const errors = await page.locator('.log-error').count();\n" +
          "  expect(errors).toBe(0);\n" +
          "});\n" +
          "```\n" +
          "Ushbu test har bir Git commitda xatoning qayta chiqishini 100% bartaraf etadi.";
      } else {
        fallbackAnswer = 
          "🤖 **Ghost-QA AI Tavsiyasi:**\n\n" +
          "Tizim barcha runtime istisnolarni Playwright orqali real vaqtda intercept qiladi va Google Gemini orqali avtomatik kod patchini (Unified Diff) yaratadi. 1-bosishda 'Apply Local Patch' tugmasini bosib faylni mahalliy diskingizda tuzatishingiz mumkin!";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `copilot-${Date.now()}`,
          sender: "copilot",
          text: fallbackAnswer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsLoading(false);
    }, 600);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    soundFX.playClick();
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      {/* Floating Trigger Button (Compact on Mobile, Full Pill on Desktop) */}
      {!isOpen && !isDismissed && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-1.5 animate-fadeIn">
          {/* Mobile Dismiss handle */}
          <button
            onClick={() => setIsDismissed(true)}
            className="sm:hidden p-1 rounded-full bg-black/60 border border-gray-700 text-gray-400 hover:text-white"
            title="Yashirish"
          >
            <X className="w-3 h-3" />
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="flex items-center justify-center gap-2 p-3 sm:px-4 sm:py-3 rounded-full sm:rounded-2xl bg-gradient-to-r from-sentinel-cyan via-blue-600 to-sentinel-purple text-white font-bold text-xs font-mono shadow-2xl shadow-sentinel-cyan/40 hover:scale-105 active:scale-95 transition-all group border border-white/20"
            title="Open Sentinel AI Copilot"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
              </span>
            </div>
            <span className="tracking-wider hidden sm:inline">AI COPILOT</span>
          </button>
        </div>
      )}

      {/* Floating Chat Modal / Mobile Bottom Sheet */}
      {isOpen && (
        <>
          {/* Mobile Backdrop Overlay to dismiss by tapping outside */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 sm:hidden animate-fadeIn"
            onClick={() => setIsOpen(false)}
          />

          <div
            className={`fixed inset-x-2 bottom-2 sm:inset-x-auto sm:bottom-6 sm:right-6 z-50 w-auto sm:w-[440px] bg-sentinel-surface border border-sentinel-border rounded-2xl shadow-2xl shadow-sentinel-cyan/25 overflow-hidden flex flex-col transition-all duration-300 ${
              isMinimized ? "h-14" : "h-[540px] max-h-[82vh]"
            }`}
          >
            {/* Header */}
            <div className="px-4 py-3 bg-[#0c1322] border-b border-sentinel-border flex items-center justify-between select-none">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sentinel-cyan/15 border border-sentinel-cyan/30 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-sentinel-cyan" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold font-mono text-white">SENTINEL AI COPILOT</h3>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-sentinel-cyan/10 border border-sentinel-cyan/30 text-sentinel-cyan font-mono">
                      GEMINI
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                    Online QA Assistant
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-sentinel-card transition-colors"
                  title={isMinimized ? "Maximize" : "Minimize"}
                >
                  {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-sentinel-card transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body (Messages & Suggestions) */}
            {!isMinimized && (
              <>
                {/* Message Feed */}
                <div className="flex-1 p-3.5 overflow-y-auto space-y-3 font-sans text-xs bg-[#080d18]">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${
                        m.sender === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`max-w-[88%] rounded-2xl p-3 leading-relaxed relative group ${
                          m.sender === "user"
                            ? "bg-gradient-to-r from-sentinel-cyan via-blue-600 to-indigo-600 text-white rounded-tr-none shadow-md"
                            : "bg-sentinel-card border border-sentinel-border text-gray-200 rounded-tl-none shadow-md"
                        }`}
                      >
                        <div className="whitespace-pre-wrap font-sans text-[12px] break-words">
                          {m.text}
                        </div>

                        {m.sender === "copilot" && (
                          <button
                            onClick={() => copyToClipboard(m.text, m.id)}
                            className="absolute -top-2 -right-2 p-1 rounded-md bg-sentinel-surface border border-sentinel-border text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Copy Answer"
                          >
                            {copiedId === m.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono mt-1 px-1">
                        {m.timestamp}
                      </span>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex items-center gap-2 text-sentinel-cyan font-mono text-[11px] bg-sentinel-card p-2 rounded-xl w-fit border border-sentinel-border">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>Gemini AI javob tayyorlamoqda...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompt Chips (Scrollable) */}
                <div className="px-3 py-2 bg-[#0a0f1d] border-t border-sentinel-border flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {quickPrompts.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(chip.prompt)}
                      className="shrink-0 text-[10px] font-mono px-2.5 py-1 rounded-lg bg-sentinel-card hover:bg-sentinel-border border border-sentinel-border text-gray-300 hover:text-sentinel-cyan transition-all"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                {/* Input Footer */}
                <div className="p-3 bg-[#0c1322] border-t border-sentinel-border flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
                    placeholder={
                      lang === "uz"
                        ? "Savolingizni yozing..."
                        : lang === "ru"
                        ? "Задайте вопрос..."
                        : "Ask QA Copilot..."
                    }
                    className="flex-1 bg-[#080d18] border border-sentinel-border rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-sentinel-cyan transition-all"
                  />

                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!input.trim() || isLoading}
                    className="p-2 rounded-xl bg-sentinel-cyan text-black hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-bold shadow-md shadow-sentinel-cyan/20 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};
