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
  ExternalLink
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { StatsCards } from "@/components/StatsCards";
import { TerminalLogs, LogMessage } from "@/components/TerminalLogs";
import { IncidentCard, IncidentData } from "@/components/IncidentCard";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
const WS_URL = BACKEND_URL.replace(/^http/, "ws");

export default function Dashboard() {
  const [targetUrl, setTargetUrl] = useState(`${BACKEND_URL}/sandbox`);
  const [githubRepo, setGithubRepo] = useState("f-1331/Ghost-QA-Sentinel");
  const [scanMode, setScanMode] = useState("CHAOS_MONKEY");
  const [isScanning, setIsScanning] = useState(false);
  const [currentScanId, setCurrentScanId] = useState<string | null>(null);

  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [incidents, setIncidents] = useState<IncidentData[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [systemHealth, setSystemHealth] = useState<any>(null);

  const [totalScans, setTotalScans] = useState(1);
  const [totalBugs, setTotalBugs] = useState(0);
  const [healedBugs, setHealedBugs] = useState(0);
  const [prCount, setPrCount] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);

  // Fetch initial health and past incidents
  useEffect(() => {
    fetchHealth();
    fetchRecentIncidents();
  }, []);

  const fetchHealth = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/health`);
      if (res.ok) {
        const data = await res.json();
        setSystemHealth(data);
      }
    } catch (e) {
      console.warn("Backend not reached yet:", e);
    }
  };

  const fetchRecentIncidents = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/incidents`);
      if (res.ok) {
        const data: IncidentData[] = await res.json();
        setIncidents(data);
        setTotalBugs(data.length);
        setHealedBugs(data.filter((i) => i.status === "PATCHED" || i.status === "HEALING" || i.status === "PR_CREATED").length);
        setPrCount(data.filter((i) => i.status === "PR_CREATED").length);
      }
    } catch (e) {
      console.warn("Could not load past incidents:", e);
    }
  };

  // Launch Autonomous Scan
  const handleStartScan = async (overrideUrl?: string) => {
    const urlToScan = overrideUrl || targetUrl;
    setIsScanning(true);
    setLogs([]);
    
    // Initial UI log
    setLogs([
      {
        level: "INFO",
        message: `Command issued: Initiating Ghost-QA Chaos Crawler on ${urlToScan}`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);

    try {
      const res = await fetch(`${BACKEND_URL}/api/scans/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_url: urlToScan,
          github_repo: githubRepo,
          scan_mode: scanMode,
          max_interactions: 15,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to start scan: ${res.statusText}`);
      }

      const data = await res.json();
      const scanId = data.scan_id;
      setCurrentScanId(scanId);
      setTotalScans((prev) => prev + 1);

      // Connect WebSocket
      connectWebSocket(scanId);
    } catch (err: any) {
      setIsScanning(false);
      setLogs((prev) => [
        ...prev,
        {
          level: "ERROR",
          message: `Initialization error: ${err.message}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }
  };

  const connectWebSocket = (scanId: string) => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(`${WS_URL}/ws/scan/${scanId}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);

        if (payload.type === "LOG") {
          setLogs((prev) => [
            ...prev,
            {
              level: payload.level,
              message: payload.message,
              timestamp: payload.timestamp || new Date().toLocaleTimeString(),
            },
          ]);
        } else if (payload.type === "INCIDENT_DISCOVERED") {
          const newInc: IncidentData = payload.incident;
          setIncidents((prev) => {
            const exists = prev.some((i) => i.id === newInc.id);
            if (exists) return prev;
            return [newInc, ...prev];
          });
          setTotalBugs((prev) => prev + 1);
          setHealedBugs((prev) => prev + 1);
        } else if (payload.type === "SCAN_COMPLETED") {
          setIsScanning(false);
          setLogs((prev) => [
            ...prev,
            {
              level: "SUCCESS",
              message: `Scan pipeline finalized. ${payload.total_bugs} defects intercepted & patched.`,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
          fetchRecentIncidents();
        }
      } catch (e) {
        console.error("WS Parse error:", e);
      }
    };

    ws.onerror = (e) => {
      console.warn("WebSocket error:", e);
    };

    ws.onclose = () => {
      setIsScanning(false);
    };
  };

  // Reset Demo Sandbox Target
  const handleResetSandbox = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/sandbox/reset`, {
        method: "POST",
      });
      if (res.ok) {
        alert("Demo Sandbox successfully reset to original buggy state!");
        setLogs((prev) => [
          ...prev,
          {
            level: "INFO",
            message: "Target sandbox restored to default faulty code. Ready for re-testing.",
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
        fetchRecentIncidents();
      }
    } catch (e: any) {
      alert(`Reset failed: ${e.message}`);
    }
  };

  // Apply Self-Healing Patch Locally
  const handleApplyPatch = async (incidentId: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/incidents/${incidentId}/apply-local-patch`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIncidents((prev) =>
          prev.map((inc) => (inc.id === incidentId ? { ...inc, status: "PATCHED" } : inc))
        );
        setLogs((prev) => [
          ...prev,
          {
            level: "SUCCESS",
            message: `[SELF-HEALED] Patched faulty file \`${data.target_file}\` on disk!`,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      } else {
        alert(data.message || "Could not apply patch.");
      }
    } catch (e: any) {
      alert(`Error applying patch: ${e.message}`);
    }
  };

  // Create GitHub PR
  const handleCreatePR = async (incidentId: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/incidents/${incidentId}/create-pr`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok && data.success) {
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
        setLogs((prev) => [
          ...prev,
          {
            level: "SUCCESS",
            message: `[PR OPENED] Pull Request #${data.pr_number} created: ${data.pr_url}`,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      } else {
        alert("Failed to create PR.");
      }
    } catch (e: any) {
      alert(`Error creating PR: ${e.message}`);
    }
  };

  // Filtered incidents
  const filteredIncidents = incidents.filter((inc) => {
    if (filterSeverity === "ALL") return true;
    if (filterSeverity === "PATCHED") return inc.status === "PATCHED";
    return inc.severity.toUpperCase() === filterSeverity;
  });

  return (
    <div className="min-h-screen bg-sentinel-bg text-gray-100 flex flex-col">
      <Navbar systemHealth={systemHealth} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* Top Analytics Stats */}
        <StatsCards
          totalScans={totalScans}
          totalBugs={totalBugs}
          healedBugs={healedBugs}
          prCount={prCount}
          isScanning={isScanning}
        />

        {/* Chaos Scanner Control Center */}
        <section className="bg-sentinel-surface border border-sentinel-border rounded-2xl p-5 md:p-6 shadow-2xl relative overflow-hidden">
          {/* Subtle Cyberpunk Accent Glow */}
          <div className="absolute top-0 right-0 w-96 h-32 bg-sentinel-cyan/5 blur-3xl pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            {/* Input fields */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Target URL */}
              <div className="md:col-span-2 lg:col-span-1">
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-sentinel-cyan" />
                    Target Application URL
                  </span>
                  <button
                    onClick={() => setTargetUrl(`${BACKEND_URL}/sandbox`)}
                    className="text-[10px] text-sentinel-cyan hover:underline lowercase font-normal"
                  >
                    use demo sandbox
                  </button>
                </label>
                <input
                  type="text"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://example.com or http://localhost:8000/sandbox"
                  className="w-full bg-[#080d18] border border-sentinel-border focus:border-sentinel-cyan rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-gray-600 focus:outline-none transition-colors"
                />
              </div>

              {/* Linked GitHub Repo */}
              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-sentinel-purple" />
                  GitHub Repository
                </label>
                <input
                  type="text"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  placeholder="owner/repository"
                  className="w-full bg-[#080d18] border border-sentinel-border focus:border-sentinel-purple rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-gray-600 focus:outline-none transition-colors"
                />
              </div>

              {/* Scan Mode */}
              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-sentinel-amber" />
                  Chaos Testing Engine
                </label>
                <select
                  value={scanMode}
                  onChange={(e) => setScanMode(e.target.value)}
                  className="w-full bg-[#080d18] border border-sentinel-border focus:border-sentinel-amber rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none transition-colors"
                >
                  <option value="CHAOS_MONKEY">Chaos Monkey (Interactive & Pointer Events)</option>
                  <option value="FULL_AUDIT">Full DOM & Network Penetration</option>
                  <option value="VISUAL_REGRESSION">Visual Layout & Z-Index Check</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Quick Launch on Sandbox */}
              <button
                onClick={() => {
                  setTargetUrl(`${BACKEND_URL}/sandbox`);
                  handleStartScan(`${BACKEND_URL}/sandbox`);
                }}
                disabled={isScanning}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-sentinel-cyan via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-sentinel-cyan/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Agent Crawling...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Launch Chaos Scan</span>
                  </>
                )}
              </button>

              {/* Reset Sandbox */}
              <button
                onClick={handleResetSandbox}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold bg-sentinel-card hover:bg-[#1a233a] border border-sentinel-border text-gray-300 hover:text-white transition-colors"
                title="Restores demo app files to original faulty state"
              >
                <RotateCcw className="w-3.5 h-3.5 text-sentinel-amber" />
                <span>Reset Sandbox</span>
              </button>
            </div>
          </div>
        </section>

        {/* Real-time Telemetry Terminal Logs */}
        <section>
          <TerminalLogs
            logs={logs}
            isScanning={isScanning}
            onClear={() => setLogs([])}
          />
        </section>

        {/* Incidents & Self-Healing Feed */}
        <section className="space-y-4 pt-2">
          {/* Header & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sentinel-border pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-sentinel-crimson" />
              <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                DEFECT INCIDENTS & SELF-HEALING FEED
                <span className="text-xs px-2 py-0.5 rounded-full bg-sentinel-crimson/15 border border-sentinel-crimson/40 text-sentinel-crimson font-mono">
                  {filteredIncidents.length} Detected
                </span>
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <Filter className="w-3.5 h-3.5 text-gray-500 mr-1" />
              {["ALL", "CRITICAL", "HIGH", "PATCHED"].map((level) => (
                <button
                  key={level}
                  onClick={() => setFilterSeverity(level)}
                  className={`px-2.5 py-1 rounded-lg border transition-all ${
                    filterSeverity === level
                      ? "bg-sentinel-cyan/15 border-sentinel-cyan text-sentinel-cyan font-bold"
                      : "bg-sentinel-card border-sentinel-border text-gray-400 hover:text-white"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Incidents List */}
          {filteredIncidents.length === 0 ? (
            <div className="bg-sentinel-surface border border-sentinel-border rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-sentinel-emerald">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">System Fully Healthy</h3>
              <p className="text-xs text-gray-400 max-w-md">
                No active defects match the current filter. Launch a chaos scan against the built-in sandbox or enter a custom target to test.
              </p>
              <button
                onClick={() => handleStartScan(`${BACKEND_URL}/sandbox`)}
                className="mt-2 px-4 py-2 rounded-xl bg-sentinel-card hover:bg-sentinel-border text-xs font-mono text-sentinel-cyan border border-sentinel-cyan/30"
              >
                Scan Built-in Demo App →
              </button>
            </div>
          ) : (
            filteredIncidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                onApplyPatch={handleApplyPatch}
                onCreatePR={handleCreatePR}
              />
            ))
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-sentinel-border bg-[#060a12] py-4 px-6 text-center text-xs font-mono text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Ghost-QA Sentinel Platform © 2026. Built with FastAPI, Playwright & Google Gemini AI.</span>
          <div className="flex items-center gap-4 text-gray-400">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sentinel-emerald"></span>
              Autonomous Agent Guard: ACTIVE
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
