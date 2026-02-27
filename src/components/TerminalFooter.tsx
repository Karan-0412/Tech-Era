import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import TerminalOverlay from "./TerminalOverlay";

const TerminalFooter = () => {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <footer className="py-16 px-6" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ type: "spring", stiffness: 80 }}
        className="max-w-lg mx-auto"
      >
        <p className="font-mono text-xs text-primary tracking-[0.4em] mb-3 text-center">
          // TERMINAL
        </p>
        <h2 className="font-mono text-2xl sm:text-3xl font-bold text-foreground text-center mb-8">
          JOIN THE <span className="text-primary text-glow-cyan">MAINFRAME</span>
        </h2>

        {/* Terminal window */}
        <div className="rounded-xl overflow-hidden border border-border bg-card">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/30">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-neon-green/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-primary/40" />
            <span className="ml-2 font-mono text-[11px] text-muted-foreground">
              apex@mainframe ~ register
            </span>
          </div>

          {/* Terminal body */}
          <div className="p-4 font-mono text-xs min-h-[120px] flex flex-col items-center justify-center gap-4">
            <div className="text-muted-foreground text-center">
              <p>apex@mainframe:~$ _awaiting_input</p>
            </div>
            <button
              onClick={() => setOverlayOpen(true)}
              className="px-6 py-2.5 rounded border border-primary/30 text-primary text-xs hover:bg-primary/10 transition-colors tracking-[0.3em] animate-pulse-glow font-mono"
            >
              INITIALIZE CONNECTION
            </button>
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex gap-6">
            {["TWITTER", "DISCORD", "GITHUB", "TEAM"].map((link) => (
              <a
                key={link}
                href={link === "TEAM" ? "#team" : "#"}
                onClick={link === "TEAM" ? (e) => {
                  e.preventDefault();
                  document.getElementById("team")?.scrollIntoView({ behavior: "smooth" });
                } : undefined}
                className="font-mono text-[11px] text-muted-foreground hover:text-primary transition-colors tracking-widest"
              >
                {link}
              </a>
            ))}
          </div>
          <p className="font-mono text-[11px] text-muted-foreground/50">
            © TECH ERA 3.0 • APEX TECHNO WARRIORS • ALL RIGHTS RESERVED
          </p>
        </div>
      </motion.div>

      {/* Full-screen terminal overlay */}
      <TerminalOverlay open={overlayOpen} onClose={() => setOverlayOpen(false)} />
    </footer>
  );
};

export default TerminalFooter;
