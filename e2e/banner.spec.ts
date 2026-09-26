import { expect, test } from "@playwright/test";
import { interceptConfig, loadConfig, withStatus } from "./fixtures";

test.describe("Status banner", () => {
  test("absent when the config disables it", async ({ page }) => {
    const config = loadConfig() as { status: object };
    await interceptConfig(page, {
      ...config,
      status: { enabled: false, message: "" },
    });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("status")).toHaveCount(0);
  });

  test("appears when intercepted config enables status", async ({ page }) => {
    const message = "Booked out until spring, thanks for your patience.";
    await interceptConfig(page, withStatus(loadConfig(), message));

    await page.goto("/");

    const banner = page.getByRole("status");
    await expect(banner).toBeVisible();
    await expect(banner).toContainText(message);
  });
});
