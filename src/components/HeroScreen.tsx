import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroScreenProps {
  onUnlock: () => void;
}

const HeroScreen = ({ onUnlock }: HeroScreenProps) => {
  const [time, setTime] = useState(new Date());
  const [unlocking, setUnlocking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  const handleUnlock = () => {
    setUnlocking(true);
    // Delay to let the animation play
    setTimeout(() => onUnlock(), 1200);
  };

  return (
    <AnimatePresence>
      {!unlocking ? (
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
            March 15–17, 2026
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
            TECH
            <span className="text-primary text-glow-cyan"> ERA</span>
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
            onClick={handleUnlock}
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

        </section>
      ) : (
        /* ── Blast Door Transition ────────────────────── */
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Flash */}
          <motion.div
            className="absolute inset-0 z-30 bg-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0] }}
            transition={{ duration: 0.4, times: [0, 0.15, 1] }}
          />

          {/* Left door */}
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 bg-background z-20 border-r border-primary/30"
            initial={{ x: 0 }}
            animate={{ x: "-105%" }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary to-transparent" />
            <div className="h-full flex items-center justify-end pr-8">
              <span className="font-mono text-6xl sm:text-8xl font-bold text-primary/10">T</span>
            </div>
          </motion.div>

          {/* Right door */}
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 bg-background z-20 border-l border-primary/30"
            initial={{ x: 0 }}
            animate={{ x: "105%" }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary to-transparent" />
            <div className="h-full flex items-center justify-start pl-8">
              <span className="font-mono text-6xl sm:text-8xl font-bold text-primary/10">E</span>
            </div>
          </motion.div>

          {/* Center glow burst */}
          <motion.div
            className="absolute inset-0 z-10 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 2.5] }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="w-40 h-40 rounded-full bg-primary/30 blur-3xl" />
          </motion.div>

          {/* Particle burst (simple CSS dots) */}
          {Array.from({ length: 20 }).map((_, i) => {
            const angle = (i / 20) * 360;
            const rad = (angle * Math.PI) / 180;
            const distance = 300 + Math.random() * 400;
            return (
              <motion.div
                key={i}
                className="absolute z-20 w-1 h-1 rounded-full bg-primary"
                style={{
                  left: "50%",
                  top: "50%",
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos(rad) * distance,
                  y: Math.sin(rad) * distance,
                  opacity: 0,
                  scale: 0,
                }}
                transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
              />
            );
          })}
        </section>
      )}
    </AnimatePresence>
  );
};

export default HeroScreen;
