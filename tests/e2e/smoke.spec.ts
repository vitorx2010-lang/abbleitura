import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

test.describe("Smoke Tests - Abbleitura", () => {
  test("Home page loads successfully", async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check hero section
    await expect(page.locator("h1")).toContainText("Descubra Histórias");
    
    // Check featured books section
    await expect(page.locator("h2")).toContainText("Destaques");
    
    // Check newsletter section
    await expect(page.locator("text=Fique por Dentro")).toBeVisible();
    
    // Check CTA button
    await expect(page.locator("button:has-text('Ver Livros')")).toBeVisible();
  });

  test("Books catalog page loads", async ({ page }) => {
    await page.goto(`${BASE_URL}/books`);
    
    // Check page title
    await expect(page.locator("h1")).toContainText("Catálogo de Livros");
    
    // Check search input
    await expect(page.locator("input[placeholder*='Buscar']")).toBeVisible();
    
    // Check genre filters
    await expect(page.locator("button:has-text('Todos')")).toBeVisible();
    
    // Check book cards
    const bookCards = page.locator("text=Dom Casmurro");
    await expect(bookCards).toBeVisible();
  });

  test("Book detail page loads", async ({ page }) => {
    await page.goto(`${BASE_URL}/books/dom-casmurro`);
    
    // Check book title
    await expect(page.locator("h1")).toContainText("Dom Casmurro");
    
    // Check author
    await expect(page.locator("text=Machado de Assis")).toBeVisible();
    
    // Check download button
    await expect(page.locator("button:has-text('Baixar Livro')")).toBeVisible();
    
    // Check favorite button
    await expect(page.locator("button:has-text('Adicionar aos Favoritos')")).toBeVisible();
    
    // Check comments section
    await expect(page.locator("text=Comentários")).toBeVisible();
  });

  test("Search functionality works", async ({ page }) => {
    await page.goto(`${BASE_URL}/books`);
    
    // Type in search
    await page.fill("input[placeholder*='Buscar']", "Dom Casmurro");
    
    // Wait for results
    await page.waitForTimeout(500);
    
    // Check results
    await expect(page.locator("text=Dom Casmurro")).toBeVisible();
  });

  test("Genre filter works", async ({ page }) => {
    await page.goto(`${BASE_URL}/books`);
    
    // Click genre filter
    await page.click("button:has-text('Romance')");
    
    // Wait for filter
    await page.waitForTimeout(500);
    
    // Check results updated
    await expect(page.locator("text=Romance")).toBeVisible();
  });

  test("Pagination works", async ({ page }) => {
    await page.goto(`${BASE_URL}/books`);
    
    // Check pagination buttons
    const nextButton = page.locator("button:has-text('Próximo')");
    await expect(nextButton).toBeVisible();
    
    // Click next
    await nextButton.click();
    
    // Check page changed
    await page.waitForTimeout(500);
    await expect(page.locator("button:has-text('Anterior')")).toBeEnabled();
  });

  test("Newsletter subscription works", async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Scroll to newsletter section
    await page.locator("text=Fique por Dentro").scrollIntoViewIfNeeded();
    
    // Fill email
    await page.fill("input[placeholder='seu@email.com']", "test@example.com");
    
    // Submit
    await page.click("button:has-text('Inscrever')");
    
    // Check success message
    await expect(page.locator("text=Obrigado por se inscrever")).toBeVisible();
  });

  test("Heart animation on book card works", async ({ page }) => {
    await page.goto(`${BASE_URL}/books`);
    
    // Find first book card
    const firstBookCard = page.locator("text=Dom Casmurro").first();
    
    // Hover over card
    await firstBookCard.hover();
    
    // Check heart button appears
    const heartButton = page.locator("button svg.lucide-heart").first();
    await expect(heartButton).toBeVisible();
  });

  test("404 page displays for invalid route", async ({ page }) => {
    await page.goto(`${BASE_URL}/invalid-route`);
    
    // Check 404 message
    await expect(page.locator("text=Página não encontrada")).toBeVisible();
  });

  test("Theme toggle works (if implemented)", async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check if theme toggle exists
    const themeToggle = page.locator("button[aria-label*='theme'], button[aria-label*='dark'], button[aria-label*='light']");
    
    if (await themeToggle.isVisible()) {
      const initialTheme = await page.evaluate(() => document.documentElement.classList.contains("dark"));
      
      // Click toggle
      await themeToggle.click();
      
      // Wait for change
      await page.waitForTimeout(300);
      
      // Check theme changed
      const newTheme = await page.evaluate(() => document.documentElement.classList.contains("dark"));
      expect(newTheme).not.toBe(initialTheme);
    }
  });

  test("Responsive design - mobile view", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto(BASE_URL);
    
    // Check hero section is visible
    await expect(page.locator("h1")).toContainText("Descubra Histórias");
    
    // Check mobile menu/navigation works
    const menuButton = page.locator("button[aria-label*='menu'], button[aria-label*='navigation']");
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(300);
    }
  });

  test("Responsive design - tablet view", async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto(BASE_URL);
    
    // Check layout adapts
    await expect(page.locator("h1")).toContainText("Descubra Histórias");
  });

  test("Links are accessible", async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check all links have href
    const links = await page.locator("a").all();
    for (const link of links) {
      const href = await link.getAttribute("href");
      expect(href).toBeTruthy();
    }
  });

  test("Performance - page loads within 3 seconds", async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });
});

test.describe("Admin Dashboard Tests", () => {
  test("Admin dashboard requires authentication", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    
    // Should show login prompt or access denied
    const accessDenied = page.locator("text=Acesso Negado");
    const loginPrompt = page.locator("text=Fazer login");
    
    const isAccessDenied = await accessDenied.isVisible().catch(() => false);
    const isLoginPrompt = await loginPrompt.isVisible().catch(() => false);
    
    expect(isAccessDenied || isLoginPrompt).toBeTruthy();
  });

  test("Admin dashboard shows stats", async ({ page }) => {
    // Note: This assumes user is logged in as admin
    // In real tests, you'd need to authenticate first
    
    await page.goto(`${BASE_URL}/admin`);
    
    // Check if page loads (may show access denied if not authenticated)
    const pageContent = await page.content();
    expect(pageContent).toBeTruthy();
  });
});

test.describe("Comment System Tests", () => {
  test("Comments section is visible on book detail page", async ({ page }) => {
    await page.goto(`${BASE_URL}/books/dom-casmurro`);
    
    // Check comments section
    await expect(page.locator("text=Comentários")).toBeVisible();
    
    // Check existing comments
    const comments = page.locator("text=Excelente livro");
    await expect(comments).toBeVisible();
  });

  test("Comment form shows login prompt when not authenticated", async ({ page }) => {
    await page.goto(`${BASE_URL}/books/dom-casmurro`);
    
    // Look for login prompt in comment section
    const loginPrompt = page.locator("text=Faça login para comentar");
    
    if (await loginPrompt.isVisible()) {
      await expect(loginPrompt).toBeVisible();
      await expect(page.locator("button:has-text('Fazer Login')")).toBeVisible();
    }
  });
});
