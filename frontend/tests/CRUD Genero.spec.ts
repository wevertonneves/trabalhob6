import { test, expect } from "@playwright/test";

test("deve adicionar, atualizar e deletar gênero techacademic6", async ({
  page,
}) => {
  await page.goto("http://localhost:5173");

  // Login
  await page.getByLabel("Email").fill("wevertonneves2010@hotmail.com");
  await page.getByLabel("Password").fill("afa1234567");
  await page.getByRole("button", { name: "ENTRAR" }).click();
  await expect(page).toHaveURL(/\/home$/);

  // Acessar Painel Administrativo
  await page.locator(".user-avatar").click();
  await page.getByRole("menuitem", { name: "Painel Administrativo" }).click();
  await expect(page).toHaveURL(/\/admin$/);

  // Nome original e atualizado do gênero
  const nomeGenero = "techacademic6";
  const nomeAtualizado = "techacademic6update";

  // Adicionar novo gênero
  const formGenero = page.locator("form", { hasText: "Adicionar Gênero" });
  await formGenero.getByPlaceholder("Digite o nome do gênero").fill(nomeGenero);
  await formGenero
    .locator('input[name="image"]')
    .fill("https://link-da-imagem.com/tech.jpg");
  await formGenero.getByRole("button", { name: "Adicionar Gênero" }).click();

  // Aguarda a lista atualizar
  await page.waitForTimeout(1000);

  // Atualizar Gênero
  const selectGenero = page.locator("#select-genre-to-update");
  await selectGenero.click();
  const optionGenero = page.getByRole("option", { name: nomeGenero });
  await expect(optionGenero).toBeVisible();
  await optionGenero.click();

  await page.waitForTimeout(500);
  await page
    .locator("form#update-genre-form")
    .getByPlaceholder("Digite o nome do gênero")
    .fill(nomeAtualizado);

  await page
    .locator("form#update-genre-form")
    .getByRole("button", { name: "Atualizar Gênero" })
    .click();

  await page.waitForTimeout(1000);

  // Deletar Gênero
  page.on("dialog", async (dialog) => {
    await dialog.accept(); // Confirma a exclusão
  });

  const selectDelete = page.locator("#select-genre-to-delete");
  await selectDelete.click();
  const optionDelete = page.getByRole("option", { name: nomeAtualizado });
  await expect(optionDelete).toBeVisible();
  await optionDelete.click();

  await page
    .locator("form#delete-genre-form")
    .getByRole("button", { name: "Deletar Gênero" })
    .click();

  await page.waitForTimeout(1000);

  await expect(page).toHaveURL(/\/admin$/);
});
