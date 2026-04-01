import { Award, HeartPulse, Brain, Video } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { ABOUT, IMAGES } from "@/content";

const badgeIconMap: Record<string, typeof Award> = {
  award: Award,
  heartPulse: HeartPulse,
  brain: Brain,
  video: Video,
};

export default function AboutSection() {
  return (
    <section id="o-mnie" className="relative py-24 lg:py-32 bg-sand overflow-hidden">
      {/* Organic shape */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-sage/[0.06] rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-[0.85fr_1fr] gap-12 lg:gap-20 items-center">
          {/* Image */}
          <AnimatedSection variant="slideLeft" className="relative">
            <div className="relative">
              {/* Rotated background frame */}
              <div className="absolute inset-0 bg-sage/15 rounded-2xl rotate-3 scale-[1.03]" />
              <div className="absolute inset-0 bg-terracotta/8 rounded-2xl -rotate-2 scale-[1.02]" />
              <img
                src={IMAGES.about}
                alt="Anna Krawczyk-Grudzińska — dietetyk bariatryczny"
                className="relative rounded-2xl w-full aspect-[3/4] object-cover shadow-xl"
                loading="lazy"
              />
            </div>
          </AnimatedSection>

          {/* Copy */}
          <div>
            <AnimatedSection variant="fadeUp">
              <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-sage mb-3">
                {ABOUT.label}
              </span>
              <h2 className="font-serif text-warm-brown text-3xl sm:text-4xl lg:text-[2.75rem] leading-tight mb-8">
                {ABOUT.name}
              </h2>
            </AnimatedSection>

            <div className="space-y-5">
              {ABOUT.paragraphs.map((p: string, i: number) => (
                <AnimatedSection key={i} variant="fadeUp" delay={0.1 * (i + 1)}>
                  <p className="text-warm-brown/75 leading-relaxed text-[1.05rem]">
                    {i === 2 ? (
                      <>
                        {p.split("darmowej konsultacji")[0]}
                        <strong className="text-warm-brown font-semibold">
                          darmowej konsultacji
                        </strong>
                        {p.split("darmowej konsultacji")[1]}
                      </>
                    ) : (
                      p
                    )}
                  </p>
                </AnimatedSection>
              ))}
            </div>

            {/* Trust badges */}
            <AnimatedSection variant="fadeUp" delay={0.4}>
              <div className="grid grid-cols-2 gap-3 mt-8">
                {ABOUT.badges.map((badge) => {
                  const Icon = badgeIconMap[badge.icon] || Award;
                  return (
                    <div
                      key={badge.title}
                      className="flex items-start gap-3 p-3 rounded-xl bg-cream border border-warm-brown-light/40"
                    >
                      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-sage/12 flex items-center justify-center">
                        <Icon size={17} className="text-sage" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-warm-brown leading-snug">
                          {badge.title}
                        </div>
                        <div className="text-xs text-warm-brown/55 mt-0.5 leading-snug">
                          {badge.subtitle}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
