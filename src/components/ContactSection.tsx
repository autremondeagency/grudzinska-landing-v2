import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, Video, ArrowRight, Check, AlertCircle } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { CONTACT, CONTACT_SECTION, IMAGES } from "@/content";

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = (name: string, value: string) => {
    if (name === "name" && !value.trim()) return "Imię jest wymagane";
    if (name === "phone") {
      if (!value.trim()) return "Numer telefonu jest wymagany";
      if (!/^[+\d\s()-]{7,}$/.test(value.trim())) return "Podaj poprawny numer telefonu";
    }
    if (name === "email" && value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Podaj poprawny adres email";
    return "";
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    const err = validate(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const nameVal = (form.elements.namedItem("name") as HTMLInputElement).value;
    const phoneVal = (form.elements.namedItem("phone") as HTMLInputElement).value;
    const emailVal = (form.elements.namedItem("email") as HTMLInputElement).value;

    const newErrors: Record<string, string> = {
      name: validate("name", nameVal),
      phone: validate("phone", phoneVal),
      email: validate("email", emailVal),
    };
    setErrors(newErrors);
    setTouched({ name: true, phone: true, email: true });

    if (Object.values(newErrors).some((e) => e)) return;

    setSubmitting(true);
    try {
      const formData = new FormData(form);
      const params = new URLSearchParams();
      formData.forEach((value, key) => params.append(key, value.toString()));
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-sand/50 border border-warm-brown-light/40 text-warm-brown placeholder:text-warm-brown/35 focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage/50 transition-all duration-200 text-[0.95rem]";

  return (
    <section id="kontakt" className="relative py-24 lg:py-32 bg-sand overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-sage/[0.04] rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <AnimatedSection className="max-w-2xl mb-14">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-sage mb-3">
            {CONTACT_SECTION.label}
          </span>
          <h2 className="font-serif text-warm-brown text-3xl sm:text-4xl lg:text-[2.75rem] leading-tight mb-5">
            {CONTACT_SECTION.heading}
          </h2>
          <p className="text-warm-brown/70 text-lg leading-relaxed">
            {CONTACT_SECTION.description}
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16">
          {/* Left — Contact info + images */}
          <AnimatedSection variant="slideLeft" delay={0.1}>
            <div className="space-y-6">
              {/* Contact cards */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={CONTACT.phoneRaw}
                  className="group p-4 rounded-xl bg-cream border border-warm-brown-light/30 hover:border-sage/30 transition-all duration-300 hover:shadow-md"
                >
                  <Phone size={18} className="text-sage mb-2" />
                  <div className="text-xs text-warm-brown/50 mb-1">Zadzwoń</div>
                  <div className="text-sm font-semibold text-warm-brown group-hover:text-sage-dark transition-colors">
                    {CONTACT.phone}
                  </div>
                </a>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="group p-4 rounded-xl bg-cream border border-warm-brown-light/30 hover:border-sage/30 transition-all duration-300 hover:shadow-md"
                >
                  <Mail size={18} className="text-sage mb-2" />
                  <div className="text-xs text-warm-brown/50 mb-1">Napisz</div>
                  <div className="text-sm font-semibold text-warm-brown group-hover:text-sage-dark transition-colors truncate">
                    {CONTACT.email}
                  </div>
                </a>
                <div className="p-4 rounded-xl bg-cream border border-warm-brown-light/30">
                  <MapPin size={18} className="text-sage mb-2" />
                  <div className="text-xs text-warm-brown/50 mb-1">Lokalizacja</div>
                  <div className="text-sm font-semibold text-warm-brown">
                    {CONTACT.location}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-cream border border-warm-brown-light/30">
                  <Video size={18} className="text-sage mb-2" />
                  <div className="text-xs text-warm-brown/50 mb-1">Konsultacje</div>
                  <div className="text-sm font-semibold text-warm-brown">
                    Online i stacjonarnie
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="grid grid-cols-2 gap-3">
                <img
                  src={IMAGES.konsultacjaGabinetowa}
                  alt="Anna Grudzińska podczas konsultacji z pacjentką w gabinecie"
                  className="rounded-xl w-full aspect-[4/3] object-cover"
                  loading="lazy"
                />
                <img
                  src={IMAGES.konsultacjaOnline}
                  alt="Anna Grudzińska podczas konsultacji online"
                  className="rounded-xl w-full aspect-[4/3] object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </AnimatedSection>

          {/* Right — Form */}
          <AnimatedSection variant="slideRight" delay={0.2}>
            <div className="bg-cream rounded-2xl p-6 sm:p-8 border border-warm-brown-light/30 shadow-sm">
              <h3 className="font-serif text-warm-brown text-xl mb-1">
                {CONTACT_SECTION.formTitle}
              </h3>
              <p className="text-warm-brown/55 text-sm mb-6">
                {CONTACT_SECTION.formSubtitle}
              </p>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-14 h-14 rounded-full bg-sage/15 flex items-center justify-center mx-auto mb-4">
                      <Check size={28} className="text-sage" />
                    </div>
                    <h4 className="font-serif text-warm-brown text-xl mb-2">
                      {CONTACT_SECTION.successHeading}
                    </h4>
                    <p className="text-warm-brown/65 text-sm mb-4 max-w-sm mx-auto">
                      {CONTACT_SECTION.successMessage}{" "}
                      <a
                        href={CONTACT.phoneRaw}
                        className="text-sage font-semibold hover:underline"
                      >
                        {CONTACT.phone}
                      </a>
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-sm text-sage font-medium hover:underline"
                    >
                      Wyślij kolejną wiadomość
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    name="kontakt"
                    method="POST"
                    data-netlify="true"
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <input type="hidden" name="form-name" value="kontakt" />
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-warm-brown/70 mb-1.5"
                      >
                        Imię i nazwisko *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className={`${inputClass} ${touched.name && errors.name ? "border-terracotta/60 focus:ring-terracotta/30" : ""}`}
                        placeholder="Anna Kowalska"
                        onBlur={handleBlur}
                      />
                      {touched.name && errors.name && (
                        <p className="mt-1 text-xs text-terracotta flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-warm-brown/70 mb-1.5"
                      >
                        Telefon *
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        className={`${inputClass} ${touched.phone && errors.phone ? "border-terracotta/60 focus:ring-terracotta/30" : ""}`}
                        placeholder="+48 600 000 000"
                        onBlur={handleBlur}
                      />
                      {touched.phone && errors.phone && (
                        <p className="mt-1 text-xs text-terracotta flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-warm-brown/70 mb-1.5"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className={`${inputClass} ${touched.email && errors.email ? "border-terracotta/60 focus:ring-terracotta/30" : ""}`}
                        placeholder="anna@email.com"
                        onBlur={handleBlur}
                      />
                      {touched.email && errors.email && (
                        <p className="mt-1 text-xs text-terracotta flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="situation"
                        className="block text-sm font-medium text-warm-brown/70 mb-1.5"
                      >
                        Na jakim etapie jesteś?
                      </label>
                      <select
                        id="situation"
                        name="situation"
                        className={`${inputClass} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%234A3728" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>')] bg-no-repeat bg-[right_1rem_center]`}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Wybierz...
                        </option>
                        {CONTACT_SECTION.situationOptions.map((opt: string) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-warm-brown/70 mb-1.5"
                      >
                        Wiadomość
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={3}
                        className={`${inputClass} resize-none`}
                        placeholder="Opisz krótko swoją sytuację..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="group w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-sage text-white font-semibold rounded-full hover:bg-sage-dark transition-all duration-300 hover:shadow-lg hover:shadow-sage/20 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          {CONTACT_SECTION.submitLabel}
                          <ArrowRight
                            size={18}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </>
                      )}
                    </button>

                    <p className="text-xs text-warm-brown/40 text-center pt-1">
                      {CONTACT_SECTION.privacyNote}
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
