import { expect, test } from "@playwright/test";

test("user can logout", async ({ page }) => {
  const unique = Date.now();
  const username = `testuser${unique}`;
  const email = `test${unique}@example.com`;
  const password = "Test1234!";

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
  await page.locator('a[href="/api/logout"]').first().click();

  await page.waitForURL("**/");
  await expect(page).not.toHaveURL(/dashboard/);
});
