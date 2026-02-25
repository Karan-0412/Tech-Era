import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const TerminalFooter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [output, setOutput] = useState<string[]>([
    "nexus@mainframe:~$ _awaiting_input",
  ]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setOutput((prev) => [
      ...prev,
      `> register --email ${email}`,
      "Encrypting payload...",
      "Transmitting to mainframe...",
      "✓ NODE REGISTERED SUCCESSFULLY",
      `Welcome to NEXUS 2026, ${email.split("@")[0]}.`,
    ]);
    setSubmitted(true);
    setEmail("");
  };

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
            <span className="ml-2 font-mono text-[10px] text-muted-foreground">
              nexus@mainframe ~ register
            </span>
          </div>

          {/* Terminal body */}
          <div className="p-4 font-mono text-xs min-h-[160px]">
            {output.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className={
                  line.startsWith("✓")
                    ? "text-neon-green text-glow-green"
                    : line.startsWith(">")
                    ? "text-primary"
                    : "text-muted-foreground"
                }
              >
                {line}
              </motion.div>
            ))}

            {!submitted && (
              <form onSubmit={handleSubmit} className="mt-3 flex items-center gap-2">
                <span className="text-primary">$</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="enter_your@email.com"
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/50 font-mono text-xs"
                  required
                />
                <button
                  type="submit"
                  className="px-3 py-1 rounded border border-primary/30 text-primary text-[10px] hover:bg-primary/10 transition-colors tracking-wider"
                >
                  EXECUTE
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex gap-6">
            {["TWITTER", "DISCORD", "GITHUB"].map((link) => (
              <a
                key={link}
                href="#"
                className="font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors tracking-widest"
              >
                {link}
              </a>
            ))}
          </div>
          <p className="font-mono text-[9px] text-muted-foreground/50">
            © 2026 NEXUS PROTOCOL • ALL RIGHTS RESERVED
          </p>
        </div>
      </motion.div>
    </footer>
  );
};

export default TerminalFooter;
