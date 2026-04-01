import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import StatsStrip from "@/components/StatsStrip";
import AboutSection from "@/components/AboutSection";
import ForWhomSection from "@/components/ForWhomSection";
import WhySection from "@/components/WhySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import HowSection from "@/components/HowSection";
import GalleryStrip from "@/components/GalleryStrip";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import MobileCTA from "@/components/MobileCTA";

export default function App() {
  return (
    <>
      <a href="#kontakt" className="skip-link">
        Przejdź do kontaktu
      </a>
      <Navigation />
      <main id="main">
        <HeroSection />
        <StatsStrip />
        <AboutSection />
        <ForWhomSection />
        <WhySection />
        <TestimonialsSection />
        <HowSection />
        <GalleryStrip />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
      <MobileCTA />
    </>
  );
}
