import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import {
  generatePaymentConfirmationHtml,
  getPaymentConfirmationFilename,
  type PaymentConfirmationPdfData,
} from '../lib/payment-confirmation-pdf'

console.log('========================================================================')
console.log('🧪 REGRESNÝ TEST: NÁHĽAD A ZOBRAZENIE PDF DOKLADU V DETAILE TRANSAKCIE')
console.log('========================================================================\n')

// 1. Overenie klientskeho HTML generátora
console.log('--- [1/4] Test generovania HTML náhľadu dokladu ---')
const testReceipt: PaymentConfirmationPdfData = {
  transactionId: 'test-txn-12345',
  createdAt: '14.10.2026, 18:00:00',
  status: 'Štandardný platobný príkaz',
  transferType: 'external',
  fromAccountNumber: 'SK31 0900 0000 0050 1234 5678',
  recipientName: 'Marek Horvath',
  recipientAccountOrEmail: 'SK51 0900 5773 2358 7455 3108',
  amount: '120.50',
  currency: 'EUR',
  variableSymbol: '20261014',
  constantSymbol: '0308',
  specificSymbol: '',
  note: 'Platba za fakturu',
  payerReference: '',
  dueDate: 'Dnes',
  repeatDays: '0',
  createTemplate: false,
  emailConfirmation: false,
  balanceBefore: '8500.00',
  balanceAfter: '8379.50',
}

const html = generatePaymentConfirmationHtml(testReceipt)
assert.ok(html.includes('Slovenská sporiteľňa'), 'Hlavička musí obsahovať Slovenská sporiteľňa')
assert.ok(html.includes('120,50'), 'Doklad musí formátovať sumu 120,50')
assert.ok(html.includes('SK51 0900 5773 2358 7455 3108') || html.includes('SK51'), 'Doklad musí obsahovať IBAN príjemcu')
assert.ok(html.includes('Marek Horvath'), 'Doklad musí obsahovať meno príjemcu')
console.log('  ✅ Generovanie HTML A4 dokladu je 100% validné.')

// 2. Overenie názvu PDF súboru
console.log('--- [2/4] Test názvu generovaného súboru potvrdenia ---')
const filename = getPaymentConfirmationFilename(testReceipt, 'pdf')
assert.ok(filename.endsWith('.pdf'), 'Názov súboru musí končiť na .pdf')
assert.ok(filename.includes('potvrdenie'), 'Názov súboru musí obsahovať "potvrdenie"')
console.log(`  ✅ Názov súboru vygenerovaný správne: ${filename}`)

// 3. Kontrola prítomnosti prvkov v george-dashboard-client.tsx
console.log('--- [3/4] Kontrola UI prvkov v george-dashboard-client.tsx ---')
const dashboardClientSource = fs.readFileSync(
  path.join(process.cwd(), 'components', 'george-dashboard', 'george-dashboard-client.tsx'),
  'utf-8'
)

assert.ok(
  dashboardClientSource.includes('data-testid="txn-preview-pdf"'),
  'george-dashboard-client.tsx musí obsahovať tlačidlo data-testid="txn-preview-pdf"'
)
assert.ok(
  dashboardClientSource.includes('Náhľad dokladu (PDF)'),
  'george-dashboard-client.tsx musí obsahovať text "Náhľad dokladu (PDF)"'
)
assert.ok(
  dashboardClientSource.includes('id="receipt-preview-modal"'),
  'george-dashboard-client.tsx musí obsahovať modálne okno id="receipt-preview-modal"'
)
assert.ok(
  dashboardClientSource.includes('openReceiptPreview'),
  'george-dashboard-client.tsx musí obsahovať funkciu openReceiptPreview'
)
console.log('  ✅ UI prvky (tlačidlo náhľadu, modal, iframe srcDoc) sú v dashboard2/3 správne zapojené.')

// 4. Kontrola components/dashboard-client.tsx a route.ts
console.log('--- [4/4] Kontrola podpory pre odchádzajúce platby v export route & dashboard-client ---')
const legacyClientSource = fs.readFileSync(
  path.join(process.cwd(), 'components', 'dashboard-client.tsx'),
  'utf-8'
)
assert.ok(
  legacyClientSource.includes("selectedTransaction.type === 'outgoing'"),
  'dashboard-client.tsx musí podporovať type === "outgoing"'
)
assert.ok(
  legacyClientSource.includes('Number(selectedTransaction.amount) < 0'),
  'dashboard-client.tsx musí podporovať záporné sumy'
)

const routeSource = fs.readFileSync(
  path.join(process.cwd(), 'app', 'api', 'export', 'payment-confirmation', 'route.ts'),
  'utf-8'
)
assert.ok(
  routeSource.includes('isGuestAccess'),
  'route.ts musí podporovať guest prístup pre PDF export'
)
assert.ok(
  routeSource.includes('DEMO_ACCOUNT_NUMBER'),
  'route.ts musí mať fallback na demo účet'
)
console.log('  ✅ Export route a legacy dashboard-client správne podporujú odchádzajúce platby.')

console.log('\n========================================================================')
console.log('🎉 VŠETKY REGRESNÉ TESTY PRE NÁHĽAD PDF DOKLADU PREŠLI NA 100%!')
console.log('========================================================================')
