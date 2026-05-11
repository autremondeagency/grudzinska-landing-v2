/**
 * Pixel tracking utility — fires Meta Pixel events for engagement signals.
 * Initialized once in main.tsx after fbq('init').
 *
 * Events fired:
 *   - PageView         (in main.tsx, on init)
 *   - ViewContent      (scroll > 50%)
 *   - ScrollDepth75    (scroll > 75% — custom event)
 *   - PhoneClick       (click on tel: link — custom)
 *   - EmailClick       (click on mailto: link — custom)
 *   - CTAClick         (click on any element linking to #kontakt or with CTA text — custom)
 *   - Contact          (Meta standard event — fired alongside PhoneClick/EmailClick for stronger intent)
 *   - Lead             (in ContactSection, on form submit)
 *
 * All events use either fbq('track', 'StandardName') for Meta-recognized events,
 * or fbq('trackCustom', 'CustomName') for custom tracking. Both go into the Pixel.
 */

type Fbq = (...args: unknown[]) => void;

function getFbq(): Fbq | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & { fbq?: Fbq };
  return typeof w.fbq === "function" ? w.fbq : null;
}

let scrolled50 = false;
let scrolled75 = false;
let ctaClickFired = false; // Fire CTAClick max once per session

function trackScrollDepth() {
  const fbq = getFbq();
  if (!fbq) return;

  const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (totalHeight <= 0) return;
  const pct = window.scrollY / totalHeight;

  if (!scrolled50 && pct >= 0.5) {
    scrolled50 = true;
    fbq("track", "ViewContent", { content_name: "landing_scroll_50" });
  }
  if (!scrolled75 && pct >= 0.75) {
    scrolled75 = true;
    fbq("trackCustom", "ScrollDepth75", { content_name: "landing_scroll_75" });
  }
}

function handleClick(e: MouseEvent) {
  const fbq = getFbq();
  if (!fbq) return;

  const target = e.target as HTMLElement | null;
  if (!target) return;
  const link = target.closest("a, button") as HTMLAnchorElement | HTMLButtonElement | null;
  if (!link) return;

  // Anchor href detection
  const href = link instanceof HTMLAnchorElement ? link.getAttribute("href") || "" : "";

  // Telephone clicks — strong intent
  if (href.startsWith("tel:")) {
    fbq("track", "Contact", { content_name: "phone_click" });
    fbq("trackCustom", "PhoneClick", { phone: href.replace("tel:", "") });
    return;
  }

  // Email clicks
  if (href.startsWith("mailto:")) {
    fbq("track", "Contact", { content_name: "email_click" });
    fbq("trackCustom", "EmailClick", { email: href.replace("mailto:", "") });
    return;
  }

  // CTA clicks — any link to #kontakt or button/link with consultation-related text
  const textContent = (link.textContent || "").toLowerCase();
  const isCTAByHref = href.includes("#kontakt") || href.includes("#contact");
  const isCTAByText =
    textContent.includes("konsultac") ||
    textContent.includes("zarezerwuj") ||
    textContent.includes("umów") ||
    textContent.includes("porozmawiaj") ||
    textContent.includes("skontaktuj");

  if ((isCTAByHref || isCTAByText) && !ctaClickFired) {
    ctaClickFired = true;
    fbq("trackCustom", "CTAClick", {
      cta_text: link.textContent?.trim().slice(0, 60) || "",
      cta_href: href,
    });
  }
}

export function initPixelTracking() {
  if (typeof window === "undefined") return;

  // Scroll depth tracking — passive listener, throttled by requestAnimationFrame
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

  // Capture clicks globally on document — catches all anchors/buttons
  document.addEventListener("click", handleClick, { capture: true });
}
