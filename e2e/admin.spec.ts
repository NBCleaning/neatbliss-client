import { expect, test } from "@playwright/test";
import { configSchema } from "../src/config/schema";

const ADMIN_ROUTE = "/7ae5fff6-e9af-4876-86b8-8dfb7a1a0811";

test.describe("Admin flow", () => {
  test("edit status, preview shows banner, back to editing, copy is schema-valid JSON", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    await page.addInitScript(() => {
      const nav = navigator as Navigator & {
        clipboard: { writeText: (t: string) => Promise<void> };
      };
      const win = window as unknown as { __e2eClipboard?: string };
      win.__e2eClipboard = "";
      Object.defineProperty(nav, "clipboard", {
        configurable: true,
        value: {
          writeText: async (text: string) => {
            (window as unknown as { __e2eClipboard: string }).__e2eClipboard =
              text;
          },
          readText: async () =>
            (window as unknown as { __e2eClipboard: string }).__e2eClipboard,
        },
      });
    });

    await page.goto(ADMIN_ROUTE);
    await expect(
      page.getByRole("heading", { name: "NeatBliss site settings" }),
    ).toBeVisible();

    const toggle = page.getByRole("switch", {
      name: /Show message at the top of the site/i,
    });
    // Turn the toggle on, retrying: the initial read can race the config
    // load, and a click made on stale state flips it the wrong way once.
    await expect(async () => {
      if ((await toggle.getAttribute("aria-checked")) !== "true") {
        await toggle.click();
      }
      expect(await toggle.getAttribute("aria-checked")).toBe("true");
    }).toPass({ timeout: 10_000 });

    const uniqueMessage = `E2E preview banner ${Date.now()}`;
    const messageBox = page.getByLabel("MESSAGE", { exact: true });
    await messageBox.fill(uniqueMessage);

    await page.getByRole("button", { name: "Preview my changes" }).click();

    await expect(page).toHaveURL(/\/$/);
    const banner = page.getByRole("status");
    await expect(banner).toBeVisible();
    await expect(banner).toContainText(uniqueMessage);

    const previewPill = page.getByRole("region", {
      name: /Previewing draft settings/i,
    });
    await expect(previewPill).toBeVisible();
    await expect(previewPill).toContainText("Previewing your changes");

    await previewPill.getByRole("button", { name: "Back to editing" }).click();
    await expect(page).toHaveURL(new RegExp(`${ADMIN_ROUTE}$`));
    await expect(
      page.getByRole("heading", { name: "NeatBliss site settings" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Copy my settings" }).click();
    await expect(page.getByRole("button", { name: "Copied!" })).toBeVisible();

    const clipboardText = await page.evaluate(
      () =>
        (window as unknown as { __e2eClipboard?: string }).__e2eClipboard ?? "",
    );
    expect(clipboardText.length).toBeGreaterThan(0);
    const parsed = JSON.parse(clipboardText);
    const result = configSchema.safeParse(parsed);
    expect(result.success).toBe(true);
  });

  test("icon picker: pick house on service 1, preview, home card shows house; copy contains icon", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    await page.addInitScript(() => {
      const nav = navigator as Navigator & {
        clipboard: { writeText: (t: string) => Promise<void> };
      };
      const win = window as unknown as { __e2eClipboard?: string };
      win.__e2eClipboard = "";
      Object.defineProperty(nav, "clipboard", {
        configurable: true,
        value: {
          writeText: async (text: string) => {
            (window as unknown as { __e2eClipboard: string }).__e2eClipboard =
              text;
          },
          readText: async () =>
            (window as unknown as { __e2eClipboard: string }).__e2eClipboard,
        },
      });
    });

    await page.goto(ADMIN_ROUTE);
    await expect(
      page.getByRole("heading", { name: "NeatBliss site settings" }),
    ).toBeVisible();

    const iconGroup = page.getByRole("group", {
      name: "Icon for service 1",
    });
    await expect(iconGroup).toBeVisible();
    const houseBtn = iconGroup.getByRole("button", { name: "house" });
    await houseBtn.click();
    await expect(houseBtn).toHaveAttribute("aria-pressed", "true");

    await page.getByRole("button", { name: "Preview my changes" }).click();
    await expect(page).toHaveURL(/\/$/);

    const firstCard = page.locator("article").first();
    await expect(firstCard.locator('svg[data-icon="house"]')).toBeVisible();

    await page.goto(ADMIN_ROUTE);
    await page.getByRole("button", { name: "Copy my settings" }).click();
    await expect(page.getByRole("button", { name: "Copied!" })).toBeVisible();

    const clipboardText = await page.evaluate(
      () =>
        (window as unknown as { __e2eClipboard?: string }).__e2eClipboard ?? "",
    );
    expect(clipboardText.length).toBeGreaterThan(0);
    const parsed = JSON.parse(clipboardText);
    const result = configSchema.safeParse(parsed);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.services[0].icon).toBe("house");
    }
  });

  test("home page card: edit hero title and a trust item, preview, copy", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const nav = navigator as Navigator & {
        clipboard: { writeText: (t: string) => Promise<void> };
      };
      const win = window as unknown as { __e2eClipboard?: string };
      win.__e2eClipboard = "";
      Object.defineProperty(nav, "clipboard", {
        configurable: true,
        value: {
          writeText: async (text: string) => {
            (window as unknown as { __e2eClipboard: string }).__e2eClipboard =
              text;
          },
        },
      });
    });

    await page.goto(ADMIN_ROUTE);
    const homeCard = page.locator('section[aria-labelledby="card-home"]');
    await expect(homeCard).toBeVisible();

    const heroTitle = `Bliss e2e ${Date.now()}`;
    await homeCard.getByLabel("HERO TITLE", { exact: true }).fill(heroTitle);

    const firstTrustPicker = homeCard.getByRole("group", {
      name: "Icon for trust item 1",
    });
    await firstTrustPicker.getByRole("button", { name: "shield" }).click();
    await homeCard.getByLabel("TITLE", { exact: true }).first()
      .fill("Fully insured");

    await page.getByRole("button", { name: "Preview my changes" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(
      page.getByRole("heading", { level: 1, name: heroTitle }),
    ).toBeVisible();
    await expect(page.getByText("Fully insured")).toBeVisible();
    await expect(
      page.locator('svg[data-icon="shield"]').first(),
    ).toBeVisible();

    await page
      .getByRole("region", { name: /Previewing draft settings/i })
      .getByRole("button", { name: "Back to editing" })
      .click();

    await page.getByRole("button", { name: "Copy my settings" }).click();
    await expect(page.getByRole("button", { name: "Copied!" })).toBeVisible();
    const clipboardText = await page.evaluate(
      () =>
        (window as unknown as { __e2eClipboard?: string }).__e2eClipboard ??
        "",
    );
    const parsed = JSON.parse(clipboardText);
    expect(configSchema.safeParse(parsed).success).toBe(true);
    expect(parsed.home.heroTitle).toBe(heroTitle);
    expect(parsed.home.trust[0].icon).toBe("shield");
    expect(parsed.home.trust[0].title).toBe("Fully insured");
    expect(parsed.home.eyebrow).toBeUndefined();
    expect(parsed.footer).toBeUndefined();
  });

  test("weird phone number shows an inline error and blocks copying", async ({
    page,
  }) => {
    await page.goto(ADMIN_ROUTE);
    await expect(
      page.getByRole("heading", { name: "NeatBliss site settings" }),
    ).toBeVisible();

    const phoneBox = page.getByLabel("PHONE (CALLS)", { exact: true });
    await phoneBox.fill("406-450-42477");

    await expect(
      page
        .getByText("Enter a 10 digit phone number, like (406) 450-4247")
        .first(),
    ).toBeVisible();

    await page.getByRole("button", { name: "Copy my settings" }).click();
    await expect(page.getByRole("button", { name: "Copied!" })).toHaveCount(0);
    await expect(page.getByText(/business\.phone/).first()).toBeVisible();

    // A valid number formats itself on blur and clears the error.
    await phoneBox.fill("4064504247");
    await phoneBox.blur();
    await expect(phoneBox).toHaveValue("(406) 450-4247");
    await expect(
      page.getByText("Enter a 10 digit phone number, like (406) 450-4247"),
    ).toHaveCount(0);
  });
});
