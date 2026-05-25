"use client";

import { useEffect, useRef } from "react";

export default function VitalWaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, radius: 180 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width  = (canvas.width  = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Color tokens
    let primaryHslStr = "180, 75%, 28%";
    let secondaryHslStr = "32, 95%, 45%";

    const getHsla = (hslStr: string, alpha: number) => {
      return `hsla(${hslStr}, ${alpha})`;
    };

    const updateColors = () => {
      const s = getComputedStyle(document.body);
      const p = s.getPropertyValue("--primary-hsl").trim();
      const sec = s.getPropertyValue("--secondary-hsl").trim();
      if (p) primaryHslStr = p;
      if (sec) secondaryHslStr = sec;
    };
    updateColors();

    const observer = new MutationObserver(updateColors);
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-theme", "class"] });

    const handleResize = () => {
      if (!canvas) return;
      width  = canvas.width  = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // 3D DNA parameters
    const focalLength = 300;

    interface NodePair {
      localY: number;
      angleOffset: number;
      // Dispersed random offsets
      dispAX: number;
      dispAY: number;
      dispAZ: number;
      dispBX: number;
      dispBY: number;
      dispBZ: number;
    }

    interface Helix {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      length: number;
      tilt: number;
      speed: number;
      state: "assembling" | "coiled" | "unzipping" | "dispersed";
      stateTimer: number;
      stateDuration: number;
      pairs: NodePair[];
      primary: boolean;
    }

    const helices: Helix[] = [];
    const helixCount = 5; // 5 floating desynchronized helices

    // Initialize Helices with desynchronized starting states
    const states: Array<Helix["state"]> = ["assembling", "coiled", "unzipping", "dispersed"];
    const durations = {
      assembling: 160,
      coiled: 260,
      unzipping: 160,
      dispersed: 100,
    };

    for (let h = 0; h < helixCount; h++) {
      const radius = Math.random() * 15 + 13; // 13px - 28px
      const length = Math.random() * 80 + 90; // 90px - 170px
      const pairCount = Math.floor(Math.random() * 5) + 12; // 12 to 16 pairs
      const spacing = Math.random() * 0.08 + 0.14;

      const pairs: NodePair[] = [];
      for (let i = 0; i < pairCount; i++) {
        // Dispersed coordinates: spread nodes wide when DNA is dissolved
        const dispSpread = radius * 4.5;
        pairs.push({
          localY: (i / (pairCount - 1)) * length - length / 2,
          angleOffset: i * spacing,
          dispAX: (Math.random() - 0.5) * dispSpread,
          dispAY: (Math.random() - 0.5) * dispSpread - 20,
          dispAZ: (Math.random() - 0.5) * dispSpread,
          dispBX: (Math.random() - 0.5) * dispSpread,
          dispBY: (Math.random() - 0.5) * dispSpread + 20,
          dispBZ: (Math.random() - 0.5) * dispSpread,
        });
      }

      // Pick a random starting state and phase
      const startState = states[h % states.length];
      const startDuration = durations[startState];

      helices.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.26,
        vy: (Math.random() - 0.5) * 0.26,
        radius,
        length,
        tilt: (Math.random() - 0.5) * (Math.PI / 2.2), // orientation
        speed: (Math.random() * 0.012 + 0.008) * (Math.random() > 0.5 ? 1 : -1),
        state: startState,
        stateTimer: Math.floor(Math.random() * startDuration * 0.8), // desynchronize start frames
        stateDuration: startDuration,
        pairs,
        primary: h % 2 === 0,
      });
    }

    let time = 0;

    // Helper for 3D perspective projection
    const project = (x: number, y: number, z: number, hX: number, hY: number) => {
      const scale = focalLength / (focalLength + z);
      return {
        x: hX + x * scale,
        y: hY + y * scale,
        scale: scale,
      };
    };

    /* ─── animation loop ─────────────────────────────────────────────────── */
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Morphing Ambient Background Glows
      const glow1X = width * 0.25 + Math.sin(time * 0.003) * (width * 0.15);
      const glow1Y = height * 0.35 + Math.cos(time * 0.002) * (height * 0.15);
      const glow1R = Math.min(width, height) * 0.7;

      const g1 = ctx.createRadialGradient(glow1X, glow1Y, 10, glow1X, glow1Y, glow1R);
      g1.addColorStop(0, getHsla(primaryHslStr, 0.08));
      g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1;
      ctx.beginPath();
      ctx.arc(glow1X, glow1Y, glow1R, 0, Math.PI * 2);
      ctx.fill();

      const glow2X = width * 0.75 + Math.cos(time * 0.0025) * (width * 0.15);
      const glow2Y = height * 0.65 + Math.sin(time * 0.0035) * (height * 0.15);
      const glow2R = Math.min(width, height) * 0.65;

      const g2 = ctx.createRadialGradient(glow2X, glow2Y, 10, glow2X, glow2Y, glow2R);
      g2.addColorStop(0, getHsla(secondaryHslStr, 0.05));
      g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2;
      ctx.beginPath();
      ctx.arc(glow2X, glow2Y, glow2R, 0, Math.PI * 2);
      ctx.fill();

      // 2. Prepare Render Queue for all DNA components combined
      const renderQueue: Array<
        | { type: "node"; x: number; y: number; z: number; size: number; colorStr: string }
        | { type: "line"; x1: number; y1: number; x2: number; y2: number; z: number; colorStr: string }
      > = [];

      helices.forEach((h) => {
        // Slow float drift
        h.x += h.vx;
        h.y += h.vy;

        // Wrap boundaries
        const boundaryPadding = h.length * 1.5;
        if (h.x < -boundaryPadding) h.x = width + boundaryPadding;
        if (h.x > width + boundaryPadding) h.x = -boundaryPadding;
        if (h.y < -boundaryPadding) h.y = height + boundaryPadding;
        if (h.y > height + boundaryPadding) h.y = -boundaryPadding;

        // Cursor repulsion
        const dx = h.x - mouseRef.current.x;
        const dy = h.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseRef.current.radius) {
          const force = (mouseRef.current.radius - dist) / mouseRef.current.radius;
          h.x += (dx / dist) * force * 1.8;
          h.y += (dy / dist) * force * 1.8;
        }

        // State Machine Progress (0.0 to 1.0)
        h.stateTimer++;
        if (h.stateTimer >= h.stateDuration) {
          h.stateTimer = 0;
          if (h.state === "assembling") {
            h.state = "coiled";
            h.stateDuration = durations.coiled;
          } else if (h.state === "coiled") {
            h.state = "unzipping";
            h.stateDuration = durations.unzipping;
          } else if (h.state === "unzipping") {
            h.state = "dispersed";
            h.stateDuration = durations.dispersed;
          } else {
            h.state = "assembling";
            h.stateDuration = durations.assembling;
          }
        }

        const t = h.stateTimer / h.stateDuration;

        // Generate Node Positions based on current state
        h.pairs.forEach((pair) => {
          // 3D coordinates for neat coiled state
          const angleA = pair.angleOffset + time * h.speed;
          const angleB = angleA + Math.PI;

          const coilXA = Math.sin(angleA) * h.radius;
          const coilYA = pair.localY;
          const coilZA = Math.cos(angleA) * h.radius;

          const coilXB = Math.sin(angleB) * h.radius;
          const coilYB = pair.localY;
          const coilZB = Math.cos(angleB) * h.radius;

          let x3dA = 0, y3dA = 0, z3dA = 0;
          let x3dB = 0, y3dB = 0, z3dB = 0;
          let lineAlpha = 0;

          if (h.state === "coiled") {
            x3dA = coilXA; y3dA = coilYA; z3dA = coilZA;
            x3dB = coilXB; y3dB = coilYB; z3dB = coilZB;
            lineAlpha = 0.40;
          } 
          else if (h.state === "unzipping") {
            // Strands slide laterally away from the center axis
            const separation = h.radius * t * 2.2;
            x3dA = coilXA + separation; y3dA = coilYA; z3dA = coilZA;
            x3dB = coilXB - separation; y3dB = coilYB; z3dB = coilZB;
            // Base-pairs unbind and connection lines fade out
            lineAlpha = Math.max(0, (1 - t * 1.5) * 0.40);
          } 
          else if (h.state === "dispersed") {
            // Nucleotides float dispersed randomly
            x3dA = pair.dispAX; y3dA = pair.dispAY; z3dA = pair.dispAZ;
            x3dB = pair.dispBX; y3dB = pair.dispBY; z3dB = pair.dispBZ;
            lineAlpha = 0;
          } 
          else if (h.state === "assembling") {
            // Nucleotides migrate back to helical positions
            // LERP from dispersed offset back to clean coiled helix coordinates
            const ease = t * t * (3 - 2 * t); // smooth cubic easing
            x3dA = pair.dispAX + (coilXA - pair.dispAX) * ease;
            y3dA = pair.dispAY + (coilYA - pair.dispAY) * ease;
            z3dA = pair.dispAZ + (coilZA - pair.dispAZ) * ease;

            x3dB = pair.dispBX + (coilXB - pair.dispBX) * ease;
            y3dB = pair.dispBY + (coilYB - pair.dispBY) * ease;
            z3dB = pair.dispBZ + (coilZB - pair.dispBZ) * ease;

            // Connection lines fade back in as they bind
            lineAlpha = ease * 0.40;
          }

          // Apply tilt angle (rotation around Z axis in 2D space)
          const rotXA = x3dA * Math.cos(h.tilt) - y3dA * Math.sin(h.tilt);
          const rotYA = x3dA * Math.sin(h.tilt) + y3dA * Math.cos(h.tilt);

          const rotXB = x3dB * Math.cos(h.tilt) - y3dB * Math.sin(h.tilt);
          const rotYB = x3dB * Math.sin(h.tilt) + y3dB * Math.cos(h.tilt);

          // Perspective projections
          const scaleA = focalLength / (focalLength + z3dA);
          const scaleB = focalLength / (focalLength + z3dB);

          const projXA = h.x + rotXA * scaleA;
          const projYA = h.y + rotYA * scaleA;

          const projXB = h.x + rotXB * scaleB;
          const projYB = h.y + rotYB * scaleB;

          // Depth-based sizing
          const sizeA = (z3dA < 0 ? 4.8 : 3.0) * scaleA;
          const sizeB = (z3dB < 0 ? 4.8 : 3.0) * scaleB;

          // Depth-based opacity
          const opacityA = z3dA < 0 ? 0.8 : 0.22;
          const opacityB = z3dB < 0 ? 0.8 : 0.22;

          const colorA = getHsla(h.primary ? primaryHslStr : secondaryHslStr, opacityA);
          const colorB = getHsla(h.primary ? secondaryHslStr : primaryHslStr, opacityB);

          // Connection base-pair line
          if (lineAlpha > 0) {
            const avgZ = (z3dA + z3dB) / 2;
            renderQueue.push({
              type: "line",
              x1: projXA,
              y1: projYA,
              x2: projXB,
              y2: projYB,
              z: avgZ,
              colorStr: getHsla(h.primary ? primaryHslStr : secondaryHslStr, lineAlpha),
            });
          }

          // Node A
          renderQueue.push({
            type: "node",
            x: projXA,
            y: projYA,
            z: z3dA,
            size: sizeA,
            colorStr: colorA,
          });

          // Node B
          renderQueue.push({
            type: "node",
            x: projXB,
            y: projYB,
            z: z3dB,
            size: sizeB,
            colorStr: colorB,
          });
        });
      });

      // 3. Global Painter's Sorting (sorts all nodes and lines across all helices together)
      renderQueue.sort((a, b) => b.z - a.z);

      // 4. Render sorted 3D elements
      renderQueue.forEach((item) => {
        if (item.type === "line") {
          ctx.beginPath();
          ctx.strokeStyle = item.colorStr;
          ctx.lineWidth = 1.4;
          ctx.moveTo(item.x1, item.y1);
          ctx.lineTo(item.x2, item.y2);
          ctx.stroke();
        } else if (item.type === "node") {
          // Subtle glow behind foreground nodes
          if (item.z < -15) {
            ctx.shadowBlur = 6;
            ctx.shadowColor = item.colorStr;
          }
          ctx.beginPath();
          ctx.fillStyle = item.colorStr;
          ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      time += 1.0;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
}
