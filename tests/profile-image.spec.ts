import { expect, test } from "@playwright/test";

test("user can upload profile image", async ({ page }) => {
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

  await page.locator("header").getByRole("button").first().click();

  const modal = page.getByRole("heading", { name: /uredi profil/i }).locator("..").locator("..");
  await expect(modal).toBeVisible();

  const fileInput = modal.locator('input[type="file"]');
  const pngData = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==",
    "base64"
  );
  await fileInput.setInputFiles({
    name: "avatar.png",
    mimeType: "image/png",
    buffer: pngData,
  });

  await modal.getByRole("button", { name: /shrani/i }).click();

  await expect(page.locator("header img").first()).toBeVisible();
});
