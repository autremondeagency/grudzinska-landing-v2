/**
 * Pixel tracking utility — fires Meta Pixel events for engagement signals.
 * Initialized once in main.tsx after fbq('init').
 *
 * Standard events:
 *   - PageView             (in main.tsx, on init)
 *   - ViewContent          (scroll > 50%)
 *   - Contact              (clicks on tel:/mailto:)
 *   - Schedule             (CTA click to book consultation)
 *   - InitiateCheckout     (contact section reached, 25% visible)
 *   - Lead                 (in ContactSection, on form submit)
 *   - CompleteRegistration (in ContactSection, on form submit)
 *
 * Custom events:
 *   - ScrollDepth75    (scroll > 75%)
 *   - PhoneClick       (click on tel: — alongside Contact)
 *   - EmailClick       (click on mailto: — alongside Contact)
 *   - CTAClick         (click CTA — alongside Schedule, max 1× session)
 *   - FAQOpen          (FAQ accordion opened)
 *   - TimeOnPage_2min  (2 minutes engaged on page)
 *
 * Advanced Matching: After form submit, ContactSection calls setUserData()
 * which stores user data in sessionStorage and re-inits the Pixel so all
 * subsequent events include user_data → much better match quality + custom
 * audiences. On page reload within session, init restores user data.
 */

type Fbq = (...args: unknown[]) => void;

const STORAGE_KEY = "fbq_user_data";

interface UserData {
  em?: string;
  ph?: string;
  fn?: string;
  ln?: string;
  ct?: string;
  country?: string;
}

function getFbq(): Fbq | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & { fbq?: Fbq };
  return typeof w.fbq === "function" ? w.fbq : null;
}

function getPixelId(): string | null {
  return (import.meta.env.VITE_META_PIXEL_ID as string | undefined) || null;
}

function getStoredUserData(): UserData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserData) : null;
  } catch {
    return null;
  }
}

/**
 * Called from ContactSection after successful form submit.
 * Stores user data and re-inits the Pixel so all subsequent events
 * include advanced matching params (em, ph, fn, ln, country).
 * Meta Pixel auto-hashes em/ph/fn/ln client-side before sending.
 */
export function setUserData(data: {
  name?: string;
  email?: string;
  phone?: string;
}) {
  if (typeof window === "undefined") return;
  const fbq = getFbq();
  if (!fbq) return;
  const pixelId = getPixelId();
  if (!pixelId) return;

  const nameParts = (data.name || "").trim().split(/\s+/);
  const userData: UserData = {};
  if (data.email?.trim()) userData.em = data.email.trim().toLowerCase();
  if (data.phone?.trim()) userData.ph = data.phone.replace(/\D/g, "");
  if (nameParts[0]) userData.fn = nameParts[0].toLowerCase();
  if (nameParts.length > 1)
    userData.ln = nameParts.slice(1).join(" ").toLowerCase();
  userData.country = "pl";

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  } catch {
    // quota / private mode — ignore
  }

  // Re-init Pixel with user data. Pixel auto-hashes em/ph/fn/ln.
  fbq("init", pixelId, userData);
}

let scrolled50 = false;
let scrolled75 = false;
let ctaClickFired = false;
let initiateCheckoutFired = false;
let timeOnPageFired = false;

function trackScrollDepth() {
  const fbq = getFbq();
  if (!fbq) return;

  const totalHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  if (totalHeight <= 0) return;
  const pct = window.scrollY / totalHeight;

  if (!scrolled50 && pct >= 0.5) {
    scrolled50 = true;
    fbq("track", "ViewContent", { content_name: "landing_scroll_50" });
  }
  if (!scrolled75 && pct >= 0.75) {
    scrolled75 = true;
    fbq("trackCustom", "ScrollDepth75", {
      content_name: "landing_scroll_75",
    });
  }
}

function handleClick(e: MouseEvent) {
  const fbq = getFbq();
  if (!fbq) return;

  const target = e.target as HTMLElement | null;
  if (!target) return;
  const link = target.closest("a, button") as
    | HTMLAnchorElement
    | HTMLButtonElement
    | null;
  if (!link) return;

  const href =
    link instanceof HTMLAnchorElement ? link.getAttribute("href") || "" : "";

  // Telephone — high intent
  if (href.startsWith("tel:")) {
    fbq("track", "Contact", { content_name: "phone_click" });
    fbq("trackCustom", "PhoneClick", { phone: href.replace("tel:", "") });
    return;
  }

  // Email — high intent
  if (href.startsWith("mailto:")) {
    fbq("track", "Contact", { content_name: "email_click" });
    fbq("trackCustom", "EmailClick", { email: href.replace("mailto:", "") });
    return;
  }

  // CTA detection (link to #kontakt or consultation-related text)
  const textContent = (link.textContent || "").toLowerCase();
  const isCTAByHref = href.includes("#kontakt") || href.includes("#contact");
  const isCTAByText =
    textContent.includes("konsultac") ||
    textContent.includes("zarezerwuj") ||
    textContent.includes("umów") ||
    textContent.includes("porozmawiaj") ||
    textContent.includes("skontaktuj");

  if (isCTAByHref || isCTAByText) {
    // Standard Schedule event — Meta optimizes well for it (book consultation intent)
    fbq("track", "Schedule", {
      content_name: "consultation_cta",
      content_category: "bariatric_consultation",
    });
    // Custom CTAClick — max 1× per session for clean funnel data
    if (!ctaClickFired) {
      ctaClickFired = true;
      fbq("trackCustom", "CTAClick", {
        cta_text: link.textContent?.trim().slice(0, 60) || "",
        cta_href: href,
      });
    }
  }
}

function setupInitiateCheckout() {
  const fbq = getFbq();
  if (!fbq) return;

  const contactSection = document.getElementById("kontakt");
  if (!contactSection) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !initiateCheckoutFired) {
          initiateCheckoutFired = true;
          fbq("track", "InitiateCheckout", {
            content_name: "contact_form_visible",
          });
          observer.disconnect();
        }
      }
    },
    { threshold: 0.25 }
  );

  observer.observe(contactSection);
}

function setupTimeOnPage() {
  setTimeout(() => {
    if (timeOnPageFired) return;
    timeOnPageFired = true;
    const fbq = getFbq();
    if (!fbq) return;
    fbq("trackCustom", "TimeOnPage_2min", {
      content_name: "engaged_visitor",
    });
  }, 120_000);
}

/**
 * Public API for FAQSection — fire FAQOpen when accordion expanded.
 */
export function trackFAQOpen(question: string) {
  const fbq = getFbq();
  if (!fbq) return;
  fbq("trackCustom", "FAQOpen", {
    content_name: question.slice(0, 80),
  });
}

export function initPixelTracking() {
  if (typeof window === "undefined") return;

  // Restore advanced matching if user already submitted in this session
  const stored = getStoredUserData();
  if (stored && Object.keys(stored).length > 0) {
    const pixelId = getPixelId();
    const fbq = getFbq();
    if (pixelId && fbq) {
      fbq("init", pixelId, stored);
    }
  }

  // Scroll depth — throttled via rAF
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          trackScrollDepth();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  // Global click capture — catches all anchors/buttons
  document.addEventListener("click", handleClick, { capture: true });

  // Contact section visibility → InitiateCheckout
  // React mounts asynchronously — give it a tick before observing
  const mountTrackers = () => {
    setupInitiateCheckout();
    setupTimeOnPage();
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(mountTrackers, 500);
    });
  } else {
    setTimeout(mountTrackers, 500);
  }
}
