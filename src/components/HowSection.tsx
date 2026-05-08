import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, Heart, Shield, ArrowRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { HOW } from "@/content";

const stepIcons = [Phone, Heart, Shield];

export default function HowSection() {
  const stepsRef = useRef(null);
  const stepsInView = useInView(stepsRef, { once: true, margin: "-60px" });

  return (
    <section className="relative py-24 lg:py-32 bg-cream overflow-hidden">
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-sage/[0.05] rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <AnimatedSection className="max-w-2xl mx-auto text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-sage mb-3">
            {HOW.label}
          </span>
          <h2 className="font-serif text-warm-brown text-3xl sm:text-4xl lg:text-[2.75rem] leading-tight">
            {HOW.heading}
          </h2>
        </AnimatedSection>

        {/* Steps */}
        <div ref={stepsRef} className="relative max-w-4xl mx-auto">
          {/* Connecting dotted line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-[calc(16.67%+1.25rem)] right-[calc(16.67%+1.25rem)] h-0">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={stepsInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="w-full border-t-2 border-dashed border-sage/25 origin-left"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-12">
            {HOW.steps.map((step: { number: number; title: string; description: string }, i: number) => {
              const Icon = stepIcons[i];
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 32 }}
                  animate={
                    stepsInView
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 32 }
                  }
                  transition={{
                    duration: 0.6,
                    delay: 0.2 * i + 0.2,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="relative text-center group"
                >
                  {/* Number circle */}
                  <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-sage text-white mb-6 shadow-lg shadow-sage/20 transition-transform duration-300 group-hover:scale-110">
                    <span className="font-serif text-xl">{step.number}</span>
                    {/* Icon orbit */}
                    <div className="absolute -right-1 -bottom-1 w-7 h-7 rounded-full bg-cream border-2 border-sage/30 flex items-center justify-center">
                      <Icon size={13} className="text-sage-dark" />
                    </div>
                  </div>

                  <h3 className="font-serif text-warm-brown text-xl mb-3">
                    {step.title}
                  </h3>
                  <p className="text-warm-brown/65 text-[0.94rem] leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Inline CTA */}
          <AnimatedSection variant="fadeUp" delay={0.5}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href="#kontakt"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-sage text-white font-semibold rounded-full text-base hover:bg-sage-dark transition-all duration-300 hover:shadow-xl hover:shadow-sage/25 hover:-translate-y-0.5"
              >
                Zarezerwuj darmową konsultację
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
              <span className="text-sm text-warm-brown/55">
                Bez zobowiązań · 15-20 min
              </span>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
