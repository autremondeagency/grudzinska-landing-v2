import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PILLARS } from "@/content";

export default function PillarsStrip() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section ref={ref} className="relative py-16 bg-sage overflow-hidden">
      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-5xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {PILLARS.items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 * i + 0.1 }}
              className="text-center"
            >
              <div className="font-serif text-white text-2xl sm:text-3xl mb-2 tracking-tight">
                {item.title}
              </div>
              <div className="text-white/70 text-sm leading-snug">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
