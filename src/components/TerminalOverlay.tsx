import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Step = "init" | "name" | "email" | "event" | "team" | "password" | "submitting" | "success" | "error";

const EVENTS = [
  { id: "1", name: "Quantum Hackathon", limit: 4 },
  { id: "2", name: "AI Ethics Panel", limit: 1 },
  { id: "3", name: "Neural Sync Workshop", limit: 2 },
  { id: "4", name: "Cyber Defense Sprint", limit: 3 },
];

interface TerminalLine {
  text: string;
  color: "green" | "cyan" | "red" | "dim";
  typing?: boolean;
}

interface TerminalOverlayProps {
  open: boolean;
  onClose: () => void;
}

const AUTO_TYPE_SPEED = 35;

const useAutoType = (text: string, onDone: () => void, active: boolean) => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!active) {
      setDisplayed("");
      return;
    }
    let i = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        onDone();
      }
    }, AUTO_TYPE_SPEED);
    return () => clearInterval(interval);
  }, [text, active]);

  return displayed;
};

/* ── Matrix rain effect ─────────────────────────────── */
const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "NEXUS01アイウエオカキクケコサシスセソ>_[]{}|/\\";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array.from({ length: columns }, () => Math.random() * -100);

    let frameId: number;
    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "hsl(183, 100%, 50%)";
      ctx.font = `${fontSize}px monospace`;

      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      });
      frameId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
};

/* ── Scanline overlay ───────────────────────────────── */
const Scanlines = () => (
  <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-[0.06]">
    <div
      className="w-full h-[200%] animate-scanline"
      style={{
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--neon-green) / 0.15) 2px, hsl(var(--neon-green) / 0.15) 4px)",
      }}
    />
  </div>
);

/* ── Typing line component ──────────────────────────── */
const TypingLine = ({
  text,
  active,
  onDone,
  color = "green",
}: {
  text: string;
  active: boolean;
  onDone: () => void;
  color?: "green" | "cyan" | "red" | "dim";
}) => {
  const displayed = useAutoType(text, onDone, active);
  const colorClass =
    color === "cyan"
      ? "text-primary text-glow-cyan"
      : color === "red"
      ? "text-destructive"
      : color === "dim"
      ? "text-muted-foreground"
      : "text-accent text-glow-green";

  return (
    <div className={`font-mono text-xs sm:text-sm ${colorClass}`}>
      {displayed}
      {active && displayed.length < text.length && (
        <span className="animate-typing-cursor">▌</span>
      )}
    </div>
  );
};

/* ── Main overlay ───────────────────────────────────── */
const TerminalOverlay = ({ open, onClose }: TerminalOverlayProps) => {
  const [step, setStep] = useState<Step>("init");
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<typeof EVENTS[0] | null>(null);
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [shakeInput, setShakeInput] = useState(false);
  const [currentAutoType, setCurrentAutoType] = useState<{
    text: string;
    color: TerminalLine["color"];
  } | null>(null);
  const [autoTypeDone, setAutoTypeDone] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const addLine = useCallback(
    (text: string, color: TerminalLine["color"] = "green") => {
      setLines((prev) => [...prev, { text, color }]);
    },
    []
  );

  const startAutoType = useCallback(
    (text: string, color: TerminalLine["color"] = "green") => {
      setAutoTypeDone(false);
      setCurrentAutoType({ text, color });
    },
    []
  );

  const handleAutoTypeDone = useCallback(() => {
    if (currentAutoType) {
      addLine(currentAutoType.text, currentAutoType.color);
      setCurrentAutoType(null);
      setAutoTypeDone(true);
    }
  }, [currentAutoType, addLine]);

  // Scroll to bottom on new lines
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [lines, currentAutoType]);

  // Focus input when ready
  useEffect(() => {
    if (autoTypeDone && (step === "name" || step === "email" || step === "event" || step === "team" || step === "password")) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [autoTypeDone, step]);

  // Init sequence
  useEffect(() => {
    if (!open) return;
    setStep("init");
    setLines([]);
    setInputValue("");
    setName("");
    setEmail("");
    setSelectedEvent(null);
    setTeamMembers([]);
    setCurrentAutoType(null);
    setAutoTypeDone(false);

    const t1 = setTimeout(() => {
      startAutoType("> INITIALIZING SECURE CONNECTION...", "dim");
    }, 400);

    return () => clearTimeout(t1);
  }, [open, startAutoType]);

  // Progress through init → name
  useEffect(() => {
    if (step === "init" && autoTypeDone && !currentAutoType) {
      const t = setTimeout(() => {
        addLine("> CONNECTION ESTABLISHED.", "green");
        const t2 = setTimeout(() => {
          setStep("name");
          startAutoType("> ENTER USER_DESIGNATION (Name):", "green");
        }, 600);
        return () => clearTimeout(t2);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [step, autoTypeDone, currentAutoType, addLine, startAutoType]);

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const triggerError = (msg: string) => {
    addLine(`> ERROR: ${msg}`, "red");
    setShakeInput(true);
    setTimeout(() => setShakeInput(false), 500);
    setInputValue("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = inputValue.trim();
    if (!val) return;

    if (step === "name") {
      if (val.length < 2 || val.length > 50) {
        triggerError("OVERRIDE FAILED. TRY AGAIN.");
        return;
      }
      addLine(`> ${val}`, "green");
      setName(val);
      setInputValue("");
      setStep("email");
      setTimeout(() => startAutoType("> ENTER COMM_LINK (Email):", "green"), 300);
    } else if (step === "email") {
      if (!validateEmail(val)) {
        triggerError("OVERRIDE FAILED. TRY AGAIN.");
        return;
      }
      addLine(`> ${val}`, "green");
      setEmail(val);
      setInputValue("");
      setStep("event");
      addLine("> AVAILABLE EVENTS:", "dim");
      EVENTS.forEach(ev => addLine(`  [${ev.id}] ${ev.name} (Max: ${ev.limit})`, "cyan"));
      setTimeout(() => startAutoType("> SELECT_EVENT_ID:", "green"), 300);
    } else if (step === "event") {
      const ev = EVENTS.find(e => e.id === val);
      if (!ev) {
        triggerError("INVALID EVENT ID. TRY AGAIN.");
        return;
      }
      addLine(`> ${ev.name}`, "green");
      setSelectedEvent(ev);
      setInputValue("");
      if (ev.limit > 1) {
        setStep("team");
        setTimeout(() => startAutoType(`> ADD TEAM MEMBER (1/${ev.limit - 1}) OR TYPE 'SKIP':`, "green"), 300);
      } else {
        setStep("password");
        setTimeout(() => startAutoType("> ENTER ENCRYPTION_KEY (Password):", "green"), 300);
      }
    } else if (step === "team") {
      const normalizedVal = val.toLowerCase();
      if (normalizedVal === 'skip' || normalizedVal === 'done') {
        addLine(normalizedVal === 'skip' ? "> SKIPPED TEAM ADDITION." : "> TEAM FINALIZED.", "dim");
        setInputValue("");
        setStep("password");
        setTimeout(() => startAutoType("> ENTER ENCRYPTION_KEY (Password):", "green"), 300);
        return;
      }

      const newMembers = [...teamMembers, val];
      addLine(`+ ${val}`, "cyan");
      setTeamMembers(newMembers);
      setInputValue("");

      if (newMembers.length < (selectedEvent?.limit || 1) - 1) {
        setTimeout(() => startAutoType(`> ADD TEAM MEMBER (${newMembers.length + 1}/${(selectedEvent?.limit || 1) - 1}) OR TYPE 'DONE':`, "green"), 300);
      } else {
        setStep("password");
        setTimeout(() => startAutoType("> MAX TEAM CAPACITY REACHED. ENTER ENCRYPTION_KEY (Password):", "green"), 300);
      }
    } else if (step === "password") {
      if (val.length < 4) {
        triggerError("OVERRIDE FAILED. TRY AGAIN.");
        return;
      }
      const masked = val.replace(/./g, "💀");
      addLine(`> ${masked}`, "green");
      setInputValue("");
      setStep("submitting");

      addLine("> ENCRYPTING PAYLOAD...", "dim");
      setTimeout(() => {
        addLine("> TRANSMITTING TO MAINFRAME...", "dim");
        setTimeout(() => {
          addLine("> VERIFYING CREDENTIALS...", "dim");
          setTimeout(() => {
            // Success!
            setStep("success");
            addLine("> ACCESS GRANTED. WELCOME TO NEXUS.", "cyan");
            addLine(`> NODE "${name}" REGISTERED SUCCESSFULLY.`, "cyan");
            if (selectedEvent) {
              addLine(`> EVENT: ${selectedEvent.name.toUpperCase()}`, "dim");
            }
            if (teamMembers.length > 0) {
              addLine(`> TEAM: ${teamMembers.join(", ").toUpperCase()}`, "dim");
            }
          }, 800);
        }, 700);
      }, 600);
    }
  };

  const showInput = autoTypeDone && !currentAutoType && ["name", "email", "event", "team", "password"].includes(step);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex flex-col bg-background"
        >
          {/* Scanlines */}
          <Scanlines />

          {/* Header bar */}
          <div className="relative z-20 flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-[10px] text-accent tracking-[0.3em]">
                NEXUS MAINFRAME v2.6.0
              </span>
            </div>
            <button
              onClick={onClose}
              className="font-mono text-xs text-muted-foreground hover:text-destructive transition-colors tracking-wider"
            >
              [ESC] ABORT
            </button>
          </div>

          {/* Terminal body */}
          <div
            ref={scrollRef}
            className="relative z-20 flex-1 overflow-y-auto px-4 sm:px-8 py-6 font-mono text-xs sm:text-sm"
          >
            <div className="max-w-2xl mx-auto space-y-1">
              {/* Rendered lines */}
              {lines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className={
                    line.color === "cyan"
                      ? "text-primary text-glow-cyan"
                      : line.color === "red"
                      ? "text-destructive"
                      : line.color === "dim"
                      ? "text-muted-foreground"
                      : "text-accent text-glow-green"
                  }
                >
                  {line.text}
                </motion.div>
              ))}

              {/* Currently auto-typing line */}
              {currentAutoType && (
                <TypingLine
                  text={currentAutoType.text}
                  color={currentAutoType.color}
                  active
                  onDone={handleAutoTypeDone}
                />
              )}

              {/* Input line */}
              {showInput && (
                <motion.form
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={shakeInput ? { x: [-8, 8, -6, 6, -3, 3, 0], opacity: 1 } : { opacity: 1 }}
                  transition={shakeInput ? { duration: 0.4 } : { duration: 0.2 }}
                  className="flex items-center gap-2 mt-2"
                >
                  <span className="text-accent text-glow-green">$</span>
                  <input
                    ref={inputRef}
                    type={step === "password" ? "password" : "text"}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    autoFocus
                    className="flex-1 bg-transparent border-none outline-none text-accent font-mono text-xs sm:text-sm caret-accent placeholder:text-muted-foreground/40"
                    placeholder={
                      step === "name"
                        ? "type_your_name"
                        : step === "email"
                        ? "your@email.com"
                        : step === "event"
                        ? "enter_id"
                        : step === "team"
                        ? "member_name"
                        : "••••••••"
                    }
                    style={
                      step === "password"
                        ? ({ WebkitTextSecurity: "disc" } as React.CSSProperties)
                        : undefined
                    }
                  />
                  <span className="text-accent animate-typing-cursor">▌</span>
                </motion.form>
              )}

              {/* Success close prompt */}
              {step === "success" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="mt-6"
                >
                  <button
                    onClick={onClose}
                    className="font-mono text-xs text-primary/70 hover:text-primary transition-colors tracking-wider border border-primary/20 px-4 py-2 rounded hover:bg-primary/5"
                  >
                    {">"} DISCONNECT FROM MAINFRAME
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Bottom status bar */}
          <div className="relative z-20 px-4 py-2 border-t border-border flex items-center justify-between">
            <span className="font-mono text-[9px] text-muted-foreground/50">
              SECURE CHANNEL • AES-256 ENCRYPTED
            </span>
            <span className="font-mono text-[9px] text-accent/40">
              {step === "success" ? "● CONNECTED" : "○ PENDING"}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TerminalOverlay;
