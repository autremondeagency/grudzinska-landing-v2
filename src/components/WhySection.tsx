import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { X, Check } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { WHY } from "@/content";

export default function WhySection() {
  const listRef = useRef(null);
  const listInView = useInView(listRef, { once: true, margin: "-60px" });

  return (
    <section
      id="dlaczego-warto"
      className="relative py-24 lg:py-32 bg-sand overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-terracotta/[0.03] rounded-full blur-3xl -translate-y-1/2" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <AnimatedSection className="max-w-2xl mx-auto text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-sage mb-3">
            {WHY.label}
          </span>
          <h2 className="font-serif text-warm-brown text-3xl sm:text-4xl lg:text-[2.75rem] leading-tight mb-5">
            {WHY.heading}
          </h2>
          <p className="text-warm-brown/70 text-lg leading-relaxed">
            {WHY.description}
          </p>
        </AnimatedSection>

        {/* Comparison columns */}
        <div ref={listRef} className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-14">
          {/* WITHOUT */}
          <AnimatedSection variant="slideLeft" delay={0.1}>
            <div className="relative p-7 sm:p-8 rounded-2xl bg-cream border-2 border-terracotta/20 h-full">
              {/* Subtle warning background */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-terracotta/[0.04] to-transparent" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-terracotta/15 flex items-center justify-center">
                    <X size={16} className="text-terracotta" />
                  </div>
                  <h3 className="font-serif text-xl text-terracotta">
                    Bez przygotowania
                  </h3>
                </div>
                <ul className="space-y-3.5">
                  {WHY.without.map((item: string, i: number) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -16 }}
                      animate={
                        listInView
                          ? { opacity: 1, x: 0 }
                          : { opacity: 0, x: -16 }
                      }
                      transition={{ delay: 0.08 * i + 0.3, duration: 0.4 }}
                      className="flex items-start gap-3"
                    >
                      <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-terracotta/12 flex items-center justify-center">
                        <X size={12} className="text-terracotta" />
                      </span>
                      <span className="text-warm-brown/65 text-[0.94rem] leading-relaxed">
                        {item}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </AnimatedSection>

          {/* WITH */}
          <AnimatedSection variant="slideRight" delay={0.2}>
            <div className="relative p-7 sm:p-8 rounded-2xl bg-sage/[0.08] border-2 border-sage/25 h-full shadow-lg shadow-sage/5">
              {/* Success gradient */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sage/[0.06] to-transparent" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center">
                    <Check size={16} className="text-sage-dark" />
                  </div>
                  <h3 className="font-serif text-xl text-sage-dark">
                    Z przygotowaniem
                  </h3>
                </div>
                <ul className="space-y-3.5">
                  {WHY.with.map((item: string, i: number) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 16 }}
                      animate={
                        listInView
                          ? { opacity: 1, x: 0 }
                          : { opacity: 0, x: 16 }
                      }
                      transition={{ delay: 0.08 * i + 0.4, duration: 0.4 }}
                      className="flex items-start gap-3"
                    >
                      <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-sage/20 flex items-center justify-center">
                        <Check size={12} className="text-sage-dark" />
                      </span>
                      <span className="text-warm-brown/80 text-[0.94rem] leading-relaxed font-medium">
                        {item}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Quote */}
        <AnimatedSection variant="scaleIn" delay={0.2} className="max-w-3xl mx-auto">
          <blockquote className="relative text-center px-6 py-8">
            {/* Decorative quotes */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 font-serif text-6xl text-sage/20 leading-none select-none">
              &ldquo;
            </div>
            <p className="relative font-serif text-warm-brown text-lg sm:text-xl lg:text-[1.35rem] leading-relaxed italic">
              {WHY.quote}
            </p>
          </blockquote>
        </AnimatedSection>
      </div>
    </section>
  );
}
