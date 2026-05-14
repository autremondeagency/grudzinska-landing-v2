import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone } from "lucide-react";
import { CONTACT } from "@/content";

export default function MobileCTA() {
  const [visible, setVisible] = useState(false);
  const [atFooter, setAtFooter] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 150);
      const footer = document.querySelector("footer");
      if (footer) {
        const rect = footer.getBoundingClientRect();
        setAtFooter(rect.top < window.innerHeight);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && !atFooter && (
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
      )}
    </AnimatePresence>
  );
}
