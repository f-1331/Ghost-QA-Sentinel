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
  Globe,
  Layers,
  Code
} from "lucide-react";
import { DiffViewer } from "./DiffViewer";

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
}

export const IncidentCard: React.FC<IncidentCardProps> = ({
  incident,
  onApplyPatch,
  onCreatePR,
}) => {
  const [lang, setLang] = useState<"en" | "uz">("en");
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);
  const [isPatching, setIsPatching] = useState(false);
  const [isCreatingPR, setIsCreatingPR] = useState(false);

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
            SELF-HEALED (LOCAL)
          </span>
        );
      case "PR_CREATED":
        return (
          <span className="flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/50 text-purple-400 font-semibold font-mono">
            <GitPullRequest className="w-3.5 h-3.5" />
            PR DISPATCHED
          </span>
        );
      case "HEALING":
        return (
          <span className="flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 font-semibold font-mono">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            PATCH READY
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 font-semibold font-mono">
            <AlertTriangle className="w-3.5 h-3.5" />
            DETECTED
          </span>
        );
    }
  };

  const handleApplyPatch = async () => {
    setIsPatching(true);
    try {
      await onApplyPatch(incident.id);
    } finally {
      setIsPatching(false);
    }
  };

  const handleCreatePR = async () => {
    setIsCreatingPR(true);
    try {
      await onCreatePR(incident.id);
    } finally {
      setIsCreatingPR(false);
    }
  };

  return (
    <div className="bg-sentinel-surface border border-sentinel-border hover:border-gray-700 transition-all rounded-2xl shadow-xl overflow-hidden mb-6">
      {/* Incident Header */}
      <div className="p-5 border-b border-sentinel-border/70 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#0d1424]">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Severity */}
          <span className={`text-xs px-2.5 py-1 rounded-md border font-mono ${getSeverityBadge(incident.severity)}`}>
            {incident.severity}
          </span>

          {/* Bug Type */}
          <span className="text-xs px-2.5 py-1 rounded-md bg-sentinel-card border border-sentinel-border text-gray-300 font-mono flex items-center gap-1.5">
            <Bug className="w-3.5 h-3.5 text-sentinel-crimson" />
            {incident.bug_type}
          </span>

          {/* Selector */}
          {incident.selector && (
            <span className="text-xs px-2 py-0.5 rounded bg-black/40 border border-gray-800 text-cyan-300 font-mono">
              target: <code className="text-sentinel-cyan font-bold">{incident.selector}</code>
            </span>
          )}
        </div>

        <div>{getStatusBadge(incident.status)}</div>
      </div>

      {/* Incident Body */}
      <div className="p-5 space-y-5">
        {/* Error Trace & Screenshot Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left 2 Cols: Error Message & Trace */}
          <div className="lg:col-span-2 bg-[#080d18] border border-sentinel-border rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase font-mono tracking-wider text-gray-400 mb-1 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-sentinel-crimson" />
                <span>Runtime Exception / Failure Trace</span>
              </div>
              <p className="font-mono text-sm text-red-400 font-semibold break-all">
                {incident.message}
              </p>
              {incident.stack_trace && (
                <pre className="mt-3 text-[11px] font-mono text-gray-400 bg-black/60 p-2.5 rounded-lg border border-gray-800 overflow-x-auto max-h-32">
                  {incident.stack_trace}
                </pre>
              )}
            </div>

            {incident.target_file && (
              <div className="mt-3 pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs font-mono text-gray-400">
                <span>Faulty Source Node:</span>
                <span className="text-sentinel-cyan font-semibold">{incident.target_file}</span>
              </div>
            )}
          </div>

          {/* Right Col: Captured Screenshot */}
          <div className="bg-[#080d18] border border-sentinel-border rounded-xl p-3 flex flex-col justify-between">
            <div className="text-xs uppercase font-mono tracking-wider text-gray-400 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-sentinel-cyan" />
                <span>Viewport Snapshot</span>
              </span>
              {incident.screenshot_url && (
                <button
                  onClick={() => setShowScreenshotModal(true)}
                  className="text-[11px] text-sentinel-cyan hover:underline"
                >
                  Expand
                </button>
              )}
            </div>

            {incident.screenshot_url ? (
              <div
                onClick={() => setShowScreenshotModal(true)}
                className="cursor-pointer group relative rounded-lg overflow-hidden border border-gray-800 h-28 bg-black flex items-center justify-center"
              >
                <img
                  src={incident.screenshot_url}
                  alt="Defect Snapshot"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-medium gap-1">
                  <Eye className="w-4 h-4" /> Click to inspect
                </div>
              </div>
            ) : (
              <div className="h-28 rounded-lg bg-black/40 border border-dashed border-gray-800 flex items-center justify-center text-gray-600 text-xs">
                No screenshot captured
              </div>
            )}
          </div>
        </div>

        {/* AI Root Cause Analysis Section */}
        <div className="bg-gradient-to-r from-sentinel-card to-[#0d1628] border border-sentinel-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-sentinel-cyan/20 border border-sentinel-cyan/40 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-sentinel-cyan" />
              </div>
              <span className="text-xs font-bold font-mono tracking-wider text-white">
                AI ROOT CAUSE DIAGNOSIS
              </span>
            </div>

            {/* Language Switcher Button */}
            <div className="flex items-center bg-[#070b14] border border-sentinel-border rounded-lg p-0.5 text-xs font-mono">
              <button
                onClick={() => setLang("en")}
                className={`px-2 py-0.5 rounded transition-all ${
                  lang === "en" ? "bg-sentinel-cyan text-black font-bold" : "text-gray-400 hover:text-white"
                }`}
              >
                🇬🇧 English
              </button>
              <button
                onClick={() => setLang("uz")}
                className={`px-2 py-0.5 rounded transition-all ${
                  lang === "uz" ? "bg-sentinel-cyan text-black font-bold" : "text-gray-400 hover:text-white"
                }`}
              >
                🇺🇿 O&apos;zbekcha
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-200 leading-relaxed font-sans">
            {lang === "en"
              ? incident.root_cause_en || "AI diagnosis pending analysis."
              : incident.root_cause_uz || "AI tahlili amalga oshirilmoqda."}
          </p>
        </div>

        {/* Code Diff Viewer */}
        {(incident.original_code || incident.fixed_code || incident.diff) && (
          <DiffViewer
            targetFile={incident.target_file}
            originalCode={incident.original_code}
            fixedCode={incident.fixed_code}
            unifiedDiff={incident.diff}
          />
        )}

        {/* 1-Click Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-sentinel-border">
          <div className="text-xs text-gray-400 font-mono">
            {incident.pr_url ? (
              <a
                href={incident.pr_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sentinel-purple hover:underline flex items-center gap-1 font-semibold"
              >
                <GitPullRequest className="w-4 h-4" />
                <span>Pull Request #{incident.pr_number || "Open"} Active</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <span>Ready for autonomous patching or pull request dispatch</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Apply Local Patch to Sandbox */}
            <button
              onClick={handleApplyPatch}
              disabled={isPatching || incident.status === "PATCHED"}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                incident.status === "PATCHED"
                  ? "bg-emerald-950/60 border border-emerald-600/50 text-emerald-400 cursor-default"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white hover:shadow-emerald-500/20"
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              {isPatching
                ? "Applying Patch..."
                : incident.status === "PATCHED"
                ? "✓ Patch Applied to Disk"
                : "Apply Self-Healing Patch Locally"}
            </button>

            {/* Create GitHub PR */}
            <button
              onClick={handleCreatePR}
              disabled={isCreatingPR || !!incident.pr_url}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                incident.pr_url
                  ? "bg-purple-950/60 border border-purple-600/50 text-purple-400 cursor-default"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white hover:shadow-purple-500/20"
              }`}
            >
              <GitPullRequest className="w-3.5 h-3.5" />
              {isCreatingPR
                ? "Creating PR..."
                : incident.pr_url
                ? `PR #${incident.pr_number} Created`
                : "Approve & Create GitHub PR"}
            </button>
          </div>
        </div>
      </div>

      {/* Enlarged Screenshot Modal */}
      {showScreenshotModal && incident.screenshot_url && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowScreenshotModal(false)}
        >
          <div
            className="max-w-4xl w-full bg-[#0d1424] border border-sentinel-border rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-sentinel-border flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-gray-200">
                Viewport Error Snapshot — {incident.selector || incident.bug_type}
              </span>
              <button
                onClick={() => setShowScreenshotModal(false)}
                className="text-gray-400 hover:text-white text-sm px-2 py-1 rounded hover:bg-white/10"
              >
                ✕ Close
              </button>
            </div>
            <div className="p-4 bg-black flex items-center justify-center">
              <img
                src={incident.screenshot_url}
                alt="Enlarged Defect Snapshot"
                className="max-h-[75vh] object-contain rounded-lg border border-gray-800"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
