import { expect, test, type Page } from "@playwright/test";

/**
 * End-to-end checks for the portfolio. Run with: pnpm exec playwright install chromium && pnpm test:e2e
 * These run against the template content (placeholders), so assertions about contact links check that
 * placeholders are NOT rendered as working links.
 */

async function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text()}`);
  });
  return errors;
}

test("home loads without runtime errors and with a single h1", async ({ page }) => {
  const errors = await collectErrors(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("perspective");
  await page.waitForLoadState("networkidle");
  expect(errors).toEqual([]);
});

test("no horizontal overflow at this viewport", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("desktop nav reaches each section", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop navigation only");
  await page.goto("/");
  for (const [label, id] of [
    ["Projects", "projects"],
    ["About", "about"],
    ["Experience", "experience"],
    ["Contact", "contact"],
  ] as const) {
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: label }).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(`#${id}`)).toBeInViewport({ ratio: 0.1 });
  }
});

test("mobile menu opens, closes with Escape, and returns focus", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile navigation only");
  await page.goto("/");
  const toggle = page.getByRole("button", { name: /open menu/i });
  await toggle.click();
  await expect(page.locator("#mobile-menu")).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(page.locator("#mobile-menu")).toBeHidden();
  await expect(page.getByRole("button", { name: /open menu/i })).toBeFocused();
});

test("skip link is the first tab stop and targets main", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: /skip to content/i });
  await expect(skip).toBeFocused();
  await skip.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});

test("project filters update the visible projects", async ({ page }) => {
  await page.goto("/#projects");
  const featured = page.getByTestId("project-featured");
  const rows = page.getByTestId("project-row");
  await expect(featured).toHaveCount(3);
  await expect(rows).toHaveCount(1);

  await page.getByRole("button", { name: "Creative Technology" }).click();
  await expect(featured).toHaveCount(1);
  await expect(rows).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Creative Technology" })).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "All" }).click();
  await expect(featured).toHaveCount(3);
});

test("case study page works, and back/forward behave", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Your Web Project" }).first().click();
  await expect(page).toHaveURL(/\/projects\/web-project-placeholder$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Your Web Project");
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/projects\/web-project-placeholder$/);
});

test("placeholder case studies are noindex; unknown slugs 404", async ({ page, request }) => {
  await page.goto("/projects/web-project-placeholder");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  const res = await request.get("/projects/does-not-exist");
  expect(res.status()).toBe(404);
});

test("experience shows the confirmed roles exactly", async ({ page }) => {
  await page.goto("/#experience");
  const entries = page.getByTestId("experience-entry");
  await expect(entries).toHaveCount(2);
  await expect(entries.filter({ hasText: "Sync Night" })).toContainText("Marketing Committee Member");
  await expect(entries.filter({ hasText: "Sync Night" })).toContainText("Taylor's University event organized by TRE Club");
  await expect(entries.filter({ hasText: "Sync Night" })).toContainText("Current involvement");
  await expect(entries.filter({ hasText: "XRJam" })).toContainText("Sponsorship Committee Member");
  await expect(entries.filter({ hasText: "XRJam" })).toContainText("Hackathon");
  await expect(entries.filter({ hasText: "XRJam" })).toContainText("Previous experience");
});

test("unconfigured contact channels are not rendered as links", async ({ page }) => {
  await page.goto("/#contact");
  for (const id of ["email", "github", "linkedin", "instagram"]) {
    await expect(page.getByTestId(`channel-${id}`)).toHaveCount(0);
    await expect(page.getByTestId(`channel-${id}-unset`)).toBeVisible();
  }
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  await expect(page.getByTestId("copy-email")).toHaveCount(0);
});

test.describe("animated backgrounds", () => {
  test("are decorative: aria-hidden, no pointer events, one motif per section", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    for (const selector of [".atmos", ".backdrop"]) {
      const layers = page.locator(selector);
      const count = await layers.count();
      expect(count).toBeGreaterThan(0);
      for (let i = 0; i < count; i++) {
        await expect(layers.nth(i)).toHaveAttribute("aria-hidden", "true");
        expect(await layers.nth(i).evaluate((el) => getComputedStyle(el).pointerEvents)).toBe("none");
      }
    }

    for (const [section, variant] of [
      ["projects", "market"],
      ["about", "sonar"],
      ["skills", "digits"],
      ["experience", "clock"],
    ] as const) {
      await expect(page.locator(`#${section} [data-backdrop="${variant}"]`)).toHaveCount(1);
    }
  });

  test("the global layers are actually moving", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const sample = () => page.locator(".atmos-grid").evaluate((el) => getComputedStyle(el).transform);
    const before = await sample();
    await page.waitForTimeout(1200);
    expect(await sample()).not.toBe(before);
  });

  test("a section's motif stays pinned to the viewport while the section scrolls", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    for (const id of ["skills", "experience"]) {
      // Scroll to 40% of the section's sticky travel (section height minus one viewport).
      await page.evaluate((sectionId) => {
        const section = document.getElementById(sectionId)!;
        const travel = section.getBoundingClientRect().height - window.innerHeight;
        window.scrollTo({ top: window.scrollY + section.getBoundingClientRect().top + travel * 0.4, behavior: "instant" });
      }, id);
      const top = await page.locator(`#${id} .backdrop-stick`).evaluate((el) => Math.round(el.getBoundingClientRect().top));
      expect(Math.abs(top)).toBeLessThanOrEqual(1);
    }
  });
});

test.describe("reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("content is visible immediately and no motion gate is applied", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveClass(/\bjs\b/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const introDisplay = await page.locator(".intro").evaluate((el) => getComputedStyle(el).display);
    expect(introDisplay).toBe("none");
  });

  test("backgrounds settle into a static state", async ({ page }) => {
    await page.goto("/");
    // Elements that only make sense in motion are removed...
    for (const selector of [".atmos-mote", ".hero-streaks", ".sonar", ".clock-sweep"]) {
      await expect(page.locator(selector).first()).toBeHidden();
    }
    // ...and the price line is rendered fully drawn rather than mid-animation.
    const dashOffset = await page.locator(".market-line").evaluate((el) => getComputedStyle(el).strokeDashoffset);
    expect(parseFloat(dashOffset)).toBe(0);
  });
});

test("representative screenshots", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.waitForTimeout(2500); // let the intro finish
  await page.screenshot({ path: testInfo.outputPath("hero.png") });
  await page.locator("#projects").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: testInfo.outputPath("projects.png") });
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: testInfo.outputPath("contact.png") });
});
