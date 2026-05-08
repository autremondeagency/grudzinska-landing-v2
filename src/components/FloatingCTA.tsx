import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, ArrowRight } from "lucide-react";
import { CONTACT } from "@/content";

/**
 * Always-visible CTA — mobile bottom bar + desktop floating pill.
 * Visible after 400px scroll, hides when contact section is in view.
 */
export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [atContact, setAtContact] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
      const contact = document.getElementById("kontakt");
      const footer = document.querySelector("footer");
      const inContact =
        (contact && contact.getBoundingClientRect().top < window.innerHeight - 200) ||
        (footer && footer.getBoundingClientRect().top < window.innerHeight);
      setAtContact(Boolean(inContact));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && !atContact && (
        <>
          {/* MOBILE — full-width bottom bar */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
          >
            <div className="flex gap-2 p-3 bg-cream/95 backdrop-blur-md border-t border-warm-brown-light/30 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
              <a
                href={CONTACT.phoneRaw}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-sage text-white font-semibold rounded-full text-sm"
              >
                <Phone size={16} />
                Zadzwoń
              </a>
              <a
                href="#kontakt"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-terracotta text-white font-semibold rounded-full text-sm"
              >
                Darmowa konsultacja
              </a>
            </div>
          </motion.div>

          {/* DESKTOP — floating pill bottom-right */}
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.92 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed bottom-6 right-6 z-40 hidden md:flex flex-col items-end gap-3"
          >
            <a
              href="#kontakt"
              className="group flex items-center gap-2.5 pl-5 pr-4 py-3.5 bg-sage hover:bg-sage-dark text-white font-semibold rounded-full text-base shadow-2xl shadow-sage/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sage/40"
            >
              <span className="relative flex w-2 h-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cream opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cream" />
              </span>
              Darmowa konsultacja
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </a>
            <a
              href={CONTACT.phoneRaw}
              className="flex items-center gap-2 pl-4 pr-3.5 py-2 bg-cream/95 backdrop-blur border border-warm-brown-light/40 hover:border-sage/40 text-warm-brown text-sm font-medium rounded-full shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <Phone size={14} className="text-sage" />
              {CONTACT.phone}
            </a>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
