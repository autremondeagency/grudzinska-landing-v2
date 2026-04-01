import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { FOR_WHOM } from "@/content";

export default function ForWhomSection() {
  const cardsRef = useRef(null);
  const cardsInView = useInView(cardsRef, { once: true, margin: "-60px" });

  return (
    <section id="dla-kogo" className="relative py-24 lg:py-32 bg-cream overflow-hidden">
      {/* Organic bg shapes */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-terracotta/[0.03] rounded-full blur-3xl -translate-x-1/2 translate-y-1/3" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <AnimatedSection className="max-w-2xl mb-16">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-sage mb-3">
            {FOR_WHOM.label}
          </span>
          <h2 className="font-serif text-warm-brown text-3xl sm:text-4xl lg:text-[2.75rem] leading-tight mb-5">
            {FOR_WHOM.heading}
          </h2>
          <p className="text-warm-brown/70 text-lg leading-relaxed">
            {FOR_WHOM.description}
          </p>
        </AnimatedSection>

        {/* Timeline cards */}
        <div ref={cardsRef} className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-[calc(12.5%+1rem)] right-[calc(12.5%+1rem)] h-[2px]">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={cardsInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full h-full bg-gradient-to-r from-sage/30 via-warm-brown-light/50 to-terracotta/30 origin-left"
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FOR_WHOM.cards.map((card: { number: string; title: string; description: string }, i: number) => {
              const isEven = i % 2 === 0;

              return (
                <motion.div
                  key={card.number}
                  initial={{ opacity: 0, y: 40 }}
                  animate={cardsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.15 * i + 0.2,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="group relative"
                >
                  <div
                    className={`relative p-6 rounded-2xl border transition-all duration-500 h-full hover:-translate-y-1 hover:shadow-lg ${
                      isEven
                        ? "bg-sage/[0.04] border-sage/15 hover:shadow-sage/10 hover:border-sage/30"
                        : "bg-terracotta/[0.04] border-terracotta/15 hover:shadow-terracotta/10 hover:border-terracotta/30"
                    }`}
                  >
                    {/* Number dot */}
                    <div className="relative z-10 mb-5">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                          isEven ? "bg-sage" : "bg-terracotta"
                        }`}
                      >
                        {card.number}
                      </div>
                    </div>

                    <h3
                      className={`font-serif text-xl mb-3 ${
                        isEven ? "text-sage-dark" : "text-terracotta"
                      }`}
                    >
                      {card.title}
                    </h3>
                    <p className="text-warm-brown/65 text-[0.94rem] leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
