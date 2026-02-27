import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const specs = [
  {
    icon: "◈",
    title: "3 DAYS",
    subtitle: "RUNTIME",
    description: "72 hours of non-stop innovation, workshops, and networking across 4 stages.",
    color: "cyan" as const,
  },
  {
    icon: "⬡",
    title: "120+",
    subtitle: "SPEAKERS",
    description: "Industry pioneers in AI, Web3, quantum computing, and cybersecurity.",
    color: "magenta" as const,
  },
  {
    icon: "◇",
    title: "5,000",
    subtitle: "NODES",
    description: "Connect with developers, founders, and visionaries from 60+ countries.",
    color: "green" as const,
  },
  {
    icon: "△",
    title: "48HR",
    subtitle: "HACKATHON",
    description: "Build the future in our flagship hackathon with $500K in prizes.",
    color: "cyan" as const,
  },
];

const glowMap = {
  cyan: "glow-cyan text-glow-cyan",
  magenta: "glow-magenta text-glow-magenta",
  green: "glow-green text-glow-green",
};

const textColorMap = {
  cyan: "text-primary",
  magenta: "text-secondary",
  green: "text-accent",
};

const SpecCard = ({ spec, index }: { spec: typeof specs[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, rotateX: 10 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ type: "spring", stiffness: 80, delay: index * 0.15 }}
      className="glass rounded-xl p-6 hover:scale-[1.02] transition-transform duration-300"
    >
      <div className={`text-3xl mb-3 ${textColorMap[spec.color]} ${glowMap[spec.color].split(" ").pop()}`}>
        {spec.icon}
      </div>
      <div className="font-mono text-2xl font-bold text-foreground mb-0.5">
        {spec.title}
      </div>
      <div className={`font-mono text-sm tracking-widest ${textColorMap[spec.color]} mb-3`}>
        {spec.subtitle}
      </div>
      <p className="text-base text-muted-foreground leading-relaxed">
        {spec.description}
      </p>
    </motion.div>
  );
};

const AboutSection = () => {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true });

  return (
    <section className="relative py-24 px-6">
      <motion.div
        ref={titleRef}
        initial={{ opacity: 0, y: 20 }}
        animate={titleInView ? { opacity: 1, y: 0 } : {}}
        className="text-center mb-16"
      >
        <p className="font-mono text-sm text-primary tracking-[0.4em] mb-3">
          // SYSTEM_SPECS
        </p>
        <h2 className="font-mono text-3xl sm:text-4xl font-bold text-foreground">
          EVENT <span className="text-primary text-glow-cyan">OVERVIEW</span>
        </h2>
      </motion.div>

      <div className="max-w-lg mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
        {specs.map((spec, i) => (
          <SpecCard key={spec.title} spec={spec} index={i} />
        ))}
      </div>
    </section>
  );
};

export default AboutSection;
