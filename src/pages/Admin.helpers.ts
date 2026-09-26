import { configSchema, type SiteConfig } from "../config/schema";
import { resolveHomeContent, type TrustItem } from "../config/homeContent";
import type { ServiceIconName } from "../components/serviceIcons";

export interface FormServiceState {
  id: string;
  title: string;
  description: string;
  included: string;
  icon: string;
}

export interface FormTestimonialState {
  id: string;
  quote: string;
  name: string;
}

export interface FormTrustState {
  id: string;
  icon: ServiceIconName;
  title: string;
  text: string;
}

/**
 * Home page fields edit the EFFECTIVE values. `explicit` remembers which
 * fields the loaded config set; `baseline` holds the initial effective
 * values. On emit, a non explicit field still equal to its baseline is
 * omitted so the fallback (which follows the business details) stays live.
 */
export interface FormHomeState {
  eyebrow: string;
  heroTitle: string;
  heroLead: string;
  footerBlurb: string;
  trust: FormTrustState[];
  explicit: {
    eyebrow: boolean;
    heroTitle: boolean;
    heroLead: boolean;
    footerBlurb: boolean;
    trust: boolean;
  };
  baseline: {
    eyebrow: string;
    heroTitle: string;
    heroLead: string;
    footerBlurb: string;
    trust: string;
  };
}

export interface FormState {
  status: { enabled: boolean; message: string };
  business: SiteConfig["business"];
  home: FormHomeState;
  services: FormServiceState[];
  testimonials: FormTestimonialState[];
  admin: { githubEditUrl: string };
}

function serializeTrust(trust: Array<Omit<TrustItem, never>>): string {
  return JSON.stringify(
    trust.map((t) => ({ icon: t.icon, title: t.title, text: t.text })),
  );
}

let idCounter = 0;
export function newRowId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export function configToForm(cfg: SiteConfig): FormState {
  const effective = resolveHomeContent(cfg);
  return {
    status: { enabled: cfg.status.enabled, message: cfg.status.message },
    business: { ...cfg.business },
    home: {
      eyebrow: effective.eyebrow,
      heroTitle: effective.heroTitle,
      heroLead: effective.heroLead,
      footerBlurb: effective.footerBlurb,
      trust: effective.trust.map((t) => ({
        id: newRowId("tr"),
        icon: t.icon,
        title: t.title,
        text: t.text,
      })),
      explicit: {
        eyebrow: cfg.home?.eyebrow !== undefined,
        heroTitle: cfg.home?.heroTitle !== undefined,
        heroLead: cfg.home?.heroLead !== undefined,
        footerBlurb: cfg.footer?.blurb !== undefined,
        trust: cfg.home?.trust !== undefined,
      },
      baseline: {
        eyebrow: effective.eyebrow,
        heroTitle: effective.heroTitle,
        heroLead: effective.heroLead,
        footerBlurb: effective.footerBlurb,
        trust: serializeTrust(effective.trust),
      },
    },
    services: cfg.services.map((s) => ({
      id: newRowId("s"),
      title: s.title,
      description: s.description,
      included: s.included.join("\n"),
      icon: s.icon ?? "",
    })),
    testimonials: cfg.testimonials.map((t) => ({
      id: newRowId("t"),
      quote: t.quote,
      name: t.name,
    })),
    admin: { githubEditUrl: cfg.admin.githubEditUrl },
  };
}

export function formToConfig(form: FormState): SiteConfig {
  const h = form.home;
  const home: NonNullable<SiteConfig["home"]> = {};
  if (h.explicit.eyebrow || h.eyebrow !== h.baseline.eyebrow) {
    home.eyebrow = h.eyebrow;
  }
  if (h.explicit.heroTitle || h.heroTitle !== h.baseline.heroTitle) {
    home.heroTitle = h.heroTitle;
  }
  if (h.explicit.heroLead || h.heroLead !== h.baseline.heroLead) {
    home.heroLead = h.heroLead;
  }
  const trustNow = serializeTrust(h.trust);
  if (h.explicit.trust || trustNow !== h.baseline.trust) {
    home.trust = h.trust.map((t) => ({
      icon: t.icon,
      title: t.title,
      text: t.text,
    }));
  }
  const includeFooter =
    h.explicit.footerBlurb || h.footerBlurb !== h.baseline.footerBlurb;

  return {
    status: { enabled: form.status.enabled, message: form.status.message },
    business: { ...form.business },
    ...(Object.keys(home).length > 0 ? { home } : {}),
    ...(includeFooter ? { footer: { blurb: h.footerBlurb } } : {}),
    services: form.services.map((s) => {
      const built: SiteConfig["services"][number] = {
        title: s.title,
        description: s.description,
        included: s.included
          .split("\n")
          .filter((line) => line.trim().length > 0),
      };
      if (s.icon) built.icon = s.icon;
      return built;
    }),
    testimonials: form.testimonials.map((t) => ({
      quote: t.quote,
      name: t.name,
    })),
    admin: { githubEditUrl: form.admin.githubEditUrl },
  };
}

export function serializeConfig(cfg: SiteConfig): string {
  return JSON.stringify(cfg, null, 2) + "\n";
}

export function emptyService(): FormServiceState {
  return {
    id: newRowId("s"),
    title: "",
    description: "",
    included: "",
    icon: "calendar",
  };
}

export function emptyTrust(): FormTrustState {
  return {
    id: newRowId("tr"),
    icon: "star",
    title: "",
    text: "",
  };
}

export function emptyTestimonial(): FormTestimonialState {
  return {
    id: newRowId("t"),
    quote: "",
    name: "",
  };
}

export interface ValidatedForm {
  ok: true;
  config: SiteConfig;
  json: string;
}
export interface InvalidForm {
  ok: false;
  message: string;
}

export function validateForm(form: FormState): ValidatedForm | InvalidForm {
  const built = formToConfig(form);
  const parsed = configSchema.safeParse(built);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const path = first?.path.join(".") || "config";
    return { ok: false, message: `${path}: ${first?.message ?? "invalid"}` };
  }
  return { ok: true, config: parsed.data, json: serializeConfig(parsed.data) };
}
