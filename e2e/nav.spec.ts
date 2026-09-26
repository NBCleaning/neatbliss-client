import { expect, test } from "@playwright/test";

async function dismissNotice(page: import("@playwright/test").Page) {
  const dialog = page.getByRole("dialog");
  try {
    await dialog.waitFor({ state: "visible", timeout: 3000 });
  } catch {
    return; // no notice configured
  }
  await page.getByRole("button", { name: "Got it" }).click();
  await dialog.waitFor({ state: "hidden" });
}

function primaryNav(page: import("@playwright/test").Page) {
  return page.getByRole("navigation", { name: "Primary" });
}

async function clickNav(
  page: import("@playwright/test").Page,
  name: string,
) {
  const nav = primaryNav(page);
  if (await nav.isVisible()) {
    await nav.getByRole("link", { name, exact: true }).click();
    return;
  }
  await page.getByRole("button", { name: /menu/i }).click();
  await page
    .locator("#primary-mobile-menu")
    .getByRole("link", { name, exact: true })
    .click();
}

test.describe("Navigation", () => {
  test("testimonials scrolls down, then home scrolls back to top", async ({
    page,
  }) => {
    await page.goto("/");
    await dismissNotice(page);

    await clickNav(page, "Testimonials");
    await expect(page).toHaveURL(/#testimonials$/);
    // Wait for the smooth scroll to start and fully settle before moving on,
    // the way a person would.
    await expect
      .poll(async () => {
        const before = await page.evaluate(() => window.scrollY);
        await page.waitForTimeout(250);
        const after = await page.evaluate(() => window.scrollY);
        return before > 0 && before === after;
      })
      .toBe(true);

    await clickNav(page, "Home");
    await expect
      .poll(async () => page.evaluate(() => window.scrollY))
      .toBe(0);
  });

  test("testimonials works from another page", async ({ page }) => {
    await page.goto("/services");
    await dismissNotice(page);

    await clickNav(page, "Testimonials");
    await expect(page).toHaveURL(/\/#testimonials$/);
    await expect(
      page.getByRole("heading", { name: "What clients say" }),
    ).toBeVisible();
    await expect
      .poll(async () => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(0);
  });

  test("page navigation lands at the top", async ({ page }) => {
    await page.goto("/");
    await dismissNotice(page);
    await page.evaluate(() => window.scrollTo(0, 2000));

    await clickNav(page, "Services");
    await expect(page).toHaveURL(/\/services$/);
    await expect
      .poll(async () => page.evaluate(() => window.scrollY))
      .toBe(0);

    await clickNav(page, "Contact");
    await expect(page).toHaveURL(/\/quote$/);
    await expect
      .poll(async () => page.evaluate(() => window.scrollY))
      .toBe(0);
  });

  test("footer page links navigate", async ({ page }) => {
    await page.goto("/");
    await dismissNotice(page);
    const footer = page.locator("footer");

    await footer.getByRole("link", { name: "Services", exact: true }).click();
    await expect(page).toHaveURL(/\/services$/);

    await footer.getByRole("link", { name: "Contact", exact: true }).click();
    await expect(page).toHaveURL(/\/quote$/);

    await footer.getByRole("link", { name: "Home", exact: true }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});
