import { useEffect, useRef } from "react";

const MeshBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; color: string }[] = [];

    let w = window.innerWidth;
    let h = window.innerHeight;
    let dpr = window.devicePixelRatio || 1;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // Create particles
    const particleCount = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 15000));
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        color: ["#00f3ff", "#ff00ff", "#00ff66"][Math.floor(Math.random() * 3)],
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      time += 0.005;

      // Draw mesh gradient blobs
      const gradient1X = w * 0.3 + Math.sin(time * 0.7) * 100;
      const gradient1Y = h * 0.2 + Math.cos(time * 0.5) * 80;
      const g1 = ctx.createRadialGradient(gradient1X, gradient1Y, 0, gradient1X, gradient1Y, 300);
      g1.addColorStop(0, "rgba(0, 243, 255, 0.06)");
      g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      const gradient2X = w * 0.7 + Math.cos(time * 0.6) * 120;
      const gradient2Y = h * 0.5 + Math.sin(time * 0.4) * 100;
      const g2 = ctx.createRadialGradient(gradient2X, gradient2Y, 0, gradient2X, gradient2Y, 250);
      g2.addColorStop(0, "rgba(255, 0, 255, 0.04)");
      g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      // Draw connections first
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 22500) { // 150 * 150
            const dist = Math.sqrt(distSq);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 243, 255, ${0.05 * (1 - dist / 150)})`;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + "40";
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default MeshBackground;
