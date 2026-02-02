import { expect, test } from "@playwright/test";

test("user can add and delete a transaction", async ({ page }) => {
  const unique = Date.now();
  const username = `testuser${unique}`;
  const email = `test${unique}@example.com`;
  const password = "Test1234!";
  const opis = `Test transakcija ${unique}`;

  await page.goto("/registracija");

  await page.locator('input[type="text"]').fill(username);
  await page.getByPlaceholder("Email").fill(email);
  await page.locator('input[type="password"]').nth(0).fill(password);
  await page.getByPlaceholder("Ponovi geslo").fill(password);
  await page.getByRole("button", { name: /registriraj/i }).click();

  await page.waitForURL("**/login");

  await page.getByPlaceholder("Email").fill(email);
  await page.getByPlaceholder("Geslo").fill(password);
  await page.getByRole("button", { name: /prijavi/i }).click();

  await page.waitForURL("**/dashboard");

  await page.getByRole("button", { name: /dodaj/i }).first().click();

  const modal = page.getByRole("heading", { name: /nova transakcija/i }).locator("..").locator("..");
  await expect(modal).toBeVisible();

  await modal.getByRole("combobox").selectOption("prihodek");
  await modal.getByPlaceholder(/znesek/i).fill("12.34");
  await modal.getByPlaceholder("Opis").fill(opis);
  await modal.getByRole("button", { name: /shrani/i }).click();

  const row = page.getByRole("row", { name: new RegExp(opis) });
  await expect(row).toBeVisible();

  page.once("dialog", (dialog) => dialog.accept());
  await row.getByRole("button").click();

  await expect(row).toHaveCount(0);
});
