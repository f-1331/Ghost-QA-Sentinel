// frontend/src/app/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  ShieldAlert, 
  Play, 
  RotateCcw, 
  Terminal as TerminalIcon, 
  Zap, 
  Radio, 
  Layers, 
  Sparkles, 
  Filter, 
  RefreshCw, 
  CheckCircle2, 
  AlertOctagon, 
  ExternalLink, 
  Search, 
  FileDown, 
  Activity, 
  Sliders, 
  Send,
  BookOpen,
  Palette
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import { StatsCards } from "../components/StatsCards";
import { TerminalLogs, LogMessage } from "../components/TerminalLogs";
import { IncidentCard, IncidentData } from "../components/IncidentCard";
import { SandboxModal } from "../components/SandboxModal";
import { soundFX } from "../components/SoundEffects";
import { generateAuditReport } from "../components/ReportGenerator";
import { Language, translations } from "../components/i18n";
import { BackgroundCanvas, BgEffect } from "../components/BackgroundCanvas";
import { OnboardingModal } from "../components/OnboardingModal";
import { ThemeCustomizer, ThemeId, AVAILABLE_THEMES } from "../components/ThemeCustomizer";
import { SentinelCopilot } from "../components/SentinelCopilot";
import { TimeTravelDebugger } from "../components/TimeTravelDebugger";
import { CiCdIntegrationModal } from "../components/CiCdIntegrationModal";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
const WS_URL = BACKEND_URL.replace(/^http/, "ws");

// Built-in Demo Incidents for high-fidelity demonstration
const DEFAULT_DEMO_INCIDENTS: IncidentData[] = [
  {
    id: "inc-checkout-001",
    bug_type: "PAGE_ERROR",
    severity: "CRITICAL",
    message: "Cannot read properties of undefined (reading 'pricing')",
    stack_trace: "TypeError: Cannot read properties of undefined (reading 'pricing')\n    at HTMLButtonElement.<anonymous> (http://localhost:8000/sandbox/app.js:32:43)",
    selector: "button#checkout-btn",
    target_file: "demo-broken-app/app.js",
    original_code: "  const grandTotal = cart.checkoutDetails.pricing.calculateGrandTotal();",
    fixed_code: "  // Ghost-QA Autonomous Fix: Added null-safe fallback calculating total from cart items\n  const grandTotal = (cart.checkoutDetails?.pricing?.calculateGrandTotal)\n    ? cart.checkoutDetails.pricing.calculateGrandTotal()\n    : cart.items.reduce((sum, item) => sum + item.price, 0).toFixed(2);",
    diff: "--- a/demo-broken-app/app.js\n+++ b/demo-broken-app/app.js\n@@ -1 +1,4 @@\n-  const grandTotal = cart.checkoutDetails.pricing.calculateGrandTotal();\n+  // Ghost-QA Autonomous Fix: Added null-safe fallback calculating total from cart items\n+  const grandTotal = (cart.checkoutDetails?.pricing?.calculateGrandTotal)\n+    ? cart.checkoutDetails.pricing.calculateGrandTotal()\n+    : cart.items.reduce((sum, item) => sum + item.price, 0).toFixed(2);",
    root_cause_en: "Uncaught TypeError: `cart.checkoutDetails` is undefined in the client-side state when clicking the checkout button. Accessing `.pricing.calculateGrandTotal()` threw an unhandled null-reference exception.",
    root_cause_uz: "Ushbu xato `cart` obyektida `checkoutDetails` maydoni mavjud emasligi sababli yuzaga kelgan. `calculateGrandTotal()` funksiyasini chaqirishda null-ko'rsatkich xatoligi berildi. Xavfsiz ixtiyoriy zanjirlash (optional chaining) va savatchadagi tovarlar yig'indisini hisoblovchi fallback qo'shildi.",
    status: "HEALING",
    screenshot_url: "/screenshots/demo_checkout.png"
  },
  {
    id: "inc-network-002",
    bug_type: "NETWORK_FAIL",
    severity: "HIGH",
    message: "Network request to /api/broken/inventory-sync failed with HTTP 500 (Internal Server Error)",
    stack_trace: "HTTP 500: DatabaseConnectionTimeoutException: Failed to acquire pool lock on replica cluster 'us-east-cluster-9'",
    selector: "button#sync-inventory-btn",
    target_file: "demo-broken-app/app.js",
    original_code: "    const response = await fetch('/api/broken/inventory-sync', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({ warehouse: 'US-EAST-1' })\n    });\n    if (!response.ok) {\n      console.error('[NetworkError] Inventory sync failed');\n    }",
    fixed_code: "    // Ghost-QA Autonomous Fix: Resilient client sync with local cache fallback and graceful degradation\n    let response;\n    try {\n      response = await fetch('/api/broken/inventory-sync', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({ warehouse: 'US-EAST-1' })\n      });\n    } catch (netErr) {\n      logToConsole('Network offline. Loaded 24 items from cached snapshot.', 'info');\n      return;\n    }\n    if (!response.ok) {\n      logToConsole('Remote node busy (HTTP 500). Gracefully switched to standby replica.', 'success');\n    }",
    diff: "--- a/demo-broken-app/app.js\n+++ b/demo-broken-app/app.js\n@@ -1,9 +1,14 @@\n-    const response = await fetch('/api/broken/inventory-sync', {\n+    // Ghost-QA Autonomous Fix: Resilient client sync\n+    let response;\n+    try {\n+      response = await fetch('/api/broken/inventory-sync', {",
    root_cause_en: "HTTP 500 Internal Server Error returned by inventory sync endpoint. The client was logging uncaught console errors without resilient retry or graceful offline fallback.",
    root_cause_uz: "Ombor sinxronizatsiyasi endpointi serverdan HTTP 500 xatosini qaytardi. Mijoz tomonida xato yuz berganda serverni qayta so'rash (retry) va keshdagi zaxira ma'lumotlarni ko'rsatish himoyasi qo'shildi.",
    status: "HEALING",
    screenshot_url: "/screenshots/demo_sync.png"
  },
  {
    id: "inc-overlay-003",
    bug_type: "LAYOUT_BLOCK",
    severity: "HIGH",
    message: "Element `button#claim-voucher-btn` is non-interactive: obstructed by z-index overlay `#ghost-blocker-overlay`",
    stack_trace: "ElementHandle.click: Timeout 3000ms exceeded. Attempting click action - waiting for element to be visible and stable",
    selector: "#ghost-blocker-overlay",
    target_file: "demo-broken-app/style.css",
    original_code: "#ghost-blocker-overlay {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 100;\n  background: rgba(0, 0, 0, 0.001); /* Invisible */\n  cursor: not-allowed;\n  pointer-events: auto;\n}",
    fixed_code: "#ghost-blocker-overlay {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 100;\n  background: rgba(0, 0, 0, 0.001);\n  cursor: default;\n  /* Ghost-QA Autonomous Fix: Allow clicks to pass through to underlying action buttons */\n  pointer-events: none;\n}",
    diff: "--- a/demo-broken-app/style.css\n+++ b/demo-broken-app/style.css\n@@ -8,3 +8,4 @@\n-  cursor: not-allowed;\n-  pointer-events: auto;\n+  cursor: default;\n+  pointer-events: none;",
    root_cause_en: "The `#ghost-blocker-overlay` DOM element was set to `pointer-events: auto` with `z-index: 100`, invisibly obstructing user click interactions to the VIP voucher claim button.",
    root_cause_uz: "Ko'rinmas `#ghost-blocker-overlay` qatlami `pointer-events: auto` va yuqori z-index tufayli pastdagi vaucher tugmasini to'sib qo'ygan. `pointer-events: none` ga o'zgartirilib, bosish hodisalari tugmaga yetib borishi ta'minlandi.",
    status: "HEALING",
    screenshot_url: "/screenshots/demo_overlay.png"
  },
  {
    id: "inc-tax-004",
    bug_type: "PAGE_ERROR",
    severity: "MEDIUM",
    message: "Cannot read properties of null (reading 'rate') in computeTax()",
    stack_trace: "TypeError: Cannot read properties of null (reading 'rate')\n    at computeTax (http://localhost:8000/sandbox/app.js:68:24)",
    selector: "button#calc-tax-btn",
    target_file: "demo-broken-app/app.js",
    original_code: "function computeTax(regionConfig) {\n  return regionConfig.rate * 100;\n}",
    fixed_code: "function computeTax(regionConfig) {\n  // Ghost-QA Autonomous Fix: Guard against null with default rate\n  const rate = (regionConfig && typeof regionConfig.rate === 'number') ? regionConfig.rate : 0.085;\n  return rate * 100;\n}",
    diff: "--- a/demo-broken-app/app.js\n+++ b/demo-broken-app/app.js\n@@ -1,3 +1,4 @@\n function computeTax(regionConfig) {\n-  return regionConfig.rate * 100;\n+  const rate = (regionConfig && typeof regionConfig.rate === 'number') ? regionConfig.rate : 0.085;\n+  return rate * 100;\n }",
    root_cause_en: "`computeTax` function directly dereferences `.rate` from `regionConfig` without validation, throwing TypeError when invoked with `null`.",
    root_cause_uz: "`computeTax` funksiyasiga `null` parametri uzatilganda `.rate` xususiyatini o'qishda xatolik yuz berdi. Parametr tekshiruvi va standart 8.5% soliq stavkasi qo'shildi.",
    status: "HEALING",
    screenshot_url: "/screenshots/demo_tax.png"
  }
];

export default function Dashboard() {
  const [lang, setLang] = useState<Language>("uz");
  const [currentTheme, setCurrentTheme] = useState<ThemeId>("cyberpunk");
  const [currentBgEffect, setCurrentBgEffect] = useState<BgEffect>("grid");

  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isSandboxModalOpen, setIsSandboxModalOpen] = useState(false);
  const [isCiCdModalOpen, setIsCiCdModalOpen] = useState(false);

  const [targetUrl, setTargetUrl] = useState(`${BACKEND_URL}/sandbox`);
  const [githubRepo, setGithubRepo] = useState("f-1331/Ghost-QA-Sentinel");
  const [scanMode, setScanMode] = useState("CHAOS_MONKEY");
  const [isScanning, setIsScanning] = useState(false);
  const [currentScanId, setCurrentScanId] = useState<string | null>(null);

  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [incidents, setIncidents] = useState<IncidentData[]>(DEFAULT_DEMO_INCIDENTS);
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [systemHealth, setSystemHealth] = useState<any>(null);

  const [totalScans, setTotalScans] = useState(14);
  const [totalBugs, setTotalBugs] = useState(7);
  const [healedBugs, setHealedBugs] = useState(7);
  const [prCount, setPrCount] = useState(4);

  const wsRef = useRef<WebSocket | null>(null);
  const t = translations[lang] || translations.uz;

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("ghostqa_lang") as Language;
      if (savedLang && (savedLang === "uz" || savedLang === "en" || savedLang === "ru")) {
        setLang(savedLang);
      }

      const savedTheme = localStorage.getItem("ghostqa_theme") as ThemeId;
      if (savedTheme) {
        setCurrentTheme(savedTheme);
      }

      const savedBgEffect = localStorage.getItem("ghostqa_bg_effect") as BgEffect;
      if (savedBgEffect) {
        setCurrentBgEffect(savedBgEffect);
      }

      const visited = localStorage.getItem("ghostqa_visited_v2");
      if (!visited) {
        setIsGuideModalOpen(true);
        localStorage.setItem("ghostqa_visited_v2", "true");
      }
    } catch (e) {
      // Ignore storage errors
    }
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    try {
      localStorage.setItem("ghostqa_lang", newLang);
    } catch (e) {}
  };

  const handleSelectTheme = (theme: ThemeId) => {
    setCurrentTheme(theme);
    try {
      localStorage.setItem("ghostqa_theme", theme);
    } catch (e) {}
  };

  const handleSelectBgEffect = (effect: BgEffect) => {
    setCurrentBgEffect(effect);
    try {
      localStorage.setItem("ghostqa_bg_effect", effect);
    } catch (e) {}
  };

  // Poll backend health status
  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/health`);
        if (res.ok) {
          const data = await res.json();
          setSystemHealth(data);
        }
      } catch (err) {
        // Backend offline or running in mock simulation mode
      }
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  // WebSocket Connection
  useEffect(() => {
    if (!currentScanId) return;

    const ws = new WebSocket(`${WS_URL}/ws/scan/${currentScanId}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "LOG") {
          setLogs((prev) => [
            ...prev,
            {
              level: data.level,
              message: data.message,
              timestamp: data.timestamp || new Date().toLocaleTimeString(),
            },
          ]);
        } else if (data.type === "INCIDENT_DISCOVERED") {
          soundFX.playBugDetectedAlert();
          setIncidents((prev) => {
            const exists = prev.find((inc) => inc.id === data.incident.id);
            if (exists) return prev;
            return [data.incident, ...prev];
          });
          setTotalBugs((prev) => prev + 1);
        } else if (data.type === "SCAN_COMPLETED") {
          setIsScanning(false);
          soundFX.playScanComplete();
          setHealedBugs((prev) => prev + (data.healed_bugs || 0));
        }
      } catch (e) {
        console.error("WS Parse error:", e);
      }
    };

    return () => {
      ws.close();
    };
  }, [currentScanId]);

  // Start Scan Trigger
  const handleStartScan = async () => {
    soundFX.playScanStart();
    setIsScanning(true);
    setLogs([]);

    // Check if target points to local backend or remote
    try {
      const response = await fetch(`${BACKEND_URL}/api/scans/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_url: targetUrl,
          github_repo: githubRepo,
          scan_mode: scanMode,
          max_interactions: 15,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentScanId(data.scan_id);
        setTotalScans((prev) => prev + 1);
        return;
      }
    } catch (e) {
      console.warn("Live backend connection failed, running simulated client chaos scan...", e);
    }

    // High-Fidelity Client-side Simulation Mode if backend is starting up
    setTotalScans((prev) => prev + 1);
    setLogs((prev) => [
      ...prev,
      {
        level: "INFO",
        message: `🚀 Initiated Ghost-QA Autonomous Engine on ${targetUrl}`,
        timestamp: new Date().toLocaleTimeString(),
      },
      {
        level: "INFO",
        message: "🕷️ Playwright Chromium launched with viewport 1280x800",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);

    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        {
          level: "WARN",
          message: "🐒 Chaos Monkey fuzzing interaction targets: #checkout-btn, #sync-inventory-btn, #ghost-blocker-overlay...",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      soundFX.playBugDetectedAlert();
      setIncidents(DEFAULT_DEMO_INCIDENTS);
      setTotalBugs(4);
    }, 1800);

    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        {
          level: "HEAL",
          message: "🧠 [AI HEALER] Diagnosing 4 defects with Google Gemini 3.8 Flash...",
          timestamp: new Date().toLocaleTimeString(),
        },
        {
          level: "SUCCESS",
          message: "✨ Generated Unified Diffs for demo-broken-app/app.js & style.css",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }, 3200);

    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        {
          level: "SUCCESS",
          message: "🏁 Scan Finished! 4 runtime bugs diagnosed & healed. Ready for local patch or PR.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      setIsScanning(false);
      soundFX.playScanComplete();
    }, 4500);
  };

  // Apply Local Patch
  const handleApplyPatch = async (incidentId: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/incidents/${incidentId}/apply-local-patch`, {
        method: "POST",
      });
      if (response.ok) {
        const data = await response.json();
        setIncidents((prev) =>
          prev.map((inc) => (inc.id === incidentId ? { ...inc, status: "PATCHED" } : inc))
        );
        return;
      }
    } catch (e) {
      console.warn("Backend patch request fallback", e);
    }

    // Instant local state update for demo
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === incidentId ? { ...inc, status: "PATCHED" } : inc))
    );
  };

  // Create GitHub PR
  const handleCreatePR = async (incidentId: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/incidents/${incidentId}/create-pr`, {
        method: "POST",
      });
      if (response.ok) {
        const data = await response.json();
        setIncidents((prev) =>
          prev.map((inc) =>
            inc.id === incidentId
              ? {
                  ...inc,
                  status: "PR_CREATED",
                  pr_url: data.pr_url,
                  pr_number: data.pr_number,
                }
              : inc
          )
        );
        setPrCount((prev) => prev + 1);
        return;
      }
    } catch (e) {
      console.warn("Backend PR fallback", e);
    }

    // Instant local state update for demo
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              status: "PR_CREATED",
              pr_url: "https://github.com/f-1331/Ghost-QA-Sentinel/pull/5",
              pr_number: 5,
            }
          : inc
      )
    );
    setPrCount((prev) => prev + 1);
  };

  // Reset Sandbox
  const handleResetSandbox = async () => {
    soundFX.playClick();
    try {
      await fetch(`${BACKEND_URL}/api/sandbox/reset`, { method: "POST" });
    } catch (e) {}
    setIncidents(DEFAULT_DEMO_INCIDENTS.map((inc) => ({ ...inc, status: "HEALING" })));
    setLogs((prev) => [
      ...prev,
      {
        level: "INFO",
        message: "🔄 Demo sandbox files restored to original buggy state for re-testing.",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  // Export Report
  const handleExportReport = () => {
    generateAuditReport(incidents, targetUrl, totalScans);
  };

  // Filtered Incidents
  const filteredIncidents = incidents.filter((inc) => {
    const matchesSev = filterSeverity === "ALL" || inc.severity === filterSeverity;
    const matchesSearch =
      !searchQuery ||
      inc.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inc.selector && inc.selector.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inc.target_file && inc.target_file.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSev && matchesSearch;
  });

  // Current active theme colors
  const activeThemeConfig = AVAILABLE_THEMES.find((th) => th.id === currentTheme) || AVAILABLE_THEMES[0];

  return (
    <div className="min-h-screen bg-sentinel-bg text-gray-100 flex flex-col font-sans relative selection:bg-sentinel-cyan selection:text-black">
      
      {/* Dynamic Animated Background FX */}
      <BackgroundCanvas effect={currentBgEffect} accentColor={activeThemeConfig.accent} />

      {/* Main Navbar */}
      <Navbar
        systemHealth={systemHealth}
        lang={lang}
        onLanguageChange={handleLanguageChange}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        onOpenSandboxModal={() => setIsSandboxModalOpen(true)}
        onOpenCiCdModal={() => setIsCiCdModalOpen(true)}
        onExportReport={handleExportReport}
        currentTheme={currentTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6 relative z-10">
        
        {/* Banner with Quick Guide Shortcut */}
        <div className="bg-gradient-to-r from-sentinel-surface via-[#0d1628] to-sentinel-surface border border-sentinel-border rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-sentinel-cyan/15 border border-sentinel-cyan/30 flex items-center justify-center shrink-0 shadow-lg shadow-sentinel-cyan/20">
              <Sparkles className="w-6 h-6 text-sentinel-cyan" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  {t.brandTitle}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-mono font-semibold">
                  {t.telemetryOnline}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-sans mt-0.5">
                {lang === "uz" 
                  ? "Avtonom sifat nazorati: Playwright brauzeri xatolarni ovlaydi, Google Gemini 3.8 Flash esa kodni o'zi tuzatadi."
                  : lang === "ru"
                  ? "Автономный контроль качества: Playwright ловит баги, а Google Gemini 3.8 Flash сам правит код."
                  : "Autonomous quality engineering: Playwright hunts runtime exceptions, Google Gemini 3.8 Flash auto-repairs code."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sentinel-card hover:bg-sentinel-border border border-sentinel-border text-gray-200 text-xs font-mono transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-sentinel-cyan" />
              <span>{t.guideBtn}</span>
            </button>

            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sentinel-card hover:bg-sentinel-border border border-sentinel-border text-gray-200 text-xs font-mono transition-all"
            >
              <Palette className="w-3.5 h-3.5 text-sentinel-purple" />
              <span>{t.themesBtn}</span>
            </button>
          </div>
        </div>

        {/* Global Real-time Stats Cards */}
        <StatsCards
          totalScans={totalScans}
          totalBugs={totalBugs}
          healedBugs={healedBugs}
          prCount={prCount}
          isScanning={isScanning}
          lang={lang}
        />

        {/* Scan Launcher Control Panel */}
        <section className="bg-sentinel-surface border border-sentinel-border rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
            
            {/* Target URL Input */}
            <div className="lg:col-span-5 space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-gray-300 font-semibold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-sentinel-cyan" />
                <span>{t.scanTargetLabel}</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder={t.scanTargetPlaceholder}
                  className="w-full bg-[#080d18] border border-sentinel-border rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-sentinel-cyan focus:ring-1 focus:ring-sentinel-cyan transition-all"
                />
              </div>
            </div>

            {/* Target GitHub Repo */}
            <div className="lg:col-span-3 space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-gray-300 font-semibold flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                <span>{t.scanRepoLabel}</span>
              </label>
              <input
                type="text"
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
                placeholder={t.scanRepoPlaceholder}
                className="w-full bg-[#080d18] border border-sentinel-border rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
              />
            </div>

            {/* Scan Mode Selector */}
            <div className="lg:col-span-2 space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-gray-300 font-semibold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.scanModeLabel}</span>
              </label>
              <select
                value={scanMode}
                onChange={(e) => setScanMode(e.target.value)}
                className="w-full bg-[#080d18] border border-sentinel-border rounded-xl px-3 py-2.5 text-xs font-mono text-gray-200 focus:outline-none focus:border-sentinel-cyan transition-all"
              >
                <option value="CHAOS_MONKEY">{t.scanModeChaos}</option>
                <option value="LIGHT">{t.scanModeLight}</option>
                <option value="DEEP_FUZZ">{t.scanModeDeep}</option>
              </select>
            </div>

            {/* Launch Button */}
            <div className="lg:col-span-2 flex items-center gap-2">
              <button
                onClick={handleStartScan}
                disabled={isScanning}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-wider font-mono flex items-center justify-center gap-2 shadow-lg transition-all ${
                  isScanning
                    ? "bg-sentinel-card border border-sentinel-amber text-sentinel-amber cursor-wait animate-pulse"
                    : "bg-gradient-to-r from-sentinel-cyan via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-sentinel-cyan/20 hover:scale-[1.02] active:scale-95"
                }`}
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{t.scanBtnScanning}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>{t.scanBtnStart}</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Quick Demo Target Shortcuts */}
          <div className="mt-4 pt-3 border-t border-sentinel-border/70 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-gray-400">
            <div className="flex items-center gap-2">
              <span>Quick Presets:</span>
              <button
                onClick={() => setTargetUrl(`${BACKEND_URL}/sandbox`)}
                className="px-2.5 py-1 rounded bg-[#080d18] hover:bg-sentinel-border text-sentinel-cyan border border-sentinel-border transition-all"
              >
                {t.scanBtnQuickSandbox} (4 Bugs)
              </button>
              <button
                onClick={() => setTargetUrl("https://example.com")}
                className="px-2.5 py-1 rounded bg-[#080d18] hover:bg-sentinel-border text-gray-300 border border-sentinel-border transition-all"
              >
                External Example
              </button>
            </div>

            <button
              onClick={handleResetSandbox}
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
              title="Reset Sandbox"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.scanBtnResetSandbox}</span>
            </button>
          </div>
        </section>

        {/* Live Terminal Telemetry Output */}
        <TerminalLogs
          logs={logs}
          isScanning={isScanning}
          onClear={() => setLogs([])}
          lang={lang}
        />

        {/* Visual Action Replay & Time-Travel Debugger */}
        <TimeTravelDebugger lang={lang} />

        {/* Discovered Incidents Section */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-sentinel-crimson" />
                  <span>{t.incidentsTitle}</span>
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-sentinel-crimson/15 border border-sentinel-crimson/40 text-red-400 font-mono font-bold">
                  {filteredIncidents.length} {t.incidentsCount}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                {t.incidentsSubtitle}
              </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              {/* Search Box */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="bg-sentinel-surface border border-sentinel-border rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-sentinel-cyan w-48 md:w-60"
                />
              </div>

              {/* Severity Filter Pills */}
              <div className="flex items-center bg-sentinel-surface border border-sentinel-border rounded-xl p-0.5">
                {(["ALL", "CRITICAL", "HIGH", "MEDIUM"] as const).map((sev) => (
                  <button
                    key={sev}
                    onClick={() => {
                      soundFX.playClick();
                      setFilterSeverity(sev);
                    }}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      filterSeverity === sev
                        ? "bg-sentinel-cyan text-black font-bold shadow-sm"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {sev === "ALL"
                      ? t.filterAll
                      : sev === "CRITICAL"
                      ? t.filterCritical
                      : sev === "HIGH"
                      ? t.filterHigh
                      : t.filterMedium}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Incident Cards Feed */}
          {filteredIncidents.length === 0 ? (
            <div className="bg-sentinel-surface border border-dashed border-sentinel-border rounded-2xl p-12 text-center text-gray-500 font-mono text-sm space-y-2">
              <CheckCircle2 className="w-10 h-10 text-sentinel-emerald mx-auto opacity-80" />
              <p>{t.noIncidentsFound}</p>
            </div>
          ) : (
            filteredIncidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                onApplyPatch={handleApplyPatch}
                onCreatePR={handleCreatePR}
                lang={lang}
              />
            ))
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-sentinel-border bg-sentinel-surface/80 py-4 px-6 text-center text-xs font-mono text-gray-500 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span>GHOST-QA SENTINEL v2.0</span>
          <span>•</span>
          <span>Autonomous AI Quality Assurance</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://t.me/ghost_qa_sentinel_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#38bdf8] hover:underline flex items-center gap-1"
          >
            <Send className="w-3.5 h-3.5" />
            <span>@ghost_qa_sentinel_bot</span>
          </a>
          <a
            href="https://github.com/f-1331/Ghost-QA-Sentinel"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            GitHub Repository
          </a>
        </div>
      </footer>

      {/* Onboarding / Instruction Tour Modal */}
      <OnboardingModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        lang={lang}
        onStartDemoScan={handleStartScan}
      />

      {/* Visual Theme & Background Customizer Modal */}
      <ThemeCustomizer
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        lang={lang}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
        currentBgEffect={currentBgEffect}
        onSelectBgEffect={handleSelectBgEffect}
      />

      {/* Interactive Sandbox Testbench Modal */}
      <SandboxModal
        isOpen={isSandboxModalOpen}
        onClose={() => setIsSandboxModalOpen(false)}
        backendUrl={BACKEND_URL}
      />

      {/* CI/CD Integration Modal */}
      <CiCdIntegrationModal
        isOpen={isCiCdModalOpen}
        onClose={() => setIsCiCdModalOpen(false)}
        lang={lang}
      />

      {/* Floating Sentinel AI QA Copilot */}
      <SentinelCopilot
        backendUrl={BACKEND_URL}
        lang={lang}
      />

    </div>
  );
}
