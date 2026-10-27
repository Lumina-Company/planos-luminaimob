import { test, expect, type Page } from "@playwright/test";

// Texto visível + atributos, sem os <script> (o script de ilha do Astro contém "CustomEvent").
async function htmlSemScripts(page: Page) {
  return page.evaluate(() => {
    const c = document.documentElement.cloneNode(true) as HTMLElement;
    c.querySelectorAll("script, style").forEach((s) => s.remove());
    return c.outerHTML;
  });
}

const PROIBIDOS = [/margem/i, /custo/i, /\bAPI\b/, /US\$/];

async function abrir(page: Page) {
  await page.goto("/");
  await page.waitForFunction(() => !document.documentElement.classList.contains("intro"));
  await page.waitForTimeout(1300); // abertura
}

const card = (page: Page, nome: string) => page.getByRole("article", { name: nome, exact: true });
const ligarAdmin = (page: Page) => page.locator("body").press("l");

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try {
      localStorage.clear();
    } catch {}
  });
});

test("abre em Pro, sem selo, com os planos fixos em azul e o Personalizado branco", async ({ page }) => {
  await abrir(page);
  await expect(page.getByRole("tab", { name: "Pro" })).toHaveAttribute("aria-selected", "true");
  await expect(card(page, "Pro 50")).toContainText("619");
  await expect(page.getByText("Recomendado")).toHaveCount(0);
  await expect(card(page, "Pro 30").locator("[data-arte]")).toHaveAttribute("data-tom", "0");
  await expect(card(page, "Pro 50").locator("[data-arte]")).toHaveAttribute("data-tom", "1");
  await expect(card(page, "Pro Personalizado").locator("[data-arte]")).toHaveAttribute("data-tom", "branco");
});

test("ligar Locução soma R$ 100 em todos os cards elegíveis", async ({ page }) => {
  await abrir(page);
  await page.getByRole("button", { name: /Acessórios/ }).click();
  await page.getByRole("switch", { name: /Locução/ }).click();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  await expect(card(page, "Pro 30")).toContainText("499");
  await expect(card(page, "Pro 50")).toContainText("719");
  await expect(card(page, "Pro 50")).toContainText("R$ 619 + Locução");
  await expect(card(page, "Pro Personalizado")).toContainText("499");
  await expect(page.getByRole("button", { name: /Acessórios/ })).toContainText("1");

  await page.getByRole("tab", { name: "Essencial" }).click();
  await page.waitForTimeout(500);
  await expect(card(page, "Essencial 30")).toContainText("249");
  await expect(card(page, "Essencial Personalizado")).toContainText("249");
});

test("admin desligado não tem custo/margem no HTML; ligado tem", async ({ page }) => {
  await abrir(page);
  const html = await htmlSemScripts(page);
  for (const p of PROIBIDOS) expect(html, `achou ${p}`).not.toMatch(p);

  await ligarAdmin(page);
  await expect(page.getByRole("region", { name: "Modo admin" })).toBeVisible();
  await expect(page.getByText("Margem total")).toBeVisible();
  const comAdmin = await htmlSemScripts(page);
  expect(comAdmin).toMatch(/margem/i);
  expect(comAdmin).toMatch(/custo/i);
  expect(comAdmin).toMatch(/US\$/);
});

test("digitar l dentro de um campo editável não liga/desliga o admin", async ({ page }) => {
  await abrir(page);
  await ligarAdmin(page);
  const titulo = page.getByRole("textbox", { name: "Editar título", exact: true });
  await titulo.click();
  await page.keyboard.press("End");
  await page.keyboard.type(" legal");
  await expect(page.getByRole("region", { name: "Modo admin" })).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.locator("h1")).toHaveText("Planos LuminaImob legal");
});

test("Esc desliga o admin", async ({ page }) => {
  await abrir(page);
  await ligarAdmin(page);
  await expect(page.getByRole("region", { name: "Modo admin" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("region", { name: "Modo admin" })).toHaveCount(0);
  await expect(page.getByText("Margem total")).toHaveCount(0);
});

test("valor inválido no admin volta ao anterior", async ({ page }) => {
  await abrir(page);
  await ligarAdmin(page);
  const preco = page.getByRole("article", { name: "Pro 30", exact: true }).getByRole("textbox", { name: "Editar preço da faixa" });
  await preco.click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.type("-50");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(450);
  await expect(preco).toHaveText("399");

  // e um válido é aceito, salvo e desfeito com Ctrl+Z
  await preco.click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.type("420");
  await page.keyboard.press("Enter");
  await expect(card(page, "Pro 30").getByRole("textbox", { name: "Editar preço da faixa" })).toHaveText("420");
  await page.locator("body").click({ position: { x: 5, y: 600 } });
  await page.keyboard.press("ControlOrMeta+z");
  await expect(card(page, "Pro 30").getByRole("textbox", { name: "Editar preço da faixa" })).toHaveText("399");
});

test("Fechar abre a tela de fechamento com plano, acessórios, total e próximos passos", async ({ page }) => {
  await abrir(page);
  await page.getByRole("button", { name: /Acessórios/ }).click();
  await page.getByRole("switch", { name: /Locução/ }).click();
  await page.keyboard.press("Escape");
  await card(page, "Pro 50").getByRole("button", { name: /Escolher/ }).click();
  const barra = page.getByRole("region", { name: "Resumo do plano escolhido" });
  await expect(barra).toContainText("719");
  await barra.getByRole("button", { name: "Fechar" }).click();

  const tela = page.getByRole("dialog", { name: "Plano escolhido e próximos passos" });
  await expect(tela.getByRole("heading", { level: 2, name: "Pro 50" })).toBeVisible();
  await expect(tela).toContainText("50 vídeos de 15 s por mês");
  await expect(tela).toContainText("Locução por IA");
  await expect(tela).toContainText("719"); // o total conta de zero até o valor da barra
  await expect(tela).toContainText("Próximos passos");
  await expect(tela).toContainText("Contrato assinado");
  await expect(tela).toContainText("Imóveis no ar sozinhos");
  await expect(tela).toContainText("em até 20 dias");

  // Esc volta aos planos sem desligar a seleção nem ligar o admin
  await page.keyboard.press("Escape");
  await expect(tela).toBeHidden();
  await expect(barra).toContainText("Pro 50");
  await expect(page.locator("html")).not.toHaveAttribute("data-admin", "");
});

test("trocar de categoria mantém a seleção; demo troca os cards", async ({ page }) => {
  await abrir(page);
  await card(page, "Pro 50").getByRole("button", { name: /Escolher/ }).click();
  await page.getByRole("tab", { name: "Essencial" }).click();
  await expect(page.getByRole("region", { name: "Resumo do plano escolhido" })).toContainText("Pro 50");
  await page.getByRole("button", { name: "Ver como funciona" }).click();
  await expect(page.getByRole("heading", { level: 2, name: "Essencial" })).toBeVisible();
  await page.getByRole("button", { name: "Ver preços" }).click();
  await expect(card(page, "Essencial 60")).toBeVisible();
});

test("vídeo da demo abre em tela cheia e volta ao celular (clique, X e Esc)", async ({ page }) => {
  await abrir(page);
  await page.getByRole("button", { name: "Ver como funciona" }).click();
  const ampliar = page.getByRole("button", { name: /Ver em tela cheia/ });
  const telaCheia = page.getByRole("dialog", { name: /Vídeo de exemplo do Pro/ });

  await ampliar.click();
  await expect(telaCheia).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(telaCheia).toBeHidden();
  await expect(ampliar).toBeVisible();

  await ampliar.click();
  await telaCheia.getByRole("button", { name: "Sair da tela cheia" }).click();
  await expect(telaCheia).toBeHidden();

  // Esc fecha só a tela cheia: o admin continua ligado
  await page.keyboard.press("l");
  await ampliar.click();
  await expect(telaCheia).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(telaCheia).toBeHidden();
  await expect(page.getByRole("button", { name: /Trocar vídeo/ })).toBeVisible();
});

test("vídeo do Essencial também abre em tela cheia", async ({ page }) => {
  await abrir(page);
  await page.getByRole("tab", { name: "Essencial" }).click();
  await page.getByRole("button", { name: "Ver como funciona" }).click();
  const telaCheia = page.getByRole("dialog", { name: /Vídeo de exemplo do Essencial/ });

  await page.getByRole("button", { name: /Ver em tela cheia: Vídeo de exemplo do Essencial/ }).click();
  await expect(telaCheia).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(telaCheia).toBeHidden();
});

test("personalizado do Pro: 30 × 30 s = R$ 894", async ({ page }) => {
  await abrir(page);
  const slider = card(page, "Pro Personalizado").getByRole("slider", { name: "Duração por vídeo" });
  await slider.focus();
  for (let i = 0; i < 3; i++) await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(400);
  await expect(card(page, "Pro Personalizado")).toContainText("894");
});

test("personalizado do Essencial: 30 × 15 s = R$ 189; 30 × 30 s = R$ 369", async ({ page }) => {
  await abrir(page);
  await page.getByRole("tab", { name: "Essencial" }).click();
  const personalizado = card(page, "Essencial Personalizado");
  await expect(personalizado).toContainText("189");
  const slider = personalizado.getByRole("slider", { name: "Duração por vídeo" });
  await slider.focus();
  for (let i = 0; i < 3; i++) await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(400);
  await expect(personalizado).toContainText("369");
});

test("localStorage bloqueado: abre com o padrão, sem erro", async ({ page }) => {
  const erros: string[] = [];
  page.on("pageerror", (e) => erros.push(String(e)));
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("bloqueado");
      },
    });
  });
  await abrir(page);
  await expect(card(page, "Pro 50")).toContainText("619");
  expect(erros).toEqual([]);
});
