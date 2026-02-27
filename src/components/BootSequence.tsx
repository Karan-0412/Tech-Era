import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const bootLines = [
  "TECH_ERA_3.0 INITIALIZING...",
  "Syncing with Apex Mainframe...",
  "Loading neural interface...",
  "Scanning biometrics... [OK]",
  "Connecting to global network...",
  "Decrypting secure protocols...",
  "ACCESS GRANTED_",
];

const BootSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [showGlitch, setShowGlitch] = useState(false);

  useEffect(() => {
    if (currentLine < bootLines.length) {
      const timer = setTimeout(() => setCurrentLine((c) => c + 1), 250);
      return () => clearTimeout(timer);
    } else {
      setShowGlitch(true);
      const timer = setTimeout(onComplete, 800);
      return () => clearTimeout(timer);
    }
  }, [currentLine, onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Scanline */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="w-full h-1 bg-primary/30 animate-scanline" />
        </div>

        <div className="w-full max-w-md px-6">
          {/* Logo */}
          <motion.h1
            className={`font-mono text-3xl font-bold text-primary text-center mb-8 text-glow-cyan ${showGlitch ? "animate-glitch" : ""}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            TECH://ERA 3.0
          </motion.h1>

          {/* Boot lines */}
          <div className="font-mono text-sm space-y-1">
            {bootLines.slice(0, currentLine).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={
                  i === bootLines.length - 1
                    ? "text-neon-green text-glow-green"
                    : "text-muted-foreground"
                }
              >
                <span className="text-primary mr-2">&gt;</span>
                {line}
              </motion.div>
            ))}
            {currentLine <= bootLines.length && (
              <span className="inline-block w-2 h-4 bg-primary animate-typing-cursor" />
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-6 h-0.5 w-full bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: `${(currentLine / bootLines.length) * 100}%` }}
              transition={{ ease: "easeOut" }}
              style={{
                boxShadow: "0 0 10px hsl(183 100% 50% / 0.8)",
              }}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BootSequence;
