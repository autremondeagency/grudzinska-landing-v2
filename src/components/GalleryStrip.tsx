import AnimatedSection from "./AnimatedSection";
import { IMAGES } from "@/content";

export default function GalleryStrip() {
  const images = [
    { src: IMAGES.consultation, alt: "Konsultacja dietetyczna z pacjentką" },
    { src: IMAGES.online, alt: "Konsultacja online — wideorozmowa" },
  ];

  return (
    <section className="py-16 bg-cream overflow-hidden">
      <AnimatedSection variant="fadeIn">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            {images.map((img: { src: string; alt: string }, i: number) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-xl aspect-[3/2]"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-warm-brown/0 group-hover:bg-warm-brown/10 transition-colors duration-500" />
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
