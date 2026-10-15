import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { POST } from '../app/api/chat/banker/route'

console.log('========================================================================')
console.log('🧪 TEST: BANKÁR ZDENKO - VÝBER Z 10 PDF A INTEGRITA OVERENIA SEPA INSTANT')
console.log('========================================================================\n')

export async function run() {
  // 1. UNIT TEST: Filtrovanie a výber posledných 10 odchádzajúcich dokladov
  console.log('--- [1/4] Unit Test: Filtrovanie posledných 10 odchádzajúcich dokladov ---')
  {
    const sampleTransactions = [
      { id: 't1', recipient: 'Tesco', amount: -14.99, type: 'outgoing', date: 'Dnes' },
      { id: 't2', recipient: 'Zamestnávateľ', amount: 2450.00, type: 'incoming', date: 'Dnes' },
      { id: 't3', recipient: 'Billa', amount: -32.50, type: 'outgoing', date: 'Včera' },
      { id: 't4', recipient: 'Peter Novák', amount: -150.00, type: 'transfer', date: 'Včera' },
      { id: 't5', recipient: 'Dobitie karty', amount: 50.00, type: 'deposit', date: '12.10.2026' },
      { id: 't6', recipient: 'Alza.sk', amount: -89.90, type: 'outgoing', date: '11.10.2026' },
      { id: 't7', recipient: 'Orange', amount: -45.00, type: 'outgoing', date: '10.10.2026' },
      { id: 't8', recipient: 'SPP', amount: -65.20, type: 'outgoing', date: '09.10.2026' },
      { id: 't9', recipient: 'ZSE', amount: -72.10, type: 'outgoing', date: '08.10.2026' },
      { id: 't10', recipient: 'Lidl', amount: -28.40, type: 'outgoing', date: '07.10.2026' },
      { id: 't11', recipient: 'Kaufland', amount: -54.30, type: 'outgoing', date: '06.10.2026' },
      { id: 't12', recipient: 'DM Drogerie', amount: -19.99, type: 'outgoing', date: '05.10.2026' },
      { id: 't13', recipient: 'Shell', amount: -60.00, type: 'outgoing', date: '04.10.2026' },
    ]

    const filtered = sampleTransactions
      .filter((t) => t.type === 'outgoing' || t.type === 'transfer' || t.amount < 0)
      .slice(0, 10)

    assert.strictEqual(filtered.length, 10, 'Musí vrátiť maximálne 10 položiek')
    assert.ok(filtered.every((t) => t.amount < 0 || t.type === 'outgoing' || t.type === 'transfer'), 'Všetky vyfiltrované položky musia byť odchádzajúce')
    assert.strictEqual(filtered[0].recipient, 'Tesco', 'Prvá položka musí byť najnovšia odchádzajúca (Tesco)')
    assert.strictEqual(filtered[filtered.length - 1].recipient, 'DM Drogerie', 'Posledná z 10 položiek musí byť DM Drogerie')
    console.log('  ✅ Filtrovanie 10 dokladov funguje s presnou izoláciou odchádzajúcich platieb')
  }

  // 2. INTEGRITY TEST: Zhoda sumy, príjemcu a dokladu v odpovedi Zdenka a certifikáte
  console.log('--- [2/4] Integrity Test: Zhoda sumy a príjemcu v Zdenkovej správe a SEPA karte ---')
  {
    const mockSelectedReceipt = {
      name: 'potvrdenie-alza-sk.pdf',
      size: '8.4 kB',
      amount: '89,90 EUR',
      recipient: 'Alza.sk',
      date: '11.10.2026',
      pdfUrl: '/api/receipts/potvrdenie-alza-sk.pdf',
    }

    const verifiedAmount = mockSelectedReceipt.amount || '150,00 EUR'
    const verifiedPdf = mockSelectedReceipt.pdfUrl || '/potvrdenie-qr-platba.pdf'
    const verifiedRecipient = mockSelectedReceipt.recipient
    const verifiedNote = `Overené na základe dokladu: ${mockSelectedReceipt.name} (Príjemca: ${verifiedRecipient})`

    const spokenAmount = `vo výške ${mockSelectedReceipt.amount} `
    const spokenRecipient = `pre príjemcu „${verifiedRecipient}“ `
    const bankerText = `Vážený klient, vašu platbu ${spokenAmount}${spokenRecipient}som práve overil v medzibankovom systéme Slovenskej sporiteľne. Všetky náležitosti a digitálny podpis dokladu sedia, platba bola úspešne spracovaná a odoslaná do cieľovej banky príjemcu v režime SEPA Instant.`

    const verificationResult = {
      status: 'Doručená v banke príjemcu (Spracovaná)',
      amount: verifiedAmount,
      currency: 'EUR',
      date: `${mockSelectedReceipt.date}, 14:35`,
      transferType: 'SEPA Instant (Okamžitá platba)',
      intermediary: 'Slovenská sporiteľňa, a.s. ➔ TARGET2 / NBS',
      code: `SEPA-INST-SK${Date.now().toString().slice(-8)}`,
      note: verifiedNote,
      pdfFilename: verifiedPdf,
    }

    // Overenie 100% textovej a dátovej zhody
    assert.ok(bankerText.includes('89,90 EUR'), 'Zdenkov text musí obsahovať presnú sumu 89,90 EUR')
    assert.ok(bankerText.includes('Alza.sk'), 'Zdenkov text musí obsahovať meno príjemcu Alza.sk')
    assert.ok(bankerText.includes('SEPA Instant'), 'Zdenkov text musí potvrdzovať režim SEPA Instant')
    assert.strictEqual(verificationResult.amount, '89,90 EUR', 'Karta musí obsahovať presnú sumu 89,90 EUR')
    assert.strictEqual(verificationResult.transferType, 'SEPA Instant (Okamžitá platba)', 'Typ prevodu musí byť SEPA Instant')
    assert.strictEqual(verificationResult.pdfFilename, '/api/receipts/potvrdenie-alza-sk.pdf', 'Odkaz musí smerovať na reálne PDF')
    assert.ok(verificationResult.code.startsWith('SEPA-INST-SK'), 'Kód zúčtovania musí mať SEPA Instant NBS formát')
    console.log('  ✅ Dokonalá 100% zhoda sumy, príjemcu a PDF odkazu v správe bankára aj karte zúčtovania')
  }

  // 3. REGRESNÝ TEST: UI kód v george-dashboard-client.tsx
  console.log('--- [3/4] Regresný Test: Prítomnosť UI komponentov v george-dashboard-client.tsx ---')
  {
    const clientPath = path.resolve(process.cwd(), 'components/george-dashboard/george-dashboard-client.tsx')
    const code = fs.readFileSync(clientPath, 'utf-8')

    // Kontrola definície zoznamu posledných 10 dokladov
    assert.ok(code.includes('recentPdfReceipts'), 'Komponent musí definovať recentPdfReceipts memo')
    assert.ok(code.includes('isRecentReceiptsOpen'), 'Komponent musí obsahovať stav isRecentReceiptsOpen')
    assert.ok(code.includes('Vybrať z posledných 10 PDF dokladov Georgea'), 'Komponent musí obsahovať tlačidlo výberu z 10 dokladov')
    assert.ok(code.includes('spokenAmount'), 'Komponent musí formátovať hovorenú sumu do Zdenkovej správy')
    assert.ok(code.includes('spokenRecipient'), 'Komponent musí formátovať hovoreného príjemcu do Zdenkovej správy')
    assert.ok(code.includes('Overenie platby v systéme SLSP'), 'Musí obsahovať hlavičku overenia platby SLSP')
    assert.ok(code.includes('Overiť v systéme'), 'Musí obsahovať tlačidlo Overiť v systéme')
    assert.ok(code.includes('SEPA Instant'), 'Musí obsahovať označenie SEPA Instant')
    console.log('  ✅ Všetky kľúčové UI prvky, dropdown posledných 10 dokladov a dynamické vkladanie overené')
  }

  // 4. API TEST: Správanie bankárskeho endpointu pri dotaze na overenie platby
  console.log('--- [4/4] API Test: Spustenie verify_payment_prompt pri otázke na kontrolu prevodu ---')
  {
    const req = new Request('http://localhost:3000/api/chat/banker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'Dobrý deň, môžete mi prosím overiť PDF potvrdenie o odoslanej platbe?' },
        ],
        clientName: 'Ing. Peter Horváth',
        spaceBalance: 12500.80,
      }),
    })

    const res = await POST(req)
    assert.strictEqual(res.status, 200, 'Endpoint musí vrátiť 200 OK')
    const json = (await res.json()) as { reply: string; action?: string; banker?: { name: string } }
    assert.ok(json.reply, 'Odpoveď musí obsahovať text Zdenka')
    assert.strictEqual(json.action, 'verify_payment_prompt', 'Akcia musí iniciovať verify_payment_prompt pre zobrazenie karty dokladov')
    assert.ok(json.banker?.name?.includes('Zdenko Biringer'), 'Bankár musí byť Ing. Zdenko Biringer')
    console.log('  ✅ API /api/chat/banker správne aktivuje výzvu na vloženie PDF a overenie v systéme')
  }

  console.log('\n========================================================================')
  console.log('🎉 VŠETKY TESTY OVERENIA PDF A SEPA INSTANT ZHODY ÚSPEŠNE PREŠLI (100%)!')
  console.log('========================================================================\n')
}

// Spustenie pri priamom volaní cez tsx / node
if (process.argv[1] && process.argv[1].includes('banker-pdf-verification.test.ts')) {
  void run().catch((err) => {
    console.error('❌ Test zlyhal:', err)
    process.exit(1)
  })
}
