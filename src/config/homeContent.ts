import type { SiteConfig } from "./schema";
import type { ServiceIconName } from "../components/serviceIcons";
import { serviceAreaCity } from "../lib/serviceArea";

export interface TrustItem {
  icon: ServiceIconName;
  title: string;
  text: string;
}

export interface HomeContent {
  eyebrow: string;
  heroTitle: string;
  heroLead: string;
  trust: TrustItem[];
  footerBlurb: string;
}

export const HERO_LEAD_FALLBACK =
  "NeatBliss is a family run home cleaning service. Recurring cleans, deep cleans, and move in or move out cleans, all done with care by people who treat your home like their own.";

/**
 * The values the home page and footer show when the config leaves the
 * matching fields unset. Derived fields follow the business details, so
 * an unset field keeps tracking edits to the tagline or service area.
 */
export function homeFallbacks(config: SiteConfig): HomeContent {
  const { business } = config;
  return {
    eyebrow: `Residential cleaning in ${serviceAreaCity(business.serviceArea)}`,
    heroTitle: business.tagline,
    heroLead: HERO_LEAD_FALLBACK,
    trust: [
      {
        icon: "heart",
        title: "Family owned",
        text: "Run by people who care about your home",
      },
      {
        icon: "sparkles",
        title: "One year in business",
        text: "And just getting started",
      },
      {
        icon: "pin",
        title: `Serving ${business.serviceArea}`,
        text: "",
      },
    ],
    footerBlurb: `Family run home cleaning serving ${business.serviceArea}. Licensed and insured.`,
  };
}

/** The content to render: config values where set, fallbacks otherwise. */
export function resolveHomeContent(config: SiteConfig): HomeContent {
  const fallbacks = homeFallbacks(config);
  const home = config.home;
  return {
    eyebrow: home?.eyebrow ?? fallbacks.eyebrow,
    heroTitle: home?.heroTitle ?? fallbacks.heroTitle,
    heroLead: home?.heroLead ?? fallbacks.heroLead,
    trust: (home?.trust as TrustItem[] | undefined) ?? fallbacks.trust,
    footerBlurb: config.footer?.blurb ?? fallbacks.footerBlurb,
  };
}
