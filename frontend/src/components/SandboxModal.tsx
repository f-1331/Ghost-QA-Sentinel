"use client";

import React, { useState } from "react";
import { X, Play, RefreshCw, ShoppingCart, AlertCircle, ShieldCheck } from "lucide-react";

interface SandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBugTriggered?: (bugName: string) => void;
  backendUrl?: string;
}

export const SandboxModal: React.FC<SandboxModalProps> = ({
  isOpen,
  onClose,
  onBugTriggered,
  backendUrl,
}) => {
  const [logs, setLogs] = useState<string[]>([
    "[CyberMart] Sandbox initialized. Ready for interactive testing."
  ]);
  const [cartPatched, setCartPatched] = useState(false);
  const [overlayRemoved, setOverlayRemoved] = useState(false);

  if (!isOpen) return null;

  const addLog = (msg: string) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 15)]);
  };

  const handleCheckout = () => {
    if (cartPatched) {
      addLog("✅ Checkout successful! Total: $1,649.00 (Self-Healed logic applied)");
      alert("✅ Order Placed Successfully! Total: $1,649.00 (Healed)");
    } else {
      addLog("💥 UNCAUGHT EXCEPTION: TypeError: Cannot read properties of undefined (reading 'calculateGrandTotal')");
      if (onBugTriggered) onBugTriggered("TypeError on #checkout-btn");
      alert("💥 Uncaught TypeError: Cannot read properties of undefined (reading 'calculateGrandTotal')");
    }
  };

  const handleSync = async () => {
    addLog("🌐 POST /api/broken/inventory-sync request dispatched...");
    setTimeout(() => {
      addLog("💥 HTTP 500: DatabaseConnectionTimeoutException: Failed to acquire pool lock on replica cluster");
      if (onBugTriggered) onBugTriggered("HTTP 500 on #sync-inventory-btn");
      alert("💥 HTTP 500: Internal Server Error (DatabaseConnectionTimeoutException)");
    }, 400);
  };

  const handleVoucher = () => {
    if (overlayRemoved) {
      addLog("🎁 VIP 50% Voucher Unlocked! Coupon applied to cart.");
      alert("🎉 50% VIP Coupon Claimed!");
    } else {
      addLog("⚠️ CLICK INTERCEPTED: Element obstructed by #ghost-blocker-overlay (pointer-events: auto)");
      if (onBugTriggered) onBugTriggered("LAYOUT_BLOCK on #claim-voucher-btn");
      alert("⚠️ Button not clickable! Obstructed by invisible #ghost-blocker-overlay layer.");
    }
  };

  const handleTax = () => {
    addLog("💥 UNCAUGHT EXCEPTION: TypeError: Cannot read properties of null (reading 'rate') in computeTax(null)");
    if (onBugTriggered) onBugTriggered("Null Dereference in computeTax()");
    alert("💥 TypeError: Cannot read properties of null (reading 'rate')");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="max-w-3xl w-full bg-[#0a0f1d] border border-sentinel-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#0f172a] border-b border-sentinel-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sentinel-crimson animate-ping"></span>
            <span className="font-mono text-sm font-bold text-white tracking-wider">
              CYBERMART TARGET SANDBOX (INTERACTIVE TESTBENCH)
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sandbox Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 text-xs text-blue-200 flex items-center justify-between">
            <span>
              ℹ️ Click any button below to trigger live runtime defects. Notice how Playwright catches these in real-time!
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setCartPatched(!cartPatched);
                  addLog(cartPatched ? "Reverted checkout bug" : "Applied AI patch to checkout logic");
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold border transition-colors ${
                  cartPatched ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-sentinel-card border-gray-700 text-gray-300"
                }`}
              >
                {cartPatched ? "✓ Checkout Patched" : "Toggle Checkout Patch"}
              </button>
              <button
                onClick={() => {
                  setOverlayRemoved(!overlayRemoved);
                  addLog(overlayRemoved ? "Re-applied z-index blocker" : "Removed #ghost-blocker-overlay");
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold border transition-colors ${
                  overlayRemoved ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-sentinel-card border-gray-700 text-gray-300"
                }`}
              >
                {overlayRemoved ? "✓ Overlay Removed" : "Toggle Overlay Patch"}
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Bug 1 */}
            <div className="bg-[#111928] border border-sentinel-border rounded-xl p-4 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-white mb-1">Shopping Cart</h4>
                <p className="text-xs text-gray-400 mb-3">Quantum Cyberdeck + Neural Token ($1,649.00)</p>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all active:scale-95"
              >
                Proceed to Checkout (Bug 1)
              </button>
            </div>

            {/* Bug 2 */}
            <div className="bg-[#111928] border border-sentinel-border rounded-xl p-4 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-white mb-1">Live Inventory</h4>
                <p className="text-xs text-gray-400 mb-3">Sync stock levels across regional nodes.</p>
              </div>
              <button
                onClick={handleSync}
                className="w-full py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-md transition-all active:scale-95"
              >
                Sync Stock (500 Error)
              </button>
            </div>

            {/* Bug 4 */}
            <div className="bg-[#111928] border border-sentinel-border rounded-xl p-4 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-white mb-1">Tax Estimator</h4>
                <p className="text-xs text-gray-400 mb-3">Calculates regional sales tax rate.</p>
              </div>
              <button
                onClick={handleTax}
                className="w-full py-2 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-md transition-all active:scale-95"
              >
                Calculate Tax (Null Rate)
              </button>
            </div>
          </div>

          {/* Bug 3 Voucher */}
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-purple-300">Flash Promotion: VIP Cyber Week</h4>
              <p className="text-xs text-purple-200/70">Claim an instant 50% discount voucher.</p>
            </div>
            <button
              onClick={handleVoucher}
              className="py-2 px-4 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-xs shadow-md hover:from-emerald-500 hover:to-teal-500"
            >
              Claim 50% Voucher (Bug 3)
            </button>
          </div>

          {/* Sandbox Live Console */}
          <div className="bg-black/80 border border-sentinel-border rounded-xl p-3 font-mono text-xs">
            <div className="text-[11px] text-sentinel-cyan uppercase tracking-wider mb-2 font-bold">
              Console Output Monitor
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {logs.map((log, idx) => (
                <div key={idx} className={log.includes("💥") ? "text-red-400" : log.includes("⚠️") ? "text-amber-400" : "text-gray-300"}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
