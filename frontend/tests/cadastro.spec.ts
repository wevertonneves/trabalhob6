import { test, expect } from "@playwright/test";

function gerarCPFValido(): string {
  const rand = () => Math.floor(Math.random() * 9);
  const nums: number[] = Array.from({ length: 9 }, rand);

  const calcDV = (arr: number[], factor: number): number => {
    const sum = arr.reduce((acc, num, i) => acc + num * (factor - i), 0);
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const d1 = calcDV(nums, 10);
  const d2 = calcDV([...nums, d1], 11);

  const cpf = [...nums, d1, d2].join("");

  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

test("deve cadastrar um novo usuário com dados válidos e únicos", async ({
  page,
}) => {
  const timestamp = Date.now();
  const nome = `User${timestamp}`; // nome >= 3 caracteres
  const email = `user${timestamp}@example.com`;
  const senha = "senha12345";
  const cpf = gerarCPFValido();

  await page.goto("http://localhost:5173/cadastro");

  await page.getByLabel("Nome").fill(nome);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(senha);
  await page.getByLabel("ConfirmPassword").fill(senha);
  await page.getByLabel("Cpf").fill(cpf);

  await page.click('button:has-text("Cadastrar")');

  await expect(
    page.getByText(
      "Cadastro realizado com sucesso! Voltando para tela de login"
    )
  ).toBeVisible();

  await expect(page).toHaveURL(/\/login$/, { timeout: 3000 });
});

//#######################################################################################
//#######################################################################################
test("deve cadastrar dar erro no email formato invalido", async ({ page }) => {
  await page.goto("http://localhost:5173/cadastro");

  await page.getByLabel("Nome").fill("Weverton Neves");
  await page.getByLabel("Email").fill("weverton.testexample.com");
  await page.getByLabel("Password", { exact: true }).fill("senha12345");
  await page.getByLabel("ConfirmPassword").fill("senha12345");
  await page.getByLabel("Cpf").fill("094.353.319-80");

  await page.click('button:has-text("Cadastrar")');

  await expect(page.getByText("⚠ Insira um email válido!")).toBeVisible();

  await expect(page).toHaveURL(/\/cadastro$/);
});
