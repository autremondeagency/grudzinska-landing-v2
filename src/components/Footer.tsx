import { Phone, Mail } from "lucide-react";
import { CONTACT } from "@/content";

export default function Footer() {
  return (
    <footer className="bg-warm-brown text-white/80 py-12 lg:py-16">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          {/* Logo + info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-serif text-xl text-white border border-white/10">
              AG
            </div>
            <div>
              <div className="font-serif text-white text-lg">Anna Krawczyk-Grudzińska</div>
              <div className="text-white/50 text-sm">Dietetyk bariatryczny</div>
            </div>
          </div>

          {/* Contact links */}
          <div className="flex items-center gap-5">
            <a
              href={CONTACT.phoneRaw}
              className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors duration-200"
            >
              <Phone size={15} />
              {CONTACT.phone}
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors duration-200"
            >
              <Mail size={15} />
              {CONTACT.email}
            </a>
          </div>
        </div>

        {/* Legal links */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-xs text-white/40">
            Konsultacje dietetyczne — Legionowo + online (cała Polska)
          </div>
          <div className="flex items-center gap-6 text-xs text-white/40">
            <a href="/privacy.html" className="hover:text-white/70 transition-colors duration-200">
              Polityka prywatności
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 text-center">
          <p className="text-xs text-white/35">
            &copy; {new Date().getFullYear()} Anna Krawczyk-Grudzińska. Wszelkie prawa
            zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  );
}
