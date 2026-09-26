import { describe, expect, it } from "vitest";
import { defaultConfig, type SiteConfig } from "./schema";
import {
  HERO_LEAD_FALLBACK,
  homeFallbacks,
  resolveHomeContent,
} from "./homeContent";
import { configToForm, formToConfig } from "../pages/Admin.helpers";

describe("resolveHomeContent", () => {
  it("returns fallbacks when the home and footer blocks are absent", () => {
    const content = resolveHomeContent(defaultConfig);
    expect(content.heroTitle).toBe(defaultConfig.business.tagline);
    expect(content.heroLead).toBe(HERO_LEAD_FALLBACK);
    expect(content.eyebrow.startsWith("Residential cleaning in")).toBe(true);
    expect(content.trust).toHaveLength(3);
    expect(content.trust[0].icon).toBe("heart");
    expect(content.footerBlurb).toContain("Licensed and insured");
  });

  it("fallbacks follow the business details", () => {
    const cfg: SiteConfig = {
      ...defaultConfig,
      business: {
        ...defaultConfig.business,
        tagline: "Sparkling homes",
        serviceArea: "Conrad, MT and nearby",
      },
    };
    const content = resolveHomeContent(cfg);
    expect(content.heroTitle).toBe("Sparkling homes");
    expect(content.eyebrow).toBe("Residential cleaning in Conrad, MT");
    expect(content.footerBlurb).toContain("Conrad, MT and nearby");
  });

  it("uses configured values when present", () => {
    const cfg: SiteConfig = {
      ...defaultConfig,
      home: {
        eyebrow: "Custom eyebrow",
        heroTitle: "Custom title",
        heroLead: "Custom lead",
        trust: [{ icon: "shield", title: "Insured", text: "Fully covered" }],
      },
      footer: { blurb: "Custom blurb" },
    };
    const content = resolveHomeContent(cfg);
    expect(content.eyebrow).toBe("Custom eyebrow");
    expect(content.heroTitle).toBe("Custom title");
    expect(content.heroLead).toBe("Custom lead");
    expect(content.trust).toEqual([
      { icon: "shield", title: "Insured", text: "Fully covered" },
    ]);
    expect(content.footerBlurb).toBe("Custom blurb");
  });
});

describe("admin emit of home fields", () => {
  it("omits untouched fields so fallbacks stay live", () => {
    const form = configToForm(defaultConfig);
    const out = formToConfig(form);
    expect(out.home).toBeUndefined();
    expect(out.footer).toBeUndefined();
  });

  it("includes only the edited fields", () => {
    const form = configToForm(defaultConfig);
    form.home.heroTitle = "A new title";
    form.home.trust[0].title = "Locally owned";
    const out = formToConfig(form);
    expect(out.home?.heroTitle).toBe("A new title");
    expect(out.home?.eyebrow).toBeUndefined();
    expect(out.home?.heroLead).toBeUndefined();
    expect(out.home?.trust?.[0].title).toBe("Locally owned");
    expect(out.footer).toBeUndefined();
  });

  it("keeps fields that the loaded config set explicitly", () => {
    const cfg: SiteConfig = {
      ...defaultConfig,
      home: { heroTitle: "Explicit title" },
      footer: { blurb: "Explicit blurb" },
    };
    const form = configToForm(cfg);
    const out = formToConfig(form);
    expect(out.home?.heroTitle).toBe("Explicit title");
    expect(out.footer?.blurb).toBe("Explicit blurb");
  });

  it("round trips fallback derivation", () => {
    const fallbacks = homeFallbacks(defaultConfig);
    expect(fallbacks.heroTitle).toBe(defaultConfig.business.tagline);
  });
});
