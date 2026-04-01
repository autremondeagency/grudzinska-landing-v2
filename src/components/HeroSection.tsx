import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { HERO, IMAGES, CONTACT } from "@/content";

export default function HeroSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-cream"
    >
      {/* Organic background shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-sage/[0.06] blur-3xl" />
        <div className="absolute bottom-0 -left-48 w-[400px] h-[400px] rounded-full bg-terracotta/[0.04] blur-3xl" />
        {/* Grain texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-24 pb-16 lg:pt-0 lg:pb-0 w-full">
        <div className="grid lg:grid-cols-[1fr_0.9fr] gap-12 lg:gap-16 items-center">
          {/* Left — Copy */}
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sage/10 text-sage-dark text-sm font-medium mb-6 border border-sage/15"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
              {HERO.badge}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="font-serif text-warm-brown text-[2.25rem] sm:text-5xl lg:text-[3.4rem] leading-[1.12] mb-6 tracking-tight"
            >
              {HERO.heading}{" "}
              <span className="text-sage italic">{HERO.headingAccent}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-warm-brown/70 text-lg leading-relaxed max-w-lg mb-8"
            >
              {HERO.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <a
                href="#kontakt"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-sage text-white font-semibold rounded-full text-base hover:bg-sage-dark transition-all duration-300 hover:shadow-xl hover:shadow-sage/25 hover:-translate-y-0.5"
              >
                {HERO.cta}
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
              <a
                href={CONTACT.phoneRaw}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 border-2 border-warm-brown/15 text-warm-brown font-semibold rounded-full text-base hover:border-sage/40 hover:text-sage-dark transition-all duration-300 hover:-translate-y-0.5"
              >
                <Phone size={18} />
                {HERO.phoneLabel}
              </a>
            </motion.div>
          </div>

          {/* Right — Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="order-1 lg:order-2 relative"
          >
            {/* Decorative blob behind image */}
            <div className="absolute -inset-4 lg:-inset-6 bg-sage/[0.08] rounded-[2rem] lg:rounded-[3rem] -rotate-2 transition-transform duration-500" />
            <div className="absolute -inset-4 lg:-inset-6 bg-terracotta/[0.05] rounded-[2rem] lg:rounded-[3rem] rotate-1 transition-transform duration-500" />
            <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-2xl shadow-warm-brown/10">
              <motion.img
                src={IMAGES.hero}
                alt="Anna Krawczyk-Grudzińska przygotowuje zdrowe posiłki w kuchni"
                className="w-full aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] object-cover scale-110"
                loading="eager"
                style={{ y: imageY }}
              />
              {/* Subtle gradient overlay at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-warm-brown/10 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2"
      >
        <span className="text-xs text-warm-brown/40 font-medium tracking-widest uppercase">
          Przewiń
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border-2 border-warm-brown/20 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 rounded-full bg-warm-brown/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
