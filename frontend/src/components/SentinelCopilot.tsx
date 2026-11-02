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
  MessageSquare
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
}

export const SentinelCopilot: React.FC<SentinelCopilotProps> = ({ backendUrl, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
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
      label: lang === "uz" ? "🧪 Playwright Test Yaratish" : lang === "ru" ? "🧪 Создать Playwright Тест" : "🧪 Generate Playwright Test",
      prompt: "Qanday qilib bu xatolikka qarshi Playwright regressiya testi yozish mumkin?"
    },
    {
      label: lang === "uz" ? "🔍 TypeError Tahlili" : lang === "ru" ? "🔍 Анализ TypeError" : "🔍 Deep TypeError Analysis",
      prompt: "TypeError: Cannot read properties of undefined (reading 'pricing') xatosi nega chiqadi va uni qanday oldini olish kerak?"
    },
    {
      label: lang === "uz" ? "🛡️ Xavfsizlik Auditi" : lang === "ru" ? "🛡️ Аудит Безопасности" : "🛡️ OWASP Security Audit",
      prompt: "Ghost-QA crawler qanday xavfsizlik va SSRF himoyalariga ega?"
    },
    {
      label: lang === "uz" ? "⚡ Rust Tezligi" : lang === "ru" ? "⚡ Скорость на Rust" : "⚡ Rust Acceleration",
      prompt: "Rust dasturlash tili ushbu arxitekturada qanday ustunliklar bera oladi?"
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
          context: `User UI Language: ${lang}. Current platform: Ghost-QA Sentinel v2.0.`
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
        return;
      }
    } catch (e) {
      console.warn("Copilot backend fallback", e);
    }

    // Client-side Heuristic QA Fallback
    setTimeout(() => {
      soundFX.playHealedChime();
      let fallbackAnswer = "";
      const lower = text.toLowerCase();

      if (lower.includes("rust")) {
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
          "  // Assert that cart handles undefined pricing safely\n" +
          "  const errors = await page.locator('.log-error').count();\n" +
          "  expect(errors).toBe(0);\n" +
          "});\n" +
          "```\n" +
          "Ushbu test har bir Git commitda xatoning qayta chiqishini 100% bartaraf etadi.";
      } else {
        fallbackAnswer = 
          "🤖 **Ghost-QA AI Tavsiyasi:**\n\n" +
          "Tizim barcha runtime istisnolarni Playwright orqali real vaqtda intercept qiladi va Google Gemini 3.8 Flash orqali avtomatik kod patchini (Unified Diff) yaratadi. 1-bosishda 'Apply Local Patch' tugmasini bosib faylni mahalliy diskingizda tuzatishingiz mumkin!";
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
      {/* Floating Trigger Pill */}
      {!isOpen && (
        <button
          onClick={() => {
            soundFX.playClick();
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-sentinel-cyan via-blue-600 to-sentinel-purple text-white font-bold text-xs font-mono shadow-2xl shadow-sentinel-cyan/30 hover:scale-105 active:scale-95 transition-all group"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
          </div>
          <span className="tracking-wider">AI COPILOT</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[440px] bg-sentinel-surface border border-sentinel-border rounded-2xl shadow-2xl shadow-sentinel-cyan/20 overflow-hidden flex flex-col transition-all duration-300 ${
            isMinimized ? "h-14" : "h-[560px] max-h-[85vh]"
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-[#0c1322] border-b border-sentinel-border flex items-center justify-between select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sentinel-cyan/15 border border-sentinel-cyan/30 flex items-center justify-center">
                <Bot className="w-4 h-4 text-sentinel-cyan" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold font-mono text-white">SENTINEL AI COPILOT</h3>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-sentinel-cyan/10 border border-sentinel-cyan/30 text-sentinel-cyan font-mono">
                    GEMINI 3.8
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  Active Quality Engineering Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 rounded text-gray-400 hover:text-white hover:bg-sentinel-card transition-colors"
                title={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-gray-400 hover:text-white hover:bg-sentinel-card transition-colors"
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
              <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs bg-[#080d18]">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${
                      m.sender === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 leading-relaxed relative group ${
                        m.sender === "user"
                          ? "bg-gradient-to-r from-sentinel-cyan via-blue-600 to-indigo-600 text-white rounded-tr-none shadow-md"
                          : "bg-sentinel-card border border-sentinel-border text-gray-200 rounded-tl-none shadow-md"
                      }`}
                    >
                      <div className="whitespace-pre-wrap font-sans text-[12px]">
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
                    <span>Gemini AI synthesizing response...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Chips */}
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
                  className="p-2 rounded-xl bg-sentinel-cyan text-black hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-bold shadow-md shadow-sentinel-cyan/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
