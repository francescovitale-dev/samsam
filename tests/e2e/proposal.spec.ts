import { test, expect } from "@playwright/test";
import { login } from "./_auth";

test("create proposal from catalog, live preview, edit+save, internal margin", async ({ page }) => {
  await login(page);

  // Create a new proposal for the seeded customer
  await page.goto("/offerte/nieuw");
  await page.getByLabel("Klant").selectOption({ label: "Pluimveebedrijf Visscher" });
  await page.getByRole("button", { name: "Offerte aanmaken" }).click();

  // Lands on the builder
  await expect(page).toHaveURL(/\/offerte\/[a-z0-9]+$/i);

  // Live preview shows the ported 12-page document
  await expect(page.getByText("Eenmalige investering")).toBeVisible();
  await expect(page.getByText("Ondertekening")).toBeVisible();
  // Auto-filled Plaats + datum and default aanhef
  await expect(page.getByLabel("Plaats, datum")).toHaveValue(/Utrecht, /);
  await expect(page.getByLabel("Aanhef")).toHaveValue("Geachte heer/mevrouw,");

  // Edit the customer name and save
  const newName = `Testklant ${Date.now()}`;
  await page.getByLabel("Bedrijfsnaam / klant").fill(newName);
  await page.getByRole("button", { name: "Opslaan" }).click();
  await expect(page.getByText("Offerte opgeslagen")).toBeVisible();

  // Reload -> persisted
  await page.reload();
  await expect(page.getByLabel("Bedrijfsnaam / klant")).toHaveValue(newName);

  // Internal margin view renders a table
  await page.getByRole("link", { name: "Intern" }).click();
  await expect(page.getByRole("heading", { name: "Interne marge" })).toBeVisible();
  await expect(page.locator("table tbody tr").first()).toBeVisible();
});
