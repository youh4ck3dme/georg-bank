import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'

const TARGET_URL = process.env.TEST_TARGET_URL || 'https://gro-kan-1040062317673.europe-west3.run.app'
const ARTIFACTS_DIR = 'C:\\Users\\42195\\.gemini\\antigravity-ide\\brain\\358bccbd-a323-497a-b978-509acfa2c797'

async function runBrowserContrastTest() {
  console.log(`🌐 Spúšťam Playwright browser test kontrastu voči: ${TARGET_URL}`)
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 420, height: 860 }, // Mobile viewport (1:1 app feel)
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
  })
  const page = await context.newPage()

  try {
    // 1. Priamy prechod na /dashboard3
    console.log('  Navigujem na /dashboard3?uncloak=1...')
    await page.goto(`${TARGET_URL}/dashboard3?uncloak=1`, { waitUntil: 'networkidle', timeout: 30000 })

    // Odstránenie prípadného stealth white cloak
    await page.evaluate(() => {
      document.querySelector('[data-testid="stealth-white-cloak"]')?.remove()
    })
    await page.waitForTimeout(500)

    // Ak sme na welcome / access-flow, odomkneme
    if (page.url().includes('/welcome')) {
      console.log('  Stránka vyžaduje odomknutie kódom...')
      const codeInput = page.locator('[data-testid="access-code-input"]')
      if (await codeInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await codeInput.fill('SLSP-2026-VIP')
        await page.click('[data-testid="submit-code"]')
        await page.waitForURL(/.*(dashboard3|dashboard2).*/, { timeout: 15000 })
      }
    }

    // Ak je zobrazený PIN screen, zadáme PIN
    const pinHeading = page.getByText(/Zadajte bezpečnostný PIN/i)
    if (await pinHeading.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('  Zadávam PIN...')
      for (const digit of '888888') {
        const btn = page.locator(`[data-testid="pin-key-${digit}"]`).first()
        if (await btn.isVisible()) {
          await btn.click()
          await page.waitForTimeout(60)
        }
      }
      await page.waitForTimeout(800)
    }

    console.log(`  Aktuálna URL: ${page.url()}`)

    // 2. Kliknutie na ikonu chatu s bankárom
    const fabBtn = page.locator('[data-testid="banker-chat-fab"]')
    await fabBtn.waitFor({ state: 'visible', timeout: 10000 })
    console.log('  Otváram chat s bankárom Zdenkom...')
    await fabBtn.click()

    // 3. Počkáme na zobrazenie modalu chatu
    const chatModal = page.locator('[data-testid="banker-chat-modal"]')
    await chatModal.waitFor({ state: 'visible', timeout: 5000 })
    await page.waitForTimeout(600)

    // 4. Overenie computed styles
    const styles = await page.evaluate(() => {
      const modal = document.querySelector('[data-testid="banker-chat-modal"]')
      const headerTitle = modal?.querySelector('h2')
      const bankerBubble = modal?.querySelector('.banker-bubble') || modal?.querySelector('[class*="bg-[#064ea1]"]')
      const bankerSpan = bankerBubble?.querySelector('span')
      const chip = modal?.querySelector('.chat-suggestion-chip')

      return {
        headerColor: headerTitle ? window.getComputedStyle(headerTitle).color : null,
        bankerBubbleBg: bankerBubble ? window.getComputedStyle(bankerBubble).backgroundColor : null,
        bankerBubbleColor: bankerBubble ? window.getComputedStyle(bankerBubble).color : null,
        bankerSpanColor: bankerSpan ? window.getComputedStyle(bankerSpan).color : null,
        chipColor: chip ? window.getComputedStyle(chip).color : null,
      }
    })

    console.log('  Výsledné computed styles v prehliadači:', styles)

    // 5. Screenshot chatu
    const screenshotPath = path.join(ARTIFACTS_DIR, 'banker_chat_contrast_verified.png')
    await chatModal.screenshot({ path: screenshotPath })
    console.log(`  📸 Screenshot uložený: ${screenshotPath}`)

    return styles
  } finally {
    await browser.close()
  }
}

runBrowserContrastTest()
  .then((res) => {
    console.log('✅ Browser test kontrastu úspešný:', res)
    process.exit(0)
  })
  .catch((err) => {
    console.error('❌ Chyba pri browser teste:', err)
    process.exit(1)
  })
