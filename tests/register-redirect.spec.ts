import { expect, test } from "@playwright/test";

test("logged-in user is redirected from /registracija to /dashboard", async ({ page }) => {
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

  await page.goto("/registracija");
  await page.waitForURL("**/dashboard");
  await expect(page).toHaveURL(/\/dashboard/);
});
