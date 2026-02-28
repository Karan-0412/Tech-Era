export interface Event {
  id: string;
  name: string;
  description: string;
  limit: number;
  schedule: Array<{
    time: string;
    title: string;
    desc: string;
    day: string;
  }>;
}

export const EVENTS: Event[] = [
  {
    id: "1",
    name: "Quantum Hackathon",
    description: "Initialize your 48-hour build protocol. This flagship hackathon brings together the brightest nodes to solve quantum complexities and develop disruptive neural solutions. Reward nodes include $500K in cryptographic prizes and direct VC uplink.",
    limit: 4,
    schedule: [
      { time: "09:00", title: "GATES OPEN", desc: "Registration & neural sync", day: "DAY 1" },
      { time: "10:00", title: "KEYNOTE", desc: "The Future of AGI — Dr. Yuki Tanaka", day: "DAY 1" },
      { time: "13:00", title: "WORKSHOP", desc: "Building with Quantum APIs", day: "DAY 1" },
      { time: "16:00", title: "PANEL", desc: "Ethics in AI: The Next Frontier", day: "DAY 1" },
      { time: "09:00", title: "HACKATHON BEGINS", desc: "48-hour build sprint kicks off", day: "DAY 2" },
      { time: "14:00", title: "DEEP DIVE", desc: "Zero-Knowledge Proofs in Practice", day: "DAY 2" },
      { time: "18:00", title: "AFTERPARTY", desc: "Neon Night — Live DJ & networking", day: "DAY 2" },
      { time: "15:00", title: "DEMO DAY", desc: "Hackathon finalists present", day: "DAY 3" },
    ],
  },
  {
    id: "2",
    name: "AI Ethics Panel",
    description: "Deep-dive session into the ethics of Artificial General Intelligence. Join industry pioneers and philosophers as we dissect the moral fiber of silicon consciousness and the governance of decentralized neural networks.",
    limit: 1,
    schedule: [
      { time: "09:00", title: "CHECK-IN", desc: "Panel registration", day: "DAY 1" },
      { time: "10:00", title: "OPENING REMARKS", desc: "Welcome to AI Ethics discussion", day: "DAY 1" },
      { time: "11:00", title: "PANEL DISCUSSION", desc: "Ethics in AI: The Next Frontier", day: "DAY 1" },
      { time: "12:30", title: "Q&A SESSION", desc: "Audience questions and answers", day: "DAY 1" },
      { time: "14:00", title: "NETWORKING", desc: "Meet the panelists", day: "DAY 1" },
    ],
  },
  {
    id: "3",
    name: "Neural Sync Workshop",
    description: "Practical hands-on sync protocol for building and fine-tuning large-scale model architectures. From zero-knowledge foundations to complex transformer optimizations, synchronize your skill-node with the latest tech stack.",
    limit: 2,
    schedule: [
      { time: "09:00", title: "WELCOME", desc: "Workshop introduction", day: "DAY 1" },
      { time: "09:30", title: "FUNDAMENTALS", desc: "Neural networks basics", day: "DAY 1" },
      { time: "11:00", title: "HANDS-ON", desc: "Build your first model", day: "DAY 1" },
      { time: "13:00", title: "LUNCH BREAK", desc: "Catered lunch", day: "DAY 1" },
      { time: "14:00", title: "ADVANCED TOPICS", desc: "Deep dive into architectures", day: "DAY 2" },
      { time: "16:00", title: "PROJECT SHOWCASE", desc: "Show what you built", day: "DAY 2" },
    ],
  },
  {
    id: "4",
    name: "Cyber Defense Sprint",
    description: "Stress-test your defense protocols in this 72-hour security challenge. Identify zero-day vulnerabilities, mitigate distributed neural attacks, and protect the Apex mainframe from malicious external subroutines.",
    limit: 3,
    schedule: [
      { time: "08:00", title: "BRIEFING", desc: "Security challenge overview", day: "DAY 1" },
      { time: "09:00", title: "SPRINT STARTS", desc: "Begin solving challenges", day: "DAY 1" },
      { time: "12:00", title: "MID-POINT CHECK", desc: "Progress review", day: "DAY 1" },
      { time: "15:00", title: "EXPERT TALK", desc: "Zero-day vulnerabilities explained", day: "DAY 1" },
      { time: "09:00", title: "DAY 2 CONTINUES", desc: "Advanced challenges unlock", day: "DAY 2" },
      { time: "14:00", title: "FINAL SUBMISSIONS", desc: "Last chance to submit solutions", day: "DAY 2" },
      { time: "16:00", title: "AWARDS CEREMONY", desc: "Top teams announced", day: "DAY 3" },
    ],
  },
];
