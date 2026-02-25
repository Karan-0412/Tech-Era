import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import BootSequence from "@/components/BootSequence";
import MeshBackground from "@/components/MeshBackground";
import HeroScreen from "@/components/HeroScreen";
import AboutSection from "@/components/AboutSection";
import SpeakerCarousel from "@/components/SpeakerCarousel";
import ScheduleTimeline from "@/components/ScheduleTimeline";
import TerminalFooter from "@/components/TerminalFooter";

const Index = () => {
  const [booted, setBooted] = useState(false);

  const handleBootComplete = useCallback(() => setBooted(true), []);

  return (
    <div className="relative min-h-screen bg-background">
      <AnimatePresence>
        {!booted && <BootSequence onComplete={handleBootComplete} />}
      </AnimatePresence>

      {booted && (
        <>
          <MeshBackground />
          <main className="relative z-10">
            <HeroScreen />
            <AboutSection />
            <SpeakerCarousel />
            <ScheduleTimeline />
            <TerminalFooter />
          </main>
        </>
      )}
    </div>
  );
};

export default Index;
