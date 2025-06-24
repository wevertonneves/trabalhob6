import { test, expect } from "@playwright/test";

test("deve fazer login e redirecionar para home", async ({ page }) => {
  await page.goto("http://localhost:5173");

  await page.getByLabel("Email").fill("wevertonneves2010@hotmail.com");
  await page.getByLabel("Password").fill("afa1234567");

  await page.click('button:has-text("ENTRAR")');

  await expect(page).toHaveURL(/\/home$/);
});

//#######################################################################################
//#######################################################################################

test("deve mostrar erro ao tentar logar com senha errada", async ({ page }) => {
  await page.goto("http://localhost:5173");

  await page.getByLabel("Email").fill("wevertonneves2010@hotmail.com");
  await page.getByLabel("Password").fill("senha_incorreta");

  await page.click('button:has-text("ENTRAR")');

  await expect(page.getByText("Credenciais inválidas!")).toBeVisible();
});
