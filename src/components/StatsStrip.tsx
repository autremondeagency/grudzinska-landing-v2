import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { STATS } from "@/content";

function useCountUp(end: number, inView: boolean, duration = 1.8) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [inView, end, duration]);

  return value;
}

function parseStatValue(value: string): { num: number; prefix: string; suffix: string } {
  const match = value.match(/^([^\d]*)(\d+)(.*)$/);
  if (!match) return { num: 0, prefix: "", suffix: value };
  return { num: parseInt(match[2], 10), prefix: match[1], suffix: match[3] };
}

function AnimatedStat({ value, inView }: { value: string; inView: boolean }) {
  const { num, prefix, suffix } = parseStatValue(value);
  const animated = useCountUp(num, inView);
  return <>{prefix}{animated}{suffix}</>;
}

export default function StatsStrip() {
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
          {STATS.items.map((stat: { value: string; label: string }, i: number) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 * i + 0.1 }}
              className="text-center"
            >
              <div className="font-serif text-white text-3xl sm:text-4xl lg:text-5xl mb-1">
                <AnimatedStat value={stat.value} inView={inView} />
              </div>
              <div className="text-white/60 text-sm font-medium tracking-wide uppercase">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
