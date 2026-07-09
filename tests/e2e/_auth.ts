import { type Page, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import path from "node:path";

const LINK_FILE = path.join(process.cwd(), ".dev-magic-link.txt");

/**
 * Log in through the real magic-link UI. The dev email fallback mirrors the
 * latest link to .dev-magic-link.txt (AUTH_DEV_LINK_FILE), which we read here.
 */
export async function login(page: Page, email = "jimmy@samsam.nu") {
  const before = await readFile(LINK_FILE, "utf8").catch(() => "");
  await page.goto("/login");
  await page.getByLabel("E-mailadres").fill(email);
  await page.getByRole("button", { name: "Stuur inloglink" }).click();
  await page.getByRole("heading", { name: "Check je e-mail" }).waitFor();

  // Poll for a fresh link
  let url = "";
  for (let i = 0; i < 40; i++) {
    const cur = await readFile(LINK_FILE, "utf8").catch(() => "");
    if (cur && cur !== before) {
      url = cur.trim();
      break;
    }
    await page.waitForTimeout(150);
  }
  expect(url, "magic link should be written to dev file").toContain("/api/auth/callback/");
  await page.goto(url);
  await expect(page.getByRole("heading", { name: "Offertes" })).toBeVisible();
}
