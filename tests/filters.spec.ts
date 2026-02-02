import { expect, test } from "@playwright/test";

test("transaction filters work (type, search, date)", async ({ page }) => {
  const unique = Date.now();
  const username = `testuser${unique}`;
  const email = `test${unique}@example.com`;
  const password = "Test1234!";
  const opisAlpha = `Alpha ${unique}`;
  const opisBeta = `Beta ${unique}`;

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

  const addTransaction = async (tip: "prihodek" | "odhodek", opis: string) => {
    await page.getByRole("button", { name: /dodaj/i }).first().click();
    const modal = page.getByRole("heading", { name: /nova transakcija/i }).locator("..").locator("..");
    await expect(modal).toBeVisible();
    await modal.getByRole("combobox").selectOption(tip);
    await modal.getByPlaceholder(/znesek/i).fill("12.34");
    await modal.getByPlaceholder("Opis").fill(opis);
    await modal.getByRole("button", { name: /shrani/i }).click();
  };

  await addTransaction("prihodek", opisAlpha);
  await addTransaction("odhodek", opisBeta);

  const alphaRow = page.getByRole("row", { name: new RegExp(opisAlpha) });
  const betaRow = page.getByRole("row", { name: new RegExp(opisBeta) });
  await expect(alphaRow).toBeVisible();
  await expect(betaRow).toBeVisible();

  const tableSection = page
    .getByRole("heading", { name: /zgodovina transakcij/i })
    .locator("..")
    .locator("..");

  await tableSection.getByRole("combobox").selectOption("prihodek");
  await expect(alphaRow).toBeVisible();
  await expect(betaRow).toHaveCount(0);

  await tableSection.getByRole("combobox").selectOption("all");
  await tableSection.locator('input[type="text"]').fill(opisBeta);
  await expect(betaRow).toBeVisible();
  await expect(alphaRow).toHaveCount(0);

  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  await tableSection.locator('input[type="date"]').fill(tomorrow);
  await expect(page.getByText(/ni transakcij/i)).toBeVisible();
});
