import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const HeroScreen = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--neon-cyan) / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--neon-cyan) / 0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Date */}
      <motion.p
        className="font-mono text-xs text-muted-foreground tracking-[0.3em] uppercase mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        March 15–17, 2026 • Neo Tokyo
      </motion.p>

      {/* Digital Clock */}
      <motion.div
        className="font-mono text-6xl sm:text-8xl font-bold text-primary text-glow-cyan mb-6 tabular-nums"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
      >
        {hours}
        <span className="animate-typing-cursor">:</span>
        {minutes}
        <span className="text-muted-foreground text-4xl sm:text-5xl ml-1">.{seconds}</span>
      </motion.div>

      {/* Logo */}
      <motion.h1
        className="font-mono text-4xl sm:text-6xl font-bold text-foreground tracking-tight mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        NEXUS
        <span className="text-primary text-glow-cyan"> 2026</span>
      </motion.h1>

      <motion.p
        className="font-mono text-sm text-muted-foreground mb-12 tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        [ INITIALIZE THE FUTURE ]
      </motion.p>

      {/* CTA Button */}
      <motion.button
        className="relative group px-8 py-4 font-mono text-sm font-semibold tracking-wider uppercase
          border border-primary/50 rounded-lg bg-primary/5 text-primary
          animate-pulse-glow transition-all duration-300
          hover:bg-primary/10 hover:border-primary active:scale-95"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="relative z-10">TAP TO INITIALIZE ▸</span>
        <div className="absolute inset-0 rounded-lg bg-primary/5 blur-xl group-hover:bg-primary/10 transition-all" />
      </motion.button>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="font-mono text-[10px] text-muted-foreground tracking-widest">SCROLL</span>
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-primary/60 to-transparent"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
};

export default HeroScreen;
