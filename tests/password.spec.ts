import { expect, test } from "@playwright/test";

test("user can change password", async ({ page }) => {
  const unique = Date.now();
  const username = `testuser${unique}`;
  const email = `test${unique}@example.com`;
  const password = "Test1234!";
  const newPassword = "NewTest1234!";

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

  await page.locator("header").getByRole("button").first().click();

  const modal = page.getByRole("heading", { name: /uredi profil/i }).locator("..").locator("..");
  await expect(modal).toBeVisible();

  await modal.getByPlaceholder("Staro geslo").fill(password);
  await modal.getByPlaceholder("Novo geslo", { exact: true }).fill(newPassword);
  await modal.getByPlaceholder("Potrdi novo geslo", { exact: true }).fill(newPassword);
  await modal.getByRole("button", { name: /shrani/i }).click();

  await page.locator('a[href="/api/logout"]').first().click();
  await page.waitForURL("**/");

  await page.goto("/login");
  await page.getByPlaceholder("Email").fill(email);
  await page.getByPlaceholder("Geslo").fill(newPassword);
  await page.getByRole("button", { name: /prijavi/i }).click();

  await page.waitForURL("**/dashboard");
});
