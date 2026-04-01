import AnimatedSection from "./AnimatedSection";
import { IMAGES } from "@/content";

export default function GalleryStrip() {
  return (
    <section className="py-16 bg-cream overflow-hidden">
      <AnimatedSection variant="fadeIn">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="group relative overflow-hidden rounded-2xl aspect-[2/1] sm:aspect-[5/2]">
            <img
              src={IMAGES.consultation}
              alt="Konsultacja dietetyczna z pacjentką"
              loading="lazy"
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-warm-brown/0 group-hover:bg-warm-brown/10 transition-colors duration-500" />
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
