"use client";

import { useEffect, useRef } from "react";

export default function HeroEcgCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let started = false;
    let width  = (canvas.width  = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width  = canvas.width  = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Pre-load doctor image
    const doctor = new Image();
    doctor.src = "/doctor_2.png";

    // ECG profile
    const ecg = [
      0, 0, 0, 0.02, 0.06, 0.04, 0,
      -0.08, -0.20, 1.0, -0.35, -0.08,
      0.05, 0.18, 0.22, 0.18, 0.05, 0, 0, 0, 0, 0,
    ];
    const ecgLen = ecg.length;

    let time    = 0;
    let pulse1X = 0;
    let pulse2X = -width * 0.55;

    const drawEcgLine = (
      pulseX: number, baseY: number,
      glowColor: string, coreColor: string,
      spike: number, speed: number
    ) => {
      ctx.beginPath();
      ctx.strokeStyle = glowColor;
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (let x = 0; x <= width; x += 3) {
        let y = baseY + Math.sin(x * 0.006 + time * speed) * 5;
        const d = x - (pulseX - 160);
        if (d > 0 && d < 200) {
          const t = d / 200;
          const i = Math.floor(t * (ecgLen - 1));
          const f = t * (ecgLen - 1) - i;
          y -= (ecg[i] * (1 - f) + (ecg[i + 1] ?? 0) * f) * spike;
        }
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = coreColor;
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 22;
      ctx.shadowColor = coreColor;
      for (let x = 0; x <= width; x += 2) {
        let y = baseY + Math.sin(x * 0.006 + time * speed) * 5;
        const d = x - (pulseX - 160);
        if (d > 0 && d < 200) {
          const t = d / 200;
          const i = Math.floor(t * (ecgLen - 1));
          const f = t * (ecgLen - 1) - i;
          y -= (ecg[i] * (1 - f) + (ecg[i + 1] ?? 0) * f) * spike;
        }
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // ── Doctor image rendered directly on canvas ───────────────────────────
      if (doctor.complete && doctor.naturalWidth > 0) {
        const imgH = height * 0.92;
        const imgW = (doctor.naturalWidth / doctor.naturalHeight) * imgH;
        const imgX = width - imgW * 0.85;
        const imgY = height - imgH;

        // Teal ambient glow behind doctor
        const halo = ctx.createRadialGradient(
          imgX + imgW * 0.45, imgY + imgH * 0.3, imgH * 0.05,
          imgX + imgW * 0.45, imgY + imgH * 0.3, imgH * 0.52
        );
        halo.addColorStop(0, "rgba(0,175,160,0.15)");
        halo.addColorStop(1, "transparent");
        ctx.fillStyle = halo;
        ctx.fillRect(imgX - imgW * 0.15, imgY, imgW * 1.3, imgH);

        // Draw the doctor
        ctx.drawImage(doctor, imgX, imgY, imgW, imgH);

        // Bottom fade — feet blend into background
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        const fadeH = imgH * 0.18;
        const bFade = ctx.createLinearGradient(0, height - fadeH, 0, height + 2);
        bFade.addColorStop(0, "rgba(0,0,0,0)");
        bFade.addColorStop(1, "rgba(0,0,0,1)");
        ctx.fillStyle = bFade;
        ctx.fillRect(imgX - 10, height - fadeH, imgW + 20, fadeH + 4);
        ctx.restore();

        // Right-edge fade — blends with screen edge
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        const rFade = ctx.createLinearGradient(width - imgW * 0.1, 0, width + 2, 0);
        rFade.addColorStop(0, "rgba(0,0,0,0)");
        rFade.addColorStop(1, "rgba(0,0,0,0.75)");
        ctx.fillStyle = rFade;
        ctx.fillRect(width - imgW * 0.1, imgY, imgW * 0.15, imgH);
        ctx.restore();
      }

      // ── ECG lines sweep across (in front of doctor) ────────────────────────
      drawEcgLine(pulse1X, height * 0.40, "rgba(0,200,180,0.10)", "rgba(0,230,200,0.90)", 70, 0.42);
      drawEcgLine(pulse2X, height * 0.64, "rgba(245,158,11,0.10)", "rgba(255,195,55,0.82)", 52, -0.28);

      time    += 0.005;
      pulse1X  = (pulse1X + 2.2) % (width + 300);
      pulse2X  = (pulse2X + 1.7) % (width + 300);

      animId = requestAnimationFrame(draw);
    };

    // Single entry point — start only once
    const start = () => {
      if (started) return;
      started = true;
      draw();
    };

    if (doctor.complete && doctor.naturalWidth > 0) {
      start();
    } else {
      doctor.onload  = start;
      doctor.onerror = start; // start even if image fails to load
      // Begin immediately so ECG lines appear right away
      start();
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 2,
        pointerEvents: "none",
      }}
    />
  );
}
