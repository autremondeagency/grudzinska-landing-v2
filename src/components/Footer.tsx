import { Phone, Mail } from "lucide-react";
import { CONTACT } from "@/content";

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

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

        {/* Social + legal links */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Social icons */}
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/15 transition-all duration-200"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/15 transition-all duration-200"
            >
              <FacebookIcon />
            </a>
          </div>

          {/* Legal links */}
          <div className="flex items-center gap-6 text-xs text-white/40">
            <a href="#" className="hover:text-white/70 transition-colors duration-200">
              Polityka prywatności
            </a>
            <a href="#" className="hover:text-white/70 transition-colors duration-200">
              Regulamin
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
