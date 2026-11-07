// frontend/src/components/LiveDomMatrixVisualizer.tsx
// Cyberpunk Action Canvas: Visualizing DOM Tree nodes, Red-Team laser packets & real-time telemetry
"use client";

import React, { useRef, useEffect, useState } from "react";
import { 
  Layers, 
  Activity, 
  Radio, 
  Zap, 
  Maximize2, 
  RotateCcw, 
  Eye, 
  Terminal,
  ShieldCheck,
  ShieldAlert
} from "lucide-react";
import { Language } from "./i18n";
import { soundFX } from "./SoundEffects";

interface LiveDomMatrixVisualizerProps {
  isScanning: boolean;
  lang: Language;
  targetUrl: string;
}

interface CanvasNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  tag: string;
  selector: string;
  status: "NORMAL" | "TESTING" | "CRASHED" | "HEALED";
  color: string;
  energy: number;
}

interface AttackPacket {
  startX: number;
  startY: number;
  curX: number;
  curY: number;
  targetNodeIndex: number;
  speed: number;
  color: string;
  type: string;
}

export const LiveDomMatrixVisualizer: React.FC<LiveDomMatrixVisualizerProps> = ({
  isScanning,
  lang,
  targetUrl
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<CanvasNode | null>(null);
  const [nodesTested, setNodesTested] = useState(142);
  const [fps, setFps] = useState(60);
  const [activePacketsCount, setActivePacketsCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;

    // Resize canvas
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio || 800;
      canvas.height = 260 * window.devicePixelRatio || 260;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const width = canvas.getBoundingClientRect().width || 800;
    const height = 260;

    // Generate initial DOM simulation nodes
    const sampleTags = [
      { tag: "body", selector: "body" },
      { tag: "header", selector: "header.site-header" },
      { tag: "nav", selector: "nav#main-nav" },
      { tag: "h1", selector: "h1.hero-title" },
      { tag: "button", selector: "button#checkout-btn" },
      { tag: "button", selector: "button#sync-inventory-btn" },
      { tag: "div", selector: "div#ghost-blocker-overlay" },
      { tag: "form", selector: "form#payment-form" },
      { tag: "input", selector: "input#card-number" },
      { tag: "span", selector: "span.tax-badge" },
      { tag: "section", selector: "section#pricing" },
      { tag: "footer", selector: "footer.site-footer" },
      { tag: "img", selector: "img.hero-banner" },
      { tag: "a", selector: "a.cta-link" },
      { tag: "div", selector: "div.cart-container" }
    ];

    const nodes: CanvasNode[] = sampleTags.map((item, idx) => ({
      x: 60 + ((idx * (width - 120)) / sampleTags.length) + (Math.random() * 20 - 10),
      y: 60 + Math.sin(idx * 0.8) * 60 + Math.random() * 40,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: item.tag === "button" || item.tag === "h1" ? 14 : item.tag === "div" ? 11 : 8,
      tag: item.tag,
      selector: item.selector,
      status: item.selector.includes("checkout") || item.selector.includes("overlay") ? "CRASHED" : "NORMAL",
      color: item.selector.includes("checkout") ? "#f43f5e" : item.selector.includes("overlay") ? "#e11d48" : "#06b6d4",
      energy: 1.0
    }));

    const packets: AttackPacket[] = [];

    // Animation Loop
    const render = (time: number) => {
      frameCount++;
      if (time - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = time;
      }

      ctx.clearRect(0, 0, width, height);

      // Draw subtle cyber grid
      ctx.strokeStyle = "rgba(14, 165, 233, 0.05)";
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw connecting DOM branches
      ctx.strokeStyle = "rgba(6, 182, 212, 0.15)";
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Randomly spawn attack laser packets during scanning
      if (isScanning && Math.random() < 0.15 && packets.length < 12) {
        const targetIdx = Math.floor(Math.random() * nodes.length);
        packets.push({
          startX: 20,
          startY: 20 + Math.random() * (height - 40),
          curX: 20,
          curY: 20 + Math.random() * (height - 40),
          targetNodeIndex: targetIdx,
          speed: 4 + Math.random() * 3,
          color: Math.random() > 0.5 ? "#f43f5e" : "#06b6d4",
          type: Math.random() > 0.5 ? "XSS_PROBE" : "Z_INDEX_CLICK"
        });
      }

      // Draw and update laser packets
      for (let p = packets.length - 1; p >= 0; p--) {
        const packet = packets[p];
        const target = nodes[packet.targetNodeIndex];
        const dx = target.x - packet.curX;
        const dy = target.y - packet.curY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < packet.speed) {
          // Packet arrived
          target.energy = 2.0;
          packets.splice(p, 1);
        } else {
          packet.curX += (dx / dist) * packet.speed;
          packet.curY += (dy / dist) * packet.speed;

          // Draw packet laser beam
          ctx.beginPath();
          ctx.arc(packet.curX, packet.curY, 3, 0, Math.PI * 2);
          ctx.fillStyle = packet.color;
          ctx.shadowColor = packet.color;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      setActivePacketsCount(packets.length);

      // Draw and update DOM Nodes
      nodes.forEach((node, i) => {
        // Subtle drift movement
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 30 || node.x > width - 30) node.vx *= -1;
        if (node.y < 30 || node.y > height - 30) node.vy *= -1;

        // Energy decay back to 1.0
        if (node.energy > 1.0) {
          node.energy -= 0.03;
        }

        // Draw pulsing outer halo for crashed or tested nodes
        const isCrashed = node.status === "CRASHED";
        const baseColor = isCrashed ? "#f43f5e" : "#06b6d4";

        ctx.beginPath();
        ctx.arc(node.x, node.y, (node.radius + 4) * node.energy, 0, Math.PI * 2);
        ctx.fillStyle = isCrashed ? "rgba(244, 63, 94, 0.15)" : "rgba(6, 182, 212, 0.1)";
        ctx.fill();

        // Node center circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = baseColor;
        ctx.shadowColor = baseColor;
        ctx.shadowBlur = isCrashed ? 12 : 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw tag text label
        ctx.font = "10px monospace";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`<${node.tag}>`, node.x, node.y - node.radius - 8);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isScanning]);

  return (
    <section className="bg-[#060a12] border border-sentinel-border rounded-2xl p-4 md:p-5 shadow-2xl relative overflow-hidden">
      {/* Visualizer Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sentinel-border/70">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sentinel-cyan/15 border border-sentinel-cyan/30 text-sentinel-cyan">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs md:text-sm font-bold text-white font-mono uppercase tracking-wider">
                {lang === "uz" ? "Jonli DOM & Red-Team Hujum Vizualizatori" : "Live DOM & Red-Team Attack Canvas"}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-mono font-bold">
                60 FPS HUD
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-sans mt-0.5">
              {lang === "uz"
                ? "Sayt DOM daraxti tugunlari, lazer hujum paketlari va xatoliklar qatlamining jonli renderi."
                : "Real-time render of DOM node tree, penetration packets, and obstructed z-index collision layers."}
            </p>
          </div>
        </div>

        {/* HUD Quick Stats */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-2.5 py-1 rounded-lg bg-black/50 border border-white/10 text-gray-300">
            FPS: <span className="text-emerald-400 font-bold">{fps}</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-black/50 border border-white/10 text-gray-300">
            Nodes: <span className="text-sentinel-cyan font-bold">{nodesTested}</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-black/50 border border-white/10 text-gray-300">
            Packets: <span className="text-rose-400 font-bold">{activePacketsCount}</span>
          </div>
        </div>
      </div>

      {/* Cyber Canvas Element */}
      <div className="relative mt-3 rounded-xl overflow-hidden border border-sentinel-border/60 bg-[#04070d]">
        <canvas
          ref={canvasRef}
          className="w-full h-[220px] md:h-[260px] block cursor-crosshair"
        />

        {/* HUD Overlay Indicators */}
        <div className="absolute top-2 left-2 pointer-events-none flex items-center gap-2 text-[10px] font-mono text-gray-400 bg-black/70 px-2.5 py-1 rounded-md border border-white/10">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>CYBER-HUD: INTERACTIVE DOM PROBE</span>
        </div>

        <div className="absolute bottom-2 right-2 pointer-events-none flex items-center gap-3 text-[10px] font-mono bg-black/70 px-2.5 py-1 rounded-md border border-white/10">
          <span className="flex items-center gap-1 text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400" /> Sog'lom Tugun
          </span>
          <span className="flex items-center gap-1 text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> To'qnashuv / Xato
          </span>
        </div>
      </div>
    </section>
  );
};
