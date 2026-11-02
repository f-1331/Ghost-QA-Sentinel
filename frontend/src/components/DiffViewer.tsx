"use client";

import React, { useState } from "react";
import { Check, Copy, FileCode } from "lucide-react";

interface DiffViewerProps {
  targetFile?: string;
  originalCode?: string;
  fixedCode?: string;
  unifiedDiff?: string;
  diff?: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  targetFile = "target_code.js",
  originalCode = "",
  fixedCode = "",
  unifiedDiff = "",
  diff = "",
}) => {
  const activeDiff = unifiedDiff || diff;
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<"side-by-side" | "patch">("side-by-side");

  const handleCopy = () => {
    navigator.clipboard.writeText(activeDiff || `${originalCode}\n-->\n${fixedCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0b101b] border border-sentinel-border rounded-xl overflow-hidden font-mono text-xs shadow-inner">
      {/* Header bar */}
      <div className="bg-[#0f172a] px-4 py-2 border-b border-sentinel-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-300">
          <FileCode className="w-4 h-4 text-sentinel-cyan" />
          <span className="font-semibold text-sentinel-cyan">{targetFile}</span>
          <span className="text-gray-500 text-[10px]">Ghost-QA Unified Patch</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle View Mode */}
          <div className="bg-[#080c14] rounded-lg p-0.5 border border-sentinel-border flex text-[10px]">
            <button
              onClick={() => setMode("side-by-side")}
              className={`px-2 py-0.5 rounded ${mode === "side-by-side" ? "bg-sentinel-card text-white font-bold" : "text-gray-400"}`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setMode("patch")}
              className={`px-2 py-0.5 rounded ${mode === "patch" ? "bg-sentinel-card text-white font-bold" : "text-gray-400"}`}
            >
              Unified Diff
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-sentinel-card hover:bg-sentinel-border text-gray-300 hover:text-white transition-colors text-[11px]"
          >
            {copied ? <Check className="w-3 h-3 text-sentinel-emerald" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Content */}
      {mode === "side-by-side" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-sentinel-border max-h-72 overflow-y-auto">
          {/* Left: Original Buggy Code */}
          <div className="p-3 bg-red-950/20">
            <div className="text-[10px] uppercase font-bold text-red-400 pb-1 mb-2 border-b border-red-900/40 flex items-center gap-1">
              <span>🔴 Faulty Original Code</span>
            </div>
            <pre className="text-red-300 whitespace-pre-wrap leading-relaxed">
              <code>{originalCode || "/* No original snippet extracted */"}</code>
            </pre>
          </div>

          {/* Right: Healed Fixed Code */}
          <div className="p-3 bg-emerald-950/20">
            <div className="text-[10px] uppercase font-bold text-emerald-400 pb-1 mb-2 border-b border-emerald-900/40 flex items-center gap-1">
              <span>🟢 AI Self-Healed Patch</span>
            </div>
            <pre className="text-emerald-300 whitespace-pre-wrap leading-relaxed">
              <code>{fixedCode || "/* No fix code generated */"}</code>
            </pre>
          </div>
        </div>
      ) : (
        <div className="p-3 max-h-72 overflow-y-auto bg-black/40">
          <pre className="whitespace-pre-wrap leading-relaxed">
            {activeDiff ? (
              activeDiff.split("\n").map((line, idx) => {
                const isAdd = line.startsWith("+") && !line.startsWith("+++");
                const isDel = line.startsWith("-") && !line.startsWith("---");
                const isHeader = line.startsWith("@@") || line.startsWith("---") || line.startsWith("+++");

                return (
                  <div
                    key={idx}
                    className={`px-2 py-0.5 ${
                      isAdd
                        ? "bg-emerald-950/50 text-emerald-300 font-medium"
                        : isDel
                        ? "bg-red-950/50 text-red-300 font-medium"
                        : isHeader
                        ? "text-cyan-400 font-bold bg-cyan-950/20"
                        : "text-gray-400"
                    }`}
                  >
                    {line}
                  </div>
                );
              })
            ) : (
              <div className="text-gray-500 italic">No unified diff available</div>
            )}
          </pre>
        </div>
      )}
    </div>
  );
};
