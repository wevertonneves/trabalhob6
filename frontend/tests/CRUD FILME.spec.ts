import { test, expect } from "@playwright/test";

test("deve adicionar um filme com gênero DESENHOS", async ({ page }) => {
  await page.goto("http://localhost:5173");

  // Login
  await page.getByLabel("Email").fill("wevertonneves2010@hotmail.com");
  await page.getByLabel("Password").fill("afa1234567");
  await page.getByRole("button", { name: "ENTRAR" }).click();
  await expect(page).toHaveURL(/\/home$/);

  // Painel Admin
  await page.locator(".user-avatar").click();
  await page.getByRole("menuitem", { name: "Painel Administrativo" }).click();
  await expect(page).toHaveURL(/\/admin$/);

  const nomeFilme = "techacademic6";
  const form = page.locator("#add-movie-form");

  // Preencher campos
  await form.getByLabel("Name").fill(nomeFilme);
  await form.getByLabel("Year").fill("2025");
  await form.getByLabel("Duration").fill("120");
  await form.getByLabel("image URL").fill("https://example.com/image.jpg");
  await form.getByLabel("Video URL").fill("https://example.com/video.mp4");
  await form.getByLabel("Sinopse").fill("Descrição de teste do filme.");

  await form.locator('[aria-haspopup="listbox"]').click();

  // Selecionar a opção "DESENHOS"
  await page.getByRole("option", { name: "DESENHOS" }).click();

  // Clicar no botão Adicionar Filme
  await form.getByRole("button", { name: "Adicionar Filme" }).click();

  const updateForm = page.locator("#update-movie-form");

  // Abrir o select de filmes para atualizar
  await updateForm.locator('[aria-haspopup="listbox"]').first().click();

  // Selecionar o filme "techacademic6"
  await page.getByRole("option", { name: "techacademic6" }).click();

  await updateForm.getByLabel("Name").fill("techacademic6update");

  await updateForm.getByRole("button", { name: "Atualizar Filme" }).click();

  const deleteForm = page.locator("#delete-movie-form");

  // Abrir o select de filmes
  await deleteForm.locator('[id="select-movie-to-delete"]').click();

  // Selecionar o filme "techacademic6update"
  await page.getByRole("option", { name: "techacademic6update" }).click();

  // Interceptar o diálogo de confirmação (confirm box)
  page.once("dialog", async (dialog) => {
    await dialog.accept();
  });

  // Clicar no botão "Deletar Filme"
  await deleteForm.getByRole("button", { name: "Deletar Filme" }).click();
});
