import { test, expect } from "@playwright/test";
import { login } from "./_auth";

test("login, then create a customer and a battery product", async ({ page }) => {
  await login(page);

  // --- Create a customer ---
  const company = `E2E Klant ${Date.now()}`;
  await page.goto("/klanten/nieuw");
  await page.getByLabel("Bedrijfsnaam / klant *").fill(company);
  await page.getByLabel("Contactpersoon").fill("Test Persoon");
  await page.getByLabel("E-mail").fill("test@example.com");
  await page.getByRole("button", { name: "Opslaan" }).click();

  await expect(page).toHaveURL(/\/klanten/);
  await expect(page.getByText(company)).toBeVisible();

  // --- Create a battery product with a live sell price ---
  await page.goto("/catalogus/nieuw?category=battery");
  await page.getByLabel("Merk").fill("E2E");
  await page.getByLabel("Type", { exact: true }).fill("TestCell 100");
  await page.getByLabel("Kostprijs (€, excl. BTW)").fill("10000");
  await page.getByLabel("Marge (%)").fill("15");
  // live sell = 10000 * 1.15 = 11.500
  await expect(page.getByText("€ 11.500")).toBeVisible();
  await page.getByLabel("Capaciteit").fill("100kWh");
  await page.getByRole("button", { name: "Opslaan" }).click();

  await expect(page).toHaveURL(/\/catalogus/);
  await expect(page.getByText("E2E TestCell 100")).toBeVisible();
  // sell price shown in the catalog list
  await expect(page.getByText("€ 11.500").first()).toBeVisible();
});
