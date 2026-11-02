// frontend/src/components/IncidentCard.tsx
"use client";

import React, { useState } from "react";
import { 
  Bug, 
  Sparkles, 
  GitPullRequest, 
  CheckCircle2, 
  ExternalLink, 
  Eye, 
  Wrench, 
  AlertTriangle,
  Code,
  FlaskConical,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Crosshair,
  Maximize2,
  Terminal,
  ShieldAlert
} from "lucide-react";
import { DiffViewer } from "./DiffViewer";
import { Language, translations } from "./i18n";
import { soundFX } from "./SoundEffects";

export interface IncidentData {
  id: string;
  bug_type: string;
  severity: string;
  message: string;
  stack_trace?: string;
  selector?: string;
  screenshot_url?: string;
  target_file?: string;
  original_code?: string;
  fixed_code?: string;
  diff?: string;
  root_cause_en?: string;
  root_cause_uz?: string;
  pr_url?: string;
  pr_number?: number;
  status: string;
  created_at?: string;
}

interface IncidentCardProps {
  incident: IncidentData;
  onApplyPatch: (incidentId: string) => Promise<void>;
  onCreatePR: (incidentId: string) => Promise<void>;
  lang?: Language;
  backendUrl?: string;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({
  incident,
  onApplyPatch,
  onCreatePR,
  lang = "uz",
  backendUrl = "http://localhost:8000"
}) => {
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);
  const [showTestSpec, setShowTestSpec] = useState(false);
  const [copiedTest, setCopiedTest] = useState(false);
  const [isPatching, setIsPatching] = useState(false);
  const [isCreatingPR, setIsCreatingPR] = useState(false);
  const [imgLoadFailed, setImgLoadFailed] = useState(false);
  const [retryWithBackend, setRetryWithBackend] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showInspectorOverlay, setShowInspectorOverlay] = useState(true);

  const t = translations[lang] || translations.uz;

  // Resolve screenshot URL
  const getScreenshotSrc = () => {
    if (!incident.screenshot_url) return "";
    if (incident.screenshot_url.startsWith("http") || incident.screenshot_url.startsWith("data:")) {
      return incident.screenshot_url;
    }
    if (retryWithBackend) {
      return `${backendUrl.replace(/\/$/, '')}${incident.screenshot_url}`;
    }
    return incident.screenshot_url;
  };

  const handleImageError = () => {
    if (!retryWithBackend && incident.screenshot_url && !incident.screenshot_url.startsWith("http")) {
      // First retry pointing directly to the backend
      setRetryWithBackend(true);
    } else {
      setImgLoadFailed(true);
    }
  };

  const generatedPlaywrightSpec = `// Playwright Regression Test Guard for ${incident.id}
import { test, expect } from '@playwright/test';

test('Guard against regression: ${incident.bug_type} on ${incident.selector || "target"}', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.goto('/sandbox');
  await page.waitForSelector('${incident.selector || "body"}');
  await page.click('${incident.selector || "body"}');
  await page.waitForTimeout(400);

  // Assert zero runtime unhandled exceptions
  expect(errors).toHaveLength(0);
});`;

  const getSeverityBadge = (sev: string) => {
    switch (sev.toUpperCase()) {
      case "CRITICAL":
        return "bg-red-500/15 border-red-500/50 text-red-400 font-bold";
      case "HIGH":
        return "bg-orange-500/15 border-orange-500/50 text-orange-400 font-bold";
      case "MEDIUM":
        return "bg-amber-500/15 border-amber-500/50 text-amber-400";
      default:
        return "bg-blue-500/15 border-blue-500/50 text-blue-400";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "PATCHED":
        return (
          <span className="flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-semibold font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t.statusPatched}
          </span>
        );
      case "HEALING":
        return (
          <span className="flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-sentinel-cyan font-semibold font-mono">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            {t.statusHealing}
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 font-semibold font-mono">
            <AlertTriangle className="w-3.5 h-3.5" />
            {t.statusDiscovered}
          </span>
        );
    }
  };

  const handleApply = async () => {
    setIsPatching(true);
    soundFX.playHeal();
    try {
      await onApplyPatch(incident.id);
    } finally {
      setIsPatching(false);
    }
  };

  const handleCreatePR = async () => {
    setIsCreatingPR(true);
    soundFX.playClick();
    try {
      await onCreatePR(incident.id);
    } finally {
      setIsCreatingPR(false);
    }
  };

  const copyTestSpec = () => {
    navigator.clipboard.writeText(generatedPlaywrightSpec);
    setCopiedTest(true);
    soundFX.playClick();
    setTimeout(() => setCopiedTest(false), 2000);
  };

  const downloadScreenshot = () => {
    const src = getScreenshotSrc();
    if (!src) return;
    const a = document.createElement("a");
    a.href = src;
    a.download = `incident-${incident.id}-screenshot.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-sentinel-surface border border-sentinel-border rounded-2xl p-5 shadow-lg hover:border-sentinel-cyan/40 transition-all duration-300">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-sentinel-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sentinel-card border border-sentinel-border flex items-center justify-center shrink-0">
            <Bug className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono font-bold text-sm text-white">
                {incident.bug_type}
              </span>
              <span
                className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border ${getSeverityBadge(
                  incident.severity
                )}`}
              >
                {incident.severity}
              </span>
              {getStatusBadge(incident.status)}
            </div>
            <p className="text-xs text-gray-400 mt-1 font-mono">
              ID: {incident.id} {incident.created_at && `• ${new Date(incident.created_at).toLocaleTimeString()}`}
            </p>
          </div>
        </div>

        {incident.pr_url && (
          <a
            href={incident.pr_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors font-mono bg-purple-950/40 border border-purple-800/40 px-3 py-1.5 rounded-lg w-fit"
          >
            <GitPullRequest className="w-3.5 h-3.5" />
            <span>PR #{incident.pr_number || "Open"}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Main Body Grid */}
      <div className="mt-4 space-y-4">
        {/* Error message */}
        <div className="bg-[#0b101c] border border-sentinel-border rounded-xl p-3.5 font-mono text-xs text-red-300">
          <div className="text-gray-500 text-[11px] uppercase tracking-wider mb-1">
            {lang === "uz" ? "Yuzaga kelgan xatolik" : lang === "ru" ? "Исключение" : "Exception Details"}:
          </div>
          <div className="font-bold break-words">{incident.message}</div>
        </div>

        {/* 2-Col Layout: Stack trace & Screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Col: Stack trace / Target context */}
          <div className="bg-[#080d18] border border-sentinel-border rounded-xl p-3 flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase font-mono tracking-wider text-gray-400 mb-2 flex items-center justify-between">
                <span>{t.stackTraceTitle}</span>
                {incident.selector && (
                  <span className="text-sentinel-cyan text-[11px] font-mono">
                    {incident.selector}
                  </span>
                )}
              </div>
              <pre className="text-[11px] font-mono text-gray-400 whitespace-pre-wrap break-all max-h-36 overflow-y-auto leading-relaxed bg-black/40 p-2 rounded border border-gray-800">
                {incident.stack_trace || "No active stack trace captured."}
              </pre>
            </div>

            {incident.target_file && (
              <div className="mt-3 pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs font-mono text-gray-400">
                <span>{t.targetFileTitle}:</span>
                <span className="text-sentinel-cyan font-semibold">{incident.target_file}</span>
              </div>
            )}
          </div>

          {/* Right Col: Captured Screenshot / Inspector Preview */}
          <div className="bg-[#080d18] border border-sentinel-border rounded-xl p-3 flex flex-col justify-between">
            <div className="text-xs uppercase font-mono tracking-wider text-gray-400 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-sentinel-cyan" />
                <span>{t.viewScreenshotBtn}</span>
              </span>
              <button
                onClick={() => {
                  soundFX.playClick();
                  setShowScreenshotModal(true);
                }}
                className="text-[11px] text-sentinel-cyan hover:underline font-mono flex items-center gap-1"
              >
                <Maximize2 className="w-3 h-3" />
                <span>Kattalashtirish</span>
              </button>
            </div>

            {incident.screenshot_url && !imgLoadFailed ? (
              <div
                onClick={() => {
                  soundFX.playClick();
                  setShowScreenshotModal(true);
                }}
                className="cursor-pointer group relative rounded-lg overflow-hidden border border-gray-800 h-28 bg-black flex items-center justify-center"
              >
                <img
                  src={getScreenshotSrc()}
                  alt="Defect Snapshot"
                  onError={handleImageError}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-mono font-medium gap-1.5 backdrop-blur-[2px]">
                  <Crosshair className="w-4 h-4 text-sentinel-cyan animate-pulse" />
                  <span>Tekshirish & Zoom</span>
                </div>
              </div>
            ) : (
              /* High-tech DOM Blueprint Fallback */
              <div 
                onClick={() => {
                  soundFX.playClick();
                  setShowScreenshotModal(true);
                }}
                className="h-28 rounded-lg bg-gradient-to-br from-[#0c1424] to-[#060911] border border-sentinel-cyan/30 p-2.5 flex flex-col justify-between cursor-pointer group hover:border-sentinel-cyan transition-all relative overflow-hidden"
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-red-400 flex items-center gap-1 font-bold">
                    <Crosshair className="w-3 h-3 text-red-500 animate-spin" />
                    DOM CRASH LOCUS
                  </span>
                  <span className="text-gray-500">1280x800 Viewport</span>
                </div>
                <div className="bg-black/60 p-1.5 rounded border border-red-500/20 text-[11px] font-mono text-gray-300 truncate">
                  <span className="text-red-400 mr-1.5">FAIL:</span>
                  {incident.selector || "window.unhandledException"}
                </div>
                <div className="text-[10px] font-mono text-sentinel-cyan flex items-center justify-between">
                  <span>DOM Blueprint Viewer</span>
                  <span className="group-hover:translate-x-1 transition-transform">Kattalashtirish →</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Root Cause Analysis Section */}
        {(incident.root_cause_uz || incident.root_cause_en) && (
          <div className="bg-sentinel-card border border-sentinel-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2 text-sentinel-cyan font-mono text-xs font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>{t.rootCauseTitle} (Gemini 3.8 Flash):</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              {lang === "uz"
                ? incident.root_cause_uz || incident.root_cause_en
                : incident.root_cause_en || incident.root_cause_uz}
            </p>
          </div>
        )}

        {/* Autonomous Code Diff Section */}
        {incident.diff && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-gray-400">
              <span className="flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === "uz" ? "Avtonom Kod Tuzatishi (Unified Diff)" : lang === "ru" ? "Автономное Исправление (Diff)" : "Autonomous Fix (Unified Diff)"}</span>
              </span>
              <span className="text-emerald-400 font-semibold">{t.patchedSuccess}</span>
            </div>
            <DiffViewer
              targetFile={incident.target_file}
              originalCode={incident.original_code}
              fixedCode={incident.fixed_code}
              unifiedDiff={incident.diff}
            />
          </div>
        )}

        {/* Playwright Test Spec Dropdown */}
        <div className="border border-sentinel-border/80 rounded-xl overflow-hidden bg-[#0a0f1d]">
          <button
            onClick={() => {
              soundFX.playClick();
              setShowTestSpec(!showTestSpec);
            }}
            className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-mono text-gray-400 hover:text-gray-200 hover:bg-sentinel-card/40 transition-colors"
          >
            <span className="flex items-center gap-2">
              <FlaskConical className="w-3.5 h-3.5 text-sentinel-cyan" />
              <span>Avtomatlashtirilgan Playwright Regressiya Testi</span>
            </span>
            <span className="text-sentinel-cyan text-[11px] underline">
              {showTestSpec ? "Yopish ▲" : "Ko'rish ▼"}
            </span>
          </button>

          {showTestSpec && (
            <div className="p-3 bg-black/60 border-t border-sentinel-border relative">
              <button
                onClick={copyTestSpec}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-sentinel-card border border-sentinel-border text-gray-300 hover:text-white flex items-center gap-1 text-[10px] font-mono"
              >
                {copiedTest ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedTest ? "Nusxalandi" : "Nusxalash"}</span>
              </button>
              <pre className="text-[11px] font-mono text-cyan-200/90 overflow-x-auto p-2 leading-relaxed">
                {generatedPlaywrightSpec}
              </pre>
            </div>
          )}
        </div>

        {/* Action Buttons: Apply Patch & GitHub PR */}
        <div className="pt-3 border-t border-sentinel-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-gray-500 font-mono">
            {incident.status === "PATCHED"
              ? "✅ Ushbu xatolik uchun AI patchi muvaffaqiyatli qo'llangan."
              : "⚡ Tavsiya etilgan tuzatishni 1-bosishda qo'llang:"}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Apply Local Patch */}
            <button
              onClick={handleApply}
              disabled={isPatching || incident.status === "PATCHED"}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-xl text-xs font-bold transition-all shadow-md w-full sm:w-auto ${
                incident.status === "PATCHED"
                  ? "bg-emerald-950/60 border border-emerald-600/50 text-emerald-400 cursor-default"
                  : "bg-emerald-600 hover:bg-emerald-500 text-black hover:shadow-emerald-500/20"
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              {isPatching
                ? t.applyingPatch
                : incident.status === "PATCHED"
                ? t.patchedSuccess
                : t.applyPatchBtn}
            </button>

            {/* Create GitHub PR */}
            <button
              onClick={handleCreatePR}
              disabled={isCreatingPR || !!incident.pr_url}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-xl text-xs font-bold transition-all shadow-md w-full sm:w-auto ${
                incident.pr_url
                  ? "bg-purple-950/60 border border-purple-600/50 text-purple-400 cursor-default"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white hover:shadow-purple-500/20"
              }`}
            >
              <GitPullRequest className="w-3.5 h-3.5" />
              {isCreatingPR
                ? t.creatingPr
                : incident.pr_url
                ? `PR #${incident.pr_number} ${t.prCreatedSuccess}`
                : t.createPrBtn}
            </button>
          </div>
        </div>
      </div>

      {/* Enlarged Screenshot & Defect Inspector Modal */}
      {showScreenshotModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setShowScreenshotModal(false)}
        >
          <div
            className="max-w-5xl w-full bg-[#0b101d] border border-sentinel-cyan/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header & Toolbar */}
            <div className="p-4 bg-[#080d18] border-b border-sentinel-border flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <h3 className="font-mono text-xs font-bold text-white flex items-center gap-2">
                    <span>XATOLIK SKRINSHOT INSPEKTORI</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-sentinel-card border border-sentinel-border text-sentinel-cyan">
                      {incident.bug_type}
                    </span>
                  </h3>
                  <p className="text-[10px] font-mono text-gray-400 truncate max-w-xs sm:max-w-md">
                    Selector: {incident.selector || "DOM Viewport Crash"}
                  </p>
                </div>
              </div>

              {/* Inspector Controls */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Zoom In */}
                <button
                  onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.5))}
                  className="p-1.5 rounded-lg bg-sentinel-card border border-sentinel-border text-gray-300 hover:text-white hover:bg-sentinel-border"
                  title="Kattalashtirish (+)"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                {/* Zoom Out */}
                <button
                  onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
                  className="p-1.5 rounded-lg bg-sentinel-card border border-sentinel-border text-gray-300 hover:text-white hover:bg-sentinel-border"
                  title="Kichraytirish (-)"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                {/* Reset Zoom */}
                <button
                  onClick={() => setZoomLevel(1)}
                  className="p-1.5 rounded-lg bg-sentinel-card border border-sentinel-border text-gray-300 hover:text-white hover:bg-sentinel-border font-mono text-[10px] px-2"
                  title="Asliga qaytarish"
                >
                  {Math.round(zoomLevel * 100)}%
                </button>
                {/* Inspector Overlay Toggle */}
                <button
                  onClick={() => setShowInspectorOverlay(!showInspectorOverlay)}
                  className={`px-2.5 py-1 rounded-lg border font-mono text-[10px] flex items-center gap-1 transition-all ${
                    showInspectorOverlay 
                      ? "bg-red-500/20 border-red-500/50 text-red-300"
                      : "bg-sentinel-card border-sentinel-border text-gray-400"
                  }`}
                >
                  <Crosshair className="w-3 h-3" />
                  <span>Crash Locus</span>
                </button>
                {/* Download */}
                <button
                  onClick={downloadScreenshot}
                  className="p-1.5 rounded-lg bg-sentinel-card border border-sentinel-border text-gray-300 hover:text-white hover:bg-sentinel-border"
                  title="Skrinshotni yuklab olish (.png)"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                {/* Close */}
                <button
                  onClick={() => setShowScreenshotModal(false)}
                  className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 ml-2"
                >
                  ✕ Yopish
                </button>
              </div>
            </div>

            {/* Modal Body: Interactive Zoomable Image or Blueprint */}
            <div className="flex-1 overflow-auto bg-black p-4 flex items-center justify-center relative min-h-[360px] max-h-[70vh]">
              {!imgLoadFailed && incident.screenshot_url ? (
                <div 
                  className="relative transition-transform duration-200"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  <img
                    src={getScreenshotSrc()}
                    alt="Crash Viewport Capture"
                    onError={handleImageError}
                    className="max-h-[65vh] object-contain rounded-xl border border-gray-800 shadow-2xl"
                  />

                  {/* Red-line Defect Bounding Box Overlay */}
                  {showInspectorOverlay && (
                    <div className="absolute inset-x-8 bottom-12 border-2 border-dashed border-red-500 bg-red-500/15 rounded-lg p-2 flex items-center justify-between pointer-events-none animate-pulse">
                      <div className="bg-red-950/90 border border-red-500 px-2 py-0.5 rounded text-[10px] font-mono text-white flex items-center gap-1 shadow-lg">
                        <Crosshair className="w-3 h-3 text-red-400" />
                        <span>CRASH SELECTOR: {incident.selector || "Target Element"}</span>
                      </div>
                      <span className="text-[10px] font-mono text-red-200 bg-black/70 px-2 py-0.5 rounded">
                        Defect: {incident.bug_type}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                /* Sleek Blueprint Fallback Canvas */
                <div className="w-full max-w-2xl bg-gradient-to-b from-[#0e172a] to-[#070b14] border border-sentinel-cyan/40 rounded-2xl p-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/40 mx-auto flex items-center justify-center">
                    <Crosshair className="w-8 h-8 text-red-400 animate-spin" />
                  </div>
                  <div>
                    <h4 className="font-mono text-sm font-bold text-white">
                      DOM VIEWPORT DIAGNOSTIC BLUEPRINT
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      {incident.message}
                    </p>
                  </div>
                  <div className="bg-black/60 border border-gray-800 p-4 rounded-xl text-left font-mono text-xs text-gray-300 space-y-2">
                    <div className="flex justify-between border-b border-gray-800 pb-1">
                      <span className="text-gray-500">Target Selector:</span>
                      <span className="text-sentinel-cyan">{incident.selector || "body"}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-800 pb-1">
                      <span className="text-gray-500">Severity Level:</span>
                      <span className="text-red-400 font-bold">{incident.severity}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-800 pb-1">
                      <span className="text-gray-500">Status:</span>
                      <span className="text-emerald-400">{incident.status}</span>
                    </div>
                    {incident.target_file && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">File:</span>
                        <span className="text-amber-400">{incident.target_file}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-[#080d18] border-t border-sentinel-border flex items-center justify-between text-[11px] font-mono text-gray-400">
              <span>Ghost-QA Sentinel • Headless Playwright Chromium Capture</span>
              <span className="text-sentinel-cyan">AI Self-Healing Engine Active</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
