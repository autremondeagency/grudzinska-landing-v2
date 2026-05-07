// All Polish copy, image URLs, and contact info in one place

const base = import.meta.env.BASE_URL;

export const IMAGES = {
  hero: `${base}images/hero.webp`,
  about: `${base}images/about.webp`,
  consultation: `${base}images/consultation.webp`,
};

export const CONTACT = {
  phone: "+48 608 571 739",
  phoneRaw: "tel:+48608571739",
  email: "dietetyk.grudzinska@gmail.com",
  location: "Legionowo",
};

export const NAV_LINKS = [
  { label: "O mnie", href: "#o-mnie" },
  { label: "Dla kogo", href: "#dla-kogo" },
  { label: "Dlaczego warto", href: "#dlaczego-warto" },
  { label: "Kontakt", href: "#kontakt" },
];

export const HERO = {
  badge: "Dietetyk bariatryczny • Legionowo",
  heading: "Przygotuję cię do operacji bariatrycznej",
  headingAccent: "z profesjonalną pomocą",
  description:
    "Jestem jedną z niewielu wyspecjalizowanych dietetyczek bariatrycznych w Polsce. Pomogę Ci przejść przez cały proces — od decyzji, przez przygotowanie, aż po pełną rekonwalescencję.",
  cta: "Zarezerwuj darmową konsultację",
  phoneLabel: "608 571 739",
};

export const ABOUT = {
  label: "O mnie",
  name: "Anna Krawczyk-Grudzińska",
  paragraphs: [
    "Specjalizuję się w przygotowaniu pacjentów do operacji bariatrycznej — czyli osób z otyłością, które zdecydowały się na chirurgiczne zmniejszenie żołądka jako metodę redukcji masy ciała.",
    "W Polsce aktualnie nie ma wielu wyspecjalizowanych dietetyków bariatrycznych. Wypełniam tę lukę, oferując kompleksowe wsparcie dietetyczne na każdym etapie Twojej drogi.",
    "Wiem, że to nie jest łatwa decyzja. Dlatego zaczynam od darmowej konsultacji — żebyś mogła spokojnie porozmawiać, zadać pytania i dowiedzieć się, jak mogę Ci pomóc.",
  ],
  badges: [
    { icon: "award", title: "Specjalizacja bariatryczna", subtitle: "Skupiam się wyłącznie na dietetyce okołościśłeżnej" },
    { icon: "heartPulse", title: "Pełna ścieżka", subtitle: "Wsparcie przed operacją, w trakcie i po zabiegu" },
    { icon: "video", title: "Konsultacje online", subtitle: "Pacjentki z całej Polski — bez względu na miejsce" },
  ],
};

export const FOR_WHOM = {
  label: "Dla kogo",
  heading: "Na każdym etapie Twojej drogi",
  description:
    "Niezależnie od tego, na jakim etapie jesteś — dopiero rozważasz operację, masz już termin, czy jesteś po zabiegu — mogę Ci pomóc.",
  cards: [
    {
      number: "01",
      title: "Rozważasz operację",
      description:
        "Nie podjęłaś jeszcze decyzji, ale temat pracuje Ci w głowie. Wyjaśnię na czym polega operacja i z czym się wiąże.",
    },
    {
      number: "02",
      title: "Masz termin operacji",
      description:
        "Musisz schudnąć ~10% masy ciała i zmienić nawyki PRZED operacją. Przygotujemy Cię razem — ciało i umysł.",
    },
    {
      number: "03",
      title: "Operacja za chwilę",
      description:
        "Dieta 1000 kcal przygotowująca do operacji, suplementacja, nauka powolnego jedzenia — kluczowe umiejętności do opanowania.",
    },
    {
      number: "04",
      title: "Po operacji",
      description:
        "Żołądek wielkości jajka, 6-7 małych posiłków dziennie. Pomogę Ci wrócić do zdrowia szybciej i bezpieczniej.",
    },
  ],
};

export const WHY = {
  label: "Dlaczego warto",
  heading: "Co się dzieje bez przygotowania?",
  description:
    "NFZ refunduje operację bariatryczną, ale nie zapewnia przygotowania psychodietetycznego. Pacjent idzie na stół operacyjny bez zmiany nawyków.",
  without: [
    "Dumping syndrome — skoki cukru, ciśnienia, kołatanie serca",
    "Wymioty przy zbyt szybkim jedzeniu",
    "Utrata masy mięśniowej zamiast tłuszczu",
    "Niedobory żywieniowe i wyczeńczenie",
    "Powrót do starej wagi",
    "Ryzyko przejścia w inne nałogi",
  ],
  with: [
    "Bezpieczna redukcja 10% masy ciała przed operacją",
    "Nauka powolnego jedzenia — mniej problemów po zabiegu",
    "Zmiana nawyków i schematów myślowych",
    "Krótsza i łatwiejsza rekonwalescencja",
    "Prawidłowa suplementacja od pierwszego dnia",
    "Wsparcie dietetyczne na każdym etapie",
  ],
  quote:
    "Problem jest w głowie, nie w żołądku. To uzależnienie od dopaminy — podobne do alkoholizmu. Bez zmiany sposobu myślenia operacja może pogorszyć sytuację.",
};

export const HOW = {
  label: "Jak to wygląda",
  heading: "Trzy proste kroki",
  steps: [
    {
      number: 1,
      title: "Darmowa konsultacja",
      description:
        "Wypełnij formularz lub zadzwoń. Porozmawiamy o Twojej sytuacji — bez zobowiązań, bez presji. To czas dla Ciebie.",
    },
    {
      number: 2,
      title: "Indywidualny plan",
      description:
        "Przygotowuję plan dietetyczny dopasowany do Twojego etapu — przed decyzją, przed operacją lub po zabiegu.",
    },
    {
      number: 3,
      title: "Stałe wsparcie",
      description:
        "Prowadzę Cię przez cały proces. Regularne konsultacje, dostosowywanie planu, wsparcie dietetyczne.",
    },
  ],
};

export const CONTACT_SECTION = {
  label: "Kontakt",
  heading: "Umów darmową konsultację",
  description:
    "Pierwszy krok jest najtrudniejszy. Ale nie musisz go robić sama. Napisz lub zadzwoń — odezwę się w ciągu 24 godzin.",
  formTitle: "Formularz kontaktowy",
  formSubtitle:
    "Wypełnij formularz, a odezwę się do Ciebie w ciągu 24 godzin.",
  situationOptions: [
    "Rozważam operację bariatryczną",
    "Mam termin operacji",
    "Operacja za chwilę",
    "Jestem po operacji",
    "Inne",
  ],
  submitLabel: "Wyślij i zarezerwuj termin",
  privacyNote:
    "Twoje dane są bezpieczne. Kontaktuję się wyłącznie w sprawie konsultacji. Więcej w",
  privacyLinkLabel: "Polityce prywatności",
  privacyLinkHref: "/privacy.html",
  consentLabel: "Zgadzam się na kontakt w sprawie konsultacji oraz na przetwarzanie moich danych zgodnie z",
  successHeading: "Dziękuję za wiadomość!",
  successMessage:
    "Skontaktuję się z Tobą najszybciej jak to możliwe. Jeśli wolisz porozmawiać od razu — zadzwoń pod numer",
};

export const FAQ = {
  label: "Częste pytania",
  heading: "Pytania, które dostaję najczęściej",
  subheading: "Jeśli Twojego pytania tu nie ma — napisz. Odpowiem osobiście.",
  items: [
    {
      question: "Ile kosztuje współpraca?",
      answer: "Pierwsza rozmowa jest całkowicie darmowa — 15-20 minut, żebyśmy mogły się poznać i zobaczyć, czy mogę Ci pomóc. Dalszą współpracę i pakiety opieki omawiam indywidualnie, bo każda sytuacja jest inna.",
    },
    {
      question: "Jak długo trwa przygotowanie do operacji?",
      answer: "To zależy od Twojej sytuacji — od terminu zabiegu, od tego ile trzeba schudnąć, od Twojego zdrowia. Zwykle pracujemy razem od 2 do 6 miesięcy przed operacją. Ale nie chodzi o „szybko” — chodzi o to, żebyś weszła na salę przygotowana fizycznie i psychicznie.",
    },
    {
      question: "Czy konsultacje mogą być online?",
      answer: "Tak, większość moich pacjentek pracuje ze mną zdalnie. Spotykamy się na wideokonsultacji — potrzebujesz tylko telefonu lub komputera. Działa to tak samo dobrze jak spotkanie na żywo, a często nawet lepiej, bo możesz porozmawiać z domu, w swoim tempie.",
    },
    {
      question: "Co jeśli nie schudnę? Co jeśli to nie zadziała?",
      answer: "Rozumiem ten strach — pewnie nie raz próbowałaś i nie raz się nie udało. Ale tu nie chodzi o kolejną dietę cud. Pracujemy nad tym, dlaczego jesz — nad mechanizmami, nawykami, emocjami. To proces, nie sprint. A ja idę z Tobą przez cały ten proces.",
    },
    {
      question: "Czy muszę być już po decyzji o operacji?",
      answer: "Nie. Dużo moich pacjentek przychodzi na etapie „myślę o tym, ale nie wiem”. I to jest świetny moment, żeby porozmawiać. Pomagam Ci uporządkować informacje, rozważyć opcje i podjąć decyzję, która będzie Twoja — nie chirurga, nie rodziny, Twoja.",
    },
    {
      question: "Czy pomagasz też po operacji?",
      answer: "Tak, i uważam, że to kluczowy etap. Pierwsze miesiące po zabiegu to dieta płynna, papkowata, potem stopniowe rozszerzanie. Ciało zmienia się szybciej niż głowa. Wspieram Cię dietetycznie — żebyś nie została sama z żołądkiem wielkości jajka i zerową instrukcją obsługi.",
    },
    {
      question: "Czym różnisz się od „zwykłego” dietetyka?",
      answer: "Specjalizuję się w żywieniu bariatrycznym. To nie jest kwestia napisania jadłospisu na 1200 kcal. Pracuję z mechanizmami jedzenia emocjonalnego, z konkretnymi wymaganiami dietetycznymi przed i po zabiegu. Jestem jedną z niewielu specjalistek w Polsce, które łączą te wszystkie obszary.",
    },
    {
      question: "Nie mieszkam w Twoim mieście. Czy to problem?",
      answer: "W ogóle nie. Pracuję z pacjentkami z całej Polski. Wszystko odbywa się online — konsultacje, jadłospisy, wsparcie między spotkaniami. Odległość nie jest przeszkodą.",
    },
  ],
};

export const PILLARS = {
  items: [
    { title: "Specjalizacja", label: "Wyłącznie bariatria — nie ogólna dietetyka" },
    { title: "Pełna ścieżka", label: "Przed operacją, w trakcie i po zabiegu" },
    { title: "Online", label: "Konsultacje dla pacjentek z całej Polski" },
    { title: "Indywidualnie", label: "Plan dopasowany do Twojego etapu i sytuacji" },
  ],
};
