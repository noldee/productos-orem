"use client";

import { useScroll, useSpring, motion } from "framer-motion";
import { CartProvider } from "@/components/providers/CartProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { BentoSection } from "@/components/sections/BentoSection";
import { TOKENS } from "@/lib/data";

export default function Page() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <CartProvider>
      <div
        className="min-h-screen selection:bg-[#A3B899] selection:text-white"
        style={{ backgroundColor: TOKENS.crema, color: TOKENS.negro }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Inter:wght@200;300;400;500;600&display=swap');
          .serif { font-family: 'Cormorant Garamond', serif; }
          .sans  { font-family: 'Inter', sans-serif; }
        `}</style>

        {/* Barra de progreso */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left"
          style={{ scaleX, backgroundColor: TOKENS.musgo }}
        />

        <Navbar />
        <main>
          <HeroSection />
          <AboutSection />
          <ServicesSection />
          <ReviewsSection />
          <BentoSection />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
