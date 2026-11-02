"use client";

import React from "react";
import { Bug, Sparkles, GitPullRequest, Activity } from "lucide-react";

interface StatsProps {
  totalScans: number;
  totalBugs: number;
  healedBugs: number;
  prCount: number;
  isScanning: boolean;
}

export const StatsCards: React.FC<StatsProps> = ({
  totalScans,
  totalBugs,
  healedBugs,
  prCount,
  isScanning,
}) => {
  const healRate = totalBugs > 0 ? Math.round((healedBugs / totalBugs) * 100) : 100;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {/* Total Scans */}
      <div className="bg-sentinel-surface border border-sentinel-border rounded-xl p-4 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-gray-400">Chaos Scans</span>
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-white font-mono">{totalScans}</div>
        <div className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${isScanning ? "bg-sentinel-amber animate-ping" : "bg-sentinel-emerald"}`}></span>
          {isScanning ? "Crawler active..." : "Engine idle"}
        </div>
      </div>

      {/* Discovered Bugs */}
      <div className="bg-sentinel-surface border border-sentinel-border rounded-xl p-4 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-gray-400">Defects Found</span>
          <div className="p-2 rounded-lg bg-crimson-500/10 text-sentinel-crimson">
            <Bug className="w-4 h-4 text-sentinel-crimson" />
          </div>
        </div>
        <div className="text-2xl font-bold text-sentinel-crimson font-mono">{totalBugs}</div>
        <div className="text-xs text-gray-400 mt-1">Console, DOM & Network crashes</div>
      </div>

      {/* Self-Healed */}
      <div className="bg-sentinel-surface border border-sentinel-border rounded-xl p-4 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-gray-400">AI Self-Healed</span>
          <div className="p-2 rounded-lg bg-emerald-500/10 text-sentinel-emerald">
            <Sparkles className="w-4 h-4 text-sentinel-emerald" />
          </div>
        </div>
        <div className="text-2xl font-bold text-sentinel-emerald font-mono">{healedBugs}</div>
        <div className="text-xs text-gray-400 mt-1">{healRate}% resolution success</div>
      </div>

      {/* PRs Created */}
      <div className="bg-sentinel-surface border border-sentinel-border rounded-xl p-4 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-gray-400">Pull Requests</span>
          <div className="p-2 rounded-lg bg-purple-500/10 text-sentinel-purple">
            <GitPullRequest className="w-4 h-4 text-purple-400" />
          </div>
        </div>
        <div className="text-2xl font-bold text-purple-400 font-mono">{prCount}</div>
        <div className="text-xs text-gray-400 mt-1">Autonomous git branches</div>
      </div>
    </div>
  );
};
