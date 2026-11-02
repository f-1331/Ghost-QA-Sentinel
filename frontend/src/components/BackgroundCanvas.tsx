// frontend/src/components/BackgroundCanvas.tsx
"use client";

import React, { useEffect, useRef } from "react";

export type BgEffect = "matrix" | "grid" | "particles" | "scanline" | "minimal";

interface BackgroundCanvasProps {
  effect: BgEffect;
  accentColor?: string; // hex or rgb
}

export const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({
  effect,
  accentColor = "#06b6d4"
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (effect === "minimal" || effect === "scanline") {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // ==========================================
    // 1. Matrix Digital Rain
    // ==========================================
    if (effect === "matrix") {
      const chars = "01GHOSTQASENTINEL0123456789ABCDEFλπΩ⚡☠️";
      const fontSize = 14;
      const columns = Math.floor(width / fontSize);
      const drops: number[] = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));

      const drawMatrix = () => {
        ctx.fillStyle = "rgba(5, 8, 14, 0.08)";
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "#10b981"; // Matrix Emerald Green
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
          const text = chars[Math.floor(Math.random() * chars.length)];
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          // Head character glow white
          if (Math.random() > 0.85) {
            ctx.fillStyle = "#a7f3d0";
          } else {
            ctx.fillStyle = "#10b981";
          }

          ctx.fillText(text, x, y);

          if (y > height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
        animationFrameId = requestAnimationFrame(drawMatrix);
      };

      drawMatrix();
    }

    // ==========================================
    // 2. Animated Cyber 3D Grid
    // ==========================================
    else if (effect === "grid") {
      let offset = 0;
      const drawGrid = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#080c14";
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = "rgba(6, 182, 212, 0.12)";
        ctx.lineWidth = 1;

        const gridSize = 45;
        offset = (offset + 0.3) % gridSize;

        // Vertical lines
        for (let x = 0; x <= width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }

        // Horizontal scrolling lines
        for (let y = offset; y <= height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        animationFrameId = requestAnimationFrame(drawGrid);
      };

      drawGrid();
    }

    // ==========================================
    // 3. Ambient Floating Particles
    // ==========================================
    else if (effect === "particles") {
      const particleCount = 45;
      const particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        alpha: Math.random() * 0.5 + 0.2
      }));

      const drawParticles = () => {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(6, 182, 212, ${p.alpha})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = accentColor;
          ctx.fill();
        });

        // Connect nearby particles
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 90) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(6, 182, 212, ${0.15 * (1 - dist / 90)})`;
              ctx.lineWidth = 0.8;
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }

        animationFrameId = requestAnimationFrame(drawParticles);
      };

      drawParticles();
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [effect, accentColor]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {effect !== "minimal" && effect !== "scanline" && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40" />
      )}

      {/* CRT Scanline Overlay if enabled */}
      {effect === "scanline" && (
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))",
            backgroundSize: "100% 3px, 6px 100%"
          }}
        />
      )}

      {/* Ambient Radial Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sentinel-cyan/5 via-transparent to-sentinel-bg/80 pointer-events-none" />
    </div>
  );
};
