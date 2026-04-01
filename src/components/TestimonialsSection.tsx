import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { TESTIMONIALS } from "@/content";

export default function TestimonialsSection() {
  const cardsRef = useRef(null);
  const cardsInView = useInView(cardsRef, { once: true, margin: "-60px" });

  return (
    <section className="relative py-24 lg:py-32 bg-cream overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-sage/[0.04] rounded-full blur-3xl -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-terracotta/[0.03] rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <AnimatedSection className="max-w-2xl mx-auto text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-sage mb-3">
            {TESTIMONIALS.label}
          </span>
          <h2 className="font-serif text-warm-brown text-3xl sm:text-4xl lg:text-[2.75rem] leading-tight">
            {TESTIMONIALS.heading}
          </h2>
        </AnimatedSection>

        {/* Cards */}
        <div ref={cardsRef} className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {TESTIMONIALS.reviews.map((review: { name: string; stage: string; text: string; metric: string }, i: number) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 36 }}
              animate={cardsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
              transition={{
                duration: 0.6,
                delay: 0.15 * i + 0.2,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="group relative"
            >
              <div className="relative p-6 sm:p-7 rounded-2xl bg-sand border border-warm-brown-light/30 h-full flex flex-col transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-sage/8">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      size={16}
                      className="fill-terracotta text-terracotta"
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-warm-brown/70 text-[0.94rem] leading-relaxed mb-6 flex-1">
                  &ldquo;{review.text}&rdquo;
                </blockquote>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-warm-brown-light/30">
                  <div>
                    <div className="font-semibold text-warm-brown text-sm">
                      {review.name}
                    </div>
                    <div className="text-warm-brown/50 text-xs mt-0.5">
                      {review.stage}
                    </div>
                  </div>
                  {/* Metric badge */}
                  <div className="px-3 py-1.5 rounded-full bg-sage/10 text-sage-dark text-sm font-bold">
                    {review.metric}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
