import { type Page, expect } from "@playwright/test";

/** Log in through the shared-password gate. */
export async function login(page: Page, password = "samsam") {
  await page.goto("/login");
  await page.getByLabel("Wachtwoord").fill(password);
  await page.getByRole("button", { name: "Inloggen" }).click();
  await expect(page.getByRole("heading", { name: "Offertes" })).toBeVisible();
}
