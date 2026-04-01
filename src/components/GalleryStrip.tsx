import AnimatedSection from "./AnimatedSection";
import { IMAGES } from "@/content";

export default function GalleryStrip() {
  const images = [
    { src: IMAGES.market, alt: "Anna na targu wybiera świeże warzywa i owoce" },
    { src: IMAGES.konsultacjaGabinetowa, alt: "Anna podczas konsultacji z pacjentką w gabinecie" },
    { src: IMAGES.przygotowaniePosilku, alt: "Przygotowanie zdrowego posiłku — kolorowe warzywa na desce" },
    { src: IMAGES.konsultacjaOnline, alt: "Anna podczas konsultacji online z domu" },
  ];

  return (
    <section className="py-16 bg-cream overflow-hidden">
      <AnimatedSection variant="fadeIn">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
            {images.map((img, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-xl aspect-[4/3]"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
