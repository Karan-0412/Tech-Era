import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const schedule = [
  { time: "09:00", title: "GATES OPEN", desc: "Registration & neural sync", day: "DAY 1" },
  { time: "10:00", title: "KEYNOTE", desc: "The Future of AGI — Dr. Yuki Tanaka", day: "DAY 1" },
  { time: "13:00", title: "WORKSHOP", desc: "Building with Quantum APIs", day: "DAY 1" },
  { time: "16:00", title: "PANEL", desc: "Ethics in AI: The Next Frontier", day: "DAY 1" },
  { time: "09:00", title: "HACKATHON BEGINS", desc: "48-hour build sprint kicks off", day: "DAY 2" },
  { time: "14:00", title: "DEEP DIVE", desc: "Zero-Knowledge Proofs in Practice", day: "DAY 2" },
  { time: "18:00", title: "AFTERPARTY", desc: "Neon Night — Live DJ & networking", day: "DAY 2" },
  { time: "15:00", title: "DEMO DAY", desc: "Hackathon finalists present", day: "DAY 3" },
];

const ScheduleItem = ({ item, index }: { item: typeof schedule[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ type: "spring", stiffness: 80, delay: 0.1 }}
      className="flex gap-4 items-start"
    >
      {/* Timeline node */}
      <div className="flex flex-col items-center flex-shrink-0 pt-1">
        <motion.div
          className="w-3 h-3 rounded-full border-2 border-primary bg-background"
          animate={isInView ? {
            boxShadow: [
              "0 0 0px hsl(183 100% 50% / 0)",
              "0 0 15px hsl(183 100% 50% / 0.6)",
              "0 0 5px hsl(183 100% 50% / 0.3)",
            ]
          } : {}}
          transition={{ duration: 1, delay: 0.3 }}
        />
        {index < schedule.length - 1 && (
          <motion.div
            className="w-px h-16 bg-gradient-to-b from-primary/40 to-transparent"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ originY: 0 }}
          />
        )}
      </div>

      {/* Content */}
      <div className="glass rounded-lg p-4 flex-1 mb-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs text-primary">{item.time}</span>
          {item.day && index === 0 || (index > 0 && schedule[index - 1].day !== item.day) ? (
            <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {item.day}
            </span>
          ) : null}
        </div>
        <h3 className="font-mono text-sm font-bold text-foreground">{item.title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
      </div>
    </motion.div>
  );
};

const ScheduleTimeline = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const glowHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="py-24 px-6" ref={containerRef}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        className="text-center mb-16"
      >
        <p className="font-mono text-xs text-accent tracking-[0.4em] mb-3">
          // CIRCUIT_BOARD
        </p>
        <h2 className="font-mono text-3xl sm:text-4xl font-bold text-foreground">
          EVENT <span className="text-accent text-glow-green">SCHEDULE</span>
        </h2>
      </motion.div>

      <div className="max-w-md mx-auto relative">
        {/* Glowing line behind */}
        <div className="absolute left-[5px] top-0 bottom-0 w-px bg-muted">
          <motion.div
            className="w-full bg-primary"
            style={{ height: glowHeight, boxShadow: "0 0 8px hsl(183 100% 50% / 0.5)" }}
          />
        </div>

        <div className="space-y-0">
          {schedule.map((item, i) => (
            <ScheduleItem key={`${item.day}-${item.time}`} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScheduleTimeline;
