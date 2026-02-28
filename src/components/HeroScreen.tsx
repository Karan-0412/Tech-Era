import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeroScreenProps {
  onUnlock: () => void;
}

const HeroScreen = ({ onUnlock }: HeroScreenProps) => {
  const isMobile = useIsMobile();
  const [time, setTime] = useState(new Date());
  const [unlocking, setUnlocking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleUnlock = () => {
    setUnlocking(true);
    setTimeout(() => onUnlock(), 1200);
  };

  return (
    <AnimatePresence>
      {!unlocking ? (
        <section className="relative w-full h-[100dvh] flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden bg-black">
          {/* Animated gradient background */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            {/* Gradient orbs */}
            <motion.div
              className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-cyan-400/20 blur-3xl"
              animate={{
                y: [0, 100, 0],
                x: [0, 50, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl"
              animate={{
                y: [0, -100, 0],
                x: [0, -50, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute top-1/2 right-0 w-80 h-80 rounded-full bg-cyan-400/10 blur-3xl"
              animate={{
                y: [0, 50, 0],
                x: [0, -80, 0],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          {/* Grid overlay */}
          <div
            className="absolute inset-0 z-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(hsl(var(--neon-cyan) / 0.5) 1px, transparent 1px),
                linear-gradient(90deg, hsl(var(--neon-cyan) / 0.5) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />

          {/* Floating particles */}
          {!isMobile &&
            Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute z-0 w-1 h-1 rounded-full bg-cyan-400/40"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                animate={{
                  y: [0, -200, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 5 + Math.random() * 5,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}

          {/* Content wrapper */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-8">
            {/* Society Name */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex items-center justify-center space-x-2"
            >
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
              <p className="font-mono text-xs sm:text-sm text-cyan-400 tracking-[0.3em] uppercase font-semibold">
                APEX TECHNO WARRIORS
              </p>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            </motion.div>

            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                delay: 0.4,
                duration: 0.8,
                type: "spring",
                stiffness: 80,
              }}
              className="space-y-2"
            >
              <h1 className="font-black text-5xl sm:text-7xl lg:text-8xl tracking-tighter">
                <span className="text-white">TECH</span>
                <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 text-transparent bg-clip-text animate-pulse">
                  ERA 3.0
                </span>
              </h1>
            </motion.div>

            {/* Subtitle with date */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="font-mono text-xs sm:text-sm text-gray-300/80 tracking-wider uppercase"
            >
              March 15–17, 2026 • The Future Awaits
            </motion.p>

            {/* Register Button */}
            <motion.button
              onClick={handleUnlock}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              whileHover={{ scale: 1.08, boxShadow: "0 0 30px rgba(34, 211, 238, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              className="relative group mt-8 px-8 sm:px-12 py-4 sm:py-5 font-mono text-sm sm:text-base font-bold tracking-[0.2em] uppercase
                border-2 border-cyan-400 rounded-md
                bg-gradient-to-r from-cyan-500/10 to-cyan-400/10
                text-cyan-300 transition-all duration-300
                overflow-hidden"
            >
              {/* Animated background */}
              <div className="absolute inset-0 z-0 bg-gradient-to-r from-cyan-600/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Animated border glow */}
              <div className="absolute inset-0 z-0 rounded-md bg-gradient-to-r from-cyan-400/0 via-cyan-400/50 to-cyan-400/0 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />

              <span className="relative z-10 flex items-center justify-center space-x-3">
                <span>REGISTER NOW</span>
                <span className="text-lg">→</span>
              </span>
            </motion.button>

            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="w-32 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-4"
            />
          </div>
        </section>
      ) : (
        /* ── Blast Door Transition ────────────────────── */
        <section className="relative h-[100dvh] flex items-center justify-center overflow-hidden">
          {/* Flash */}
          {!isMobile && (
            <motion.div
              className="absolute inset-0 z-30 bg-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.9, 0] }}
              transition={{ duration: 0.4, times: [0, 0.15, 1] }}
            />
          )}

          {/* Left door */}
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 bg-background z-20 border-r border-primary/30 will-change-transform"
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
            className="absolute inset-y-0 right-0 w-1/2 bg-background z-20 border-l border-primary/30 will-change-transform"
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
          {Array.from({ length: isMobile ? 8 : 20 }).map((_, i) => {
            const particleCount = isMobile ? 8 : 20;
            const angle = (i / particleCount) * 360;
            const rad = (angle * Math.PI) / 180;
            const distance = isMobile ? 200 + Math.random() * 200 : 300 + Math.random() * 400;
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
