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
    <section ref={ref} className="relative py-24 sm:py-32 px-4 sm:px-6">
      <div className="max-w-lg mx-auto">
        {/* ── Society Branding Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center mb-16"
        >
          <div className="px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
            <span className="font-mono text-[11px] text-primary tracking-[0.4em] uppercase font-bold">
              Hosted by Apex Techno Warriors
            </span>
          </div>
          <h2 className="font-mono text-4xl sm:text-6xl font-black text-foreground tracking-tighter text-center">
            TECH <span className="text-primary text-glow-cyan">ERA</span> 3.0
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mt-6" />
        </motion.div>

        {/* ── Primary Call to Action ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 50px hsl(var(--neon-magenta) / 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onRegister}
            className="w-full sm:w-auto px-16 py-8 rounded-2xl border-2 border-secondary/50 bg-secondary/10 flex flex-col items-center justify-center gap-1 group transition-all duration-500 overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="font-mono text-2xl font-black text-secondary text-glow-magenta tracking-[0.3em]">
              REGISTER NOW
            </span>
            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-secondary opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
              ▶▶
            </div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionBriefing;
