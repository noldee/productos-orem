"use client";

import { useScroll, useSpring, motion } from "framer-motion";
import { CartProvider } from "@/components/providers/CartProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { TOKENS } from "@/lib/data";
import { ServicesSection } from "@/components/sections/ServicesSection";

export default function Page() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <CartProvider>
      <div
        className="min-h-screen selection:bg-[#A3B899] selection:text-white"
        style={{ backgroundColor: TOKENS.crema, color: TOKENS.negro }}
      >
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
          <ContactSection />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
