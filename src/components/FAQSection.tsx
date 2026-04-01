import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { FAQ } from "@/content";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative py-24 lg:py-32 bg-sand overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-sage/[0.04] rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />

      <div className="relative max-w-3xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <AnimatedSection className="text-center mb-14">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-sage mb-3">
            {FAQ.label}
          </span>
          <h2 className="font-serif text-warm-brown text-3xl sm:text-4xl lg:text-[2.75rem] leading-tight">
            {FAQ.heading}
          </h2>
        </AnimatedSection>

        {/* Accordion */}
        <AnimatedSection variant="fadeUp" delay={0.15}>
          <div className="space-y-3">
            {FAQ.items.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className={`rounded-xl border transition-all duration-300 ${
                    isOpen
                      ? "bg-cream border-sage/25 shadow-md shadow-sage/5"
                      : "bg-cream/60 border-warm-brown-light/30 hover:border-sage/20"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-serif text-warm-brown text-[1.05rem] leading-snug pr-4">
                      {item.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown
                        size={20}
                        className={`transition-colors duration-200 ${
                          isOpen ? "text-sage" : "text-warm-brown/40"
                        }`}
                      />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-0">
                          <p className="text-warm-brown/65 text-[0.94rem] leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
