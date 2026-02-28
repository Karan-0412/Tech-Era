import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ── Status Widget ──────────────────────────────────── */
const StatusWidget = ({
  label,
  value,
  color,
  delay,
}: {
  label: string;
  value: string;
  color: "cyan" | "green";
  delay: number;
}) => {
  const colorClass =
    color === "cyan"
      ? "text-primary text-glow-cyan border-primary/20"
      : "text-accent text-glow-green border-accent/20";
  const dotClass = color === "cyan" ? "bg-primary" : "bg-accent";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      className={`glass rounded-lg px-3 py-2 border ${colorClass} flex items-center gap-2`}
    >
      <div className={`w-1.5 h-1.5 rounded-full ${dotClass} animate-pulse`} />
      <div>
        <p className="font-mono text-[9px] text-muted-foreground tracking-widest">{label}</p>
        <p className={`font-mono text-sm font-bold ${color === "cyan" ? "text-primary" : "text-accent"}`}>
          {value}
        </p>
      </div>
    </motion.div>
  );
};

/* ── Typewriter Hook ────────────────────────────────── */
const useTypewriter = (text: string, speed: number, active: boolean) => {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!active) return;
    let i = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, active, speed]);
  return displayed;
};

/* ── Quick Action Button ────────────────────────────── */
const QuickAction = ({
  icon,
  label,
  sublabel,
  highlighted,
  delay,
  onClick,
}: {
  icon: string;
  label: string;
  sublabel: string;
  highlighted?: boolean;
  delay: number;
  onClick?: () => void;
}) => {
  const base = highlighted
    ? "border-primary/40 bg-primary/10 hover:bg-primary/20 hover:border-primary/60"
    : "border-border hover:border-primary/30 hover:bg-primary/5";

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 120 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`glass rounded-xl border ${base} p-4 sm:p-5 flex flex-col items-center justify-center gap-2 transition-all duration-300 group`}
    >
      <span className="text-2xl">{icon}</span>
      <span
        className={`font-mono text-[11.5px] tracking-[0.25em] ${
          highlighted ? "text-primary text-glow-cyan" : "text-foreground"
        }`}
      >
        {label}
      </span>
      <span className="font-mono text-[10px] text-muted-foreground tracking-wider">{sublabel}</span>
      {highlighted && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{ boxShadow: "inset 0 0 30px hsl(var(--neon-cyan) / 0.1)" }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
};

/* ── Main Component ─────────────────────────────────── */
interface MissionBriefingProps {
  visible: boolean;
  onRegister: () => void;
}

const MissionBriefing = ({ visible, onRegister }: MissionBriefingProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const headline = "> ACCESS GRANTED. WELCOME TO TECH ERA 3.0.";
  const typedHeadline = useTypewriter(headline, 40, visible && isInView);
  const showCursor = typedHeadline.length < headline.length;

  if (!visible) return null;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={ref} className="relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-lg mx-auto">
        {/* ── Society Branding Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center mb-10"
        >
          <div className="px-3 py-1 rounded-full border border-primary/30 bg-primary/5 mb-3">
            <span className="font-mono text-[10px] text-primary tracking-[0.3em] uppercase">
              Hosted by Apex Techno Warriors
            </span>
          </div>
          <h2 className="font-mono text-3xl font-black text-foreground tracking-tighter">
            TECH <span className="text-primary text-glow-cyan">ERA</span> 3.0
          </h2>
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mt-2" />
        </motion.div>

        {/* ── Status Widgets ─────────────────── */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-8">
          <StatusWidget label="UPLINK" value="ACTIVE" color="green" delay={0.2} />
          <StatusWidget label="NODE" value="001" color="cyan" delay={0.35} />
          <StatusWidget label="THREAT" value="ZERO" color="green" delay={0.5} />
        </div>

        {/* ── Terminal Card ───────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 80 }}
          className="glass rounded-xl border border-border overflow-hidden mb-8"
        >
          {/* Terminal title bar */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/20">
            <div className="w-2 h-2 rounded-full bg-destructive/60" />
            <div className="w-2 h-2 rounded-full bg-accent/40" />
            <div className="w-2 h-2 rounded-full bg-primary/40" />
            <span className="font-mono text-[11px] text-muted-foreground tracking-widest">
              MISSION_BRIEF.exe
            </span>
          </div>

          <div className="p-5 sm:p-6">
            {/* Typewriter headline */}
            <p className="font-mono text-base sm:text-lg text-primary text-glow-cyan mb-4 leading-relaxed">
              {typedHeadline}
              {showCursor && <span className="animate-typing-cursor">▌</span>}
            </p>

            {/* Manifesto */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              className="text-base text-muted-foreground leading-relaxed"
            >
              The ultimate convergence of developers, designers, and disruptors.
              Three days of keynotes, workshops, and a 48-hour hackathon—pushing
              the boundaries of what's possible.
            </motion.p>
          </div>
        </motion.div>

        {/* ── Quick Actions Grid ──────────────── */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <QuickAction
            icon="⬡"
            label="PROTOCOL"
            sublabel="Schedule"
            delay={1.35}
            onClick={() => scrollTo("schedule")}
          />
          <QuickAction
            icon="✚"
            label="TEAM"
            sublabel="Add Node"
            delay={1.5}
            onClick={() => scrollTo("team")}
          />
        </div>

        {/* ── Primary Call to Action ── */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.7, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.02, boxShadow: "0 0 40px hsl(var(--neon-magenta) / 0.3)" }}
          whileTap={{ scale: 0.98 }}
          onClick={onRegister}
          className="w-full py-5 rounded-2xl border-2 border-secondary/50 bg-secondary/10 flex flex-col items-center justify-center gap-1 group transition-all duration-500 overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <span className="font-mono text-lg font-black text-secondary text-glow-magenta tracking-[0.2em]">
            REGISTER NOW
          </span>
          <span className="font-mono text-[10px] text-muted-foreground/80 tracking-widest uppercase">
            Initialize your participation node
          </span>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-secondary opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
            ▶▶
          </div>
        </motion.button>
      </div>
    </section>
  );
};

export default MissionBriefing;
