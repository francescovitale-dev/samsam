import { test, expect } from "@playwright/test";
import { login } from "./_auth";

test("create proposal from catalog, preview math, edit+save, internal margin", async ({ page }) => {
  await login(page);

  // Create a new proposal for the seeded customer
  await page.goto("/offerte/nieuw");
  await page.getByLabel("Klant").selectOption({ label: "Pluimveebedrijf Visscher" });
  await page.getByRole("button", { name: "Offerte aanmaken" }).click();

  // Lands on the builder
  await expect(page).toHaveURL(/\/offerte\/[a-z0-9]+$/i);

  // Live preview shows the ported document + correct math (Huawei column € 77.155)
  await expect(page.getByText("Eenmalige investering")).toBeVisible();
  await expect(page.getByText("Ondertekening")).toBeVisible();
  await expect(page.getByText("€ 77.155").first()).toBeVisible();

  // Edit the customer name and save
  const newName = `Testklant ${Date.now()}`;
  await page.getByLabel("Bedrijfsnaam / klant").fill(newName);
  await page.getByRole("button", { name: "Opslaan" }).click();
  await expect(page.getByText("Offerte opgeslagen")).toBeVisible();

  // Reload -> persisted
  await page.reload();
  await expect(page.getByLabel("Bedrijfsnaam / klant")).toHaveValue(newName);

  // Internal margin view ~15%
  await page.getByRole("link", { name: "Intern" }).click();
  await expect(page.getByRole("heading", { name: "Interne marge" })).toBeVisible();
  await expect(page.getByText(/15\.\d%/).first()).toBeVisible();
});
