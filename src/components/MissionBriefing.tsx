import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ── Main Component ─────────────────────────────────── */
interface MissionBriefingProps {
  visible: boolean;
  onRegister: () => void;
}

const MissionBriefing = ({ visible, onRegister }: MissionBriefingProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  if (!visible) return null;

  return (
    <section ref={ref} className="relative py-20 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        {/* ── Society Branding Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
            <span className="font-mono text-[10px] text-primary tracking-[0.4em] uppercase font-semibold">
              Hosted by Apex Techno Warriors
            </span>
          </div>
          <h2 className="font-mono text-5xl sm:text-7xl font-black text-foreground tracking-tighter text-center">
            TECH <span className="text-primary text-glow-cyan">ERA</span> 3.0
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mt-4" />
        </motion.div>

        {/* ── Call to Action ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="w-full flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "hsla(var(--secondary) / 0.15)" }}
            whileTap={{ scale: 0.98 }}
            onClick={onRegister}
            className="group relative px-10 py-4 rounded-xl border border-secondary/40 bg-secondary/5 transition-all duration-300 overflow-hidden"
          >
            {/* Gloss effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            
            <span className="font-mono text-sm sm:text-base font-bold text-secondary text-glow-magenta tracking-[0.3em] uppercase">
              REGISTER NOW
            </span>
            
            <span className="ml-3 text-secondary text-glow-magenta opacity-60 group-hover:opacity-100 transition-opacity">
              ▶▶
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionBriefing;
