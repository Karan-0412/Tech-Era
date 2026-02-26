import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const speakers = [
  { name: "Dr. Yuki Tanaka", role: "AI Research Lead, NeuraCorp", avatar: "YT" },
  { name: "Marcus Chen", role: "Founder, Quantum Labs", avatar: "MC" },
  { name: "Aria Volkov", role: "CTO, CyberShield", avatar: "AV" },
  { name: "Kai Okafor", role: "Head of Web3, MetaForge", avatar: "KO" },
  { name: "Luna Reyes", role: "VP Engineering, SynthOS", avatar: "LR" },
  { name: "Zane Patel", role: "Director, DeepMind X", avatar: "ZP" },
];

const SpeakerCard = ({ speaker, index }: { speaker: typeof speakers[0]; index: number }) => {
  const [active, setActive] = useState(false);
  const [typedName, setTypedName] = useState("");

  const handleTap = () => {
    setActive(!active);
    if (!active) {
      let i = 0;
      setTypedName("");
      const interval = setInterval(() => {
        setTypedName(speaker.name.slice(0, i + 1));
        i++;
        if (i >= speaker.name.length) clearInterval(interval);
      }, 40);
    }
  };

  const colors = ["from-neon-cyan/30 to-neon-magenta/30", "from-neon-magenta/30 to-neon-green/30", "from-neon-green/30 to-neon-cyan/30"];

  return (
    <motion.div
      className="flex-shrink-0 w-52 snap-center will-change-transform"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <div
        className="glass rounded-xl p-5 cursor-pointer transition-all duration-300 hover:scale-[1.03]"
        onClick={handleTap}
      >
        {/* Avatar */}
        <div
          className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center font-mono text-lg font-bold mb-4 transition-all duration-500 bg-gradient-to-br ${colors[index % 3]} ${active ? "grayscale-0" : "grayscale"}`}
          style={{
            boxShadow: active ? "0 0 30px hsl(var(--neon-cyan) / 0.4)" : "none",
          }}
        >
          <span className="text-foreground">{speaker.avatar}</span>
        </div>

        {/* Name with typing effect */}
        <div className="text-center">
          <h3 className="font-mono text-sm font-semibold text-foreground min-h-[1.5rem]">
            {active ? typedName : speaker.name}
            {active && typedName.length < speaker.name.length && (
              <span className="inline-block w-1.5 h-3.5 bg-primary ml-0.5 animate-typing-cursor" />
            )}
          </h3>
          <p className="font-sans text-sm text-muted-foreground mt-1">
            {speaker.role}
          </p>
        </div>

        {/* Status indicator */}
        <div className="flex items-center justify-center gap-1.5 mt-3">
          <div className={`w-1.5 h-1.5 rounded-full ${active ? "bg-neon-green" : "bg-muted-foreground/30"}`} />
          <span className="font-mono text-[11px] text-muted-foreground">
            {active ? "CONNECTED" : "TAP TO CONNECT"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const SpeakerCarousel = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="py-24" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        className="text-center mb-12 px-6"
      >
        <p className="font-mono text-sm text-secondary tracking-[0.4em] mb-3">
          // DIRECTORY
        </p>
        <h2 className="font-mono text-3xl sm:text-4xl font-bold text-foreground">
          SPEAKER <span className="text-secondary text-glow-magenta">LINEUP</span>
        </h2>
      </motion.div>

      <div className="overflow-x-auto pb-4 scrollbar-hide overscroll-x-contain">
        <div className="flex gap-4 px-6 w-max snap-x snap-mandatory">
          {speakers.map((speaker, i) => (
            <SpeakerCard key={speaker.name} speaker={speaker} index={i} />
          ))}
        </div>
      </div>

      <p className="font-mono text-[10px] text-muted-foreground text-center mt-4 tracking-widest">
        ← SWIPE TO BROWSE →
      </p>
    </section>
  );
};

export default SpeakerCarousel;
