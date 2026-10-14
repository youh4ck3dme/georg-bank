import assert from 'assert'
import {
  formatTransactionStatus,
  isDeliveredStatus,
  STATUS_DELIVERED_LABEL,
  STATUS_COMPLETED_LABEL,
} from '../lib/transaction-status'
import { sk } from '../lib/dictionaries/sk'

console.log('========================================================================')
console.log('🧪 REGRESNÝ TEST: PREKLAD A DYNAMICKÝ DISPLAY STAVU ("Spracovaná" ➔ "Doručená v banke príjemcu")')
console.log('========================================================================\n')

// 1. Test formatTransactionStatus helper bez časovej pečiatky (statická normalizácia)
console.log('--- [1/5] Test funkcie formatTransactionStatus() (statický preklad) ---')
assert.strictEqual(formatTransactionStatus('completed'), 'Spracovaná', 'completed musí vrátiť "Spracovaná"')
assert.strictEqual(formatTransactionStatus('COMPLETED'), 'Spracovaná', 'veľké písmená COMPLETED musia vrátiť "Spracovaná"')
assert.strictEqual(formatTransactionStatus(' completed '), 'Spracovaná', 'trimming completed musí vrátiť "Spracovaná"')
assert.strictEqual(formatTransactionStatus('Spracované'), 'Spracovaná', 'starý tvar Spracované musí vrátiť "Spracovaná"')
assert.strictEqual(formatTransactionStatus('spracovane'), 'Spracovaná', 'spracovane bez diakritiky musí vrátiť "Spracovaná"')
assert.strictEqual(formatTransactionStatus('Spracovaná'), 'Spracovaná', 'Spracovaná musí vrátiť "Spracovaná"')
assert.strictEqual(formatTransactionStatus('pending'), 'Čaká na spracovanie', 'pending musí vrátiť "Čaká na spracovanie"')
assert.strictEqual(formatTransactionStatus('failed'), 'Zamietnutá', 'failed musí vrátiť "Zamietnutá"')
assert.strictEqual(formatTransactionStatus(undefined), 'Spracovaná', 'undefined musí vrátiť predvolené "Spracovaná"')
assert.strictEqual(formatTransactionStatus(null), 'Spracovaná', 'null musí vrátiť predvolené "Spracovaná"')
assert.strictEqual(formatTransactionStatus(''), 'Spracovaná', 'prázdny reťazec musí vrátiť predvolené "Spracovaná"')
console.log('  ✅ Všetky vstupy do formatTransactionStatus() boli správne normalizované.\n')

// 2. Test 30-sekundového dynamického prechodu: "Spracovaná" ➔ "Doručená v banke príjemcu"
console.log('--- [2/5] Test dynamického 30-sekundového prechodu stavu ---')
const baseTime = 1_700_000_000_000

// A) Čerstvá platba (5 sekúnd od vytvorenia)
const freshCreatedTime = new Date(baseTime).toISOString()
const statusFresh = formatTransactionStatus('completed', freshCreatedTime, baseTime + 5_000)
assert.strictEqual(statusFresh, STATUS_COMPLETED_LABEL, 'Pred 30s musí byť stav "Spracovaná"')
assert.strictEqual(isDeliveredStatus(statusFresh), false, 'Pred 30s isDeliveredStatus musí byť false')
console.log(`  ✅ 5 sekúnd po vytvorení: stav je "${statusFresh}" (biela farba)`)

// B) Platba presne v momente 29.9s (stále Spracovaná)
const status29s = formatTransactionStatus('completed', freshCreatedTime, baseTime + 29_900)
assert.strictEqual(status29s, STATUS_COMPLETED_LABEL, 'V 29.9s musí byť stav stále "Spracovaná"')
console.log(`  ✅ 29.9 sekúnd po vytvorení: stav je "${status29s}"`)

// C) Platba po 30 sekundách (automatický prechod)
const status30s = formatTransactionStatus('completed', freshCreatedTime, baseTime + 30_000)
assert.strictEqual(status30s, STATUS_DELIVERED_LABEL, 'Po 30s musí byť stav "Doručená v banke príjemcu"')
assert.strictEqual(isDeliveredStatus(status30s), true, 'Po 30s isDeliveredStatus musí byť true')
console.log(`  ✅ 30 sekúnd po vytvorení: stav je "${status30s}" (zelená farba)`)

// D) Historická platba (1 hodina stará)
const statusOlder = formatTransactionStatus('completed', freshCreatedTime, baseTime + 3_600_000)
assert.strictEqual(statusOlder, STATUS_DELIVERED_LABEL, 'Historická platba musí byť "Doručená v banke príjemcu"')
console.log(`  ✅ 1 hodina po vytvorení: stav je "${statusOlder}" (zelená farba)\n`)

// 3. Test slovenskej lokalizácie (sk slovník)
console.log('--- [3/5] Test synchronizácie SK slovníka (sk.ts) ---')
assert.strictEqual(sk.pdf.status.completed, 'Spracovaná', 'sk.pdf.status.completed musí byť "Spracovaná"')
console.log('  ✅ Slovník sk.ts má completed nastavené na "Spracovaná".\n')

// 4. Test simulácie položiek v Detail prevodu (Detail prevodu row rendering)
console.log('--- [4/5] Test simulácie detailu prevodu (Detail prevodu row rendering) ---')
const mockTxFromDb = {
  id: 'txn-test-123',
  amount: -1190.48,
  status: 'completed',
  recipient: 'platba za pc',
  date: '14. 10. 2026',
  createdAt: new Date(Date.now() - 45_000).toISOString(), // 45s stará platba
}

const renderedStatus = formatTransactionStatus(mockTxFromDb.status, mockTxFromDb.createdAt)
assert.strictEqual(renderedStatus, STATUS_DELIVERED_LABEL, 'Po 45s musí byť stav "Doručená v banke príjemcu"')
assert.ok(isDeliveredStatus(renderedStatus), 'isDeliveredStatus musí byť true')
console.log(`  ✅ Transakcia vytvorená pred 45s sa zobrazí ako: "${renderedStatus}" so zelenou triedou\n`)

// 5. Test ochrany pred spätnou regresiou (Contract check)
console.log('--- [5/5] Ochrana pred regresiou (No raw "completed" in UI layer) ---')
const simulatedDetailRows: [string, string][] = [
  ['Suma', '- 1 190,48 €'],
  ['Typ', 'Odchádzajúca'],
  ['Stav', formatTransactionStatus(mockTxFromDb.status, mockTxFromDb.createdAt)],
  ['Dátum', mockTxFromDb.date],
]

const statusRow = simulatedDetailRows.find(([label]) => label === 'Stav')
assert.ok(statusRow, 'Riadok "Stav" musí existovať')
assert.strictEqual(statusRow![1], STATUS_DELIVERED_LABEL, 'Hodnota riadku "Stav" musí byť "Doručená v banke príjemcu"')
console.log('  ✅ Riadok "Stav" v tabuľke detailu transakcie má hodnotu "Doručená v banke príjemcu".\n')

console.log('🎉 [SUCCESS] VŠETKY REGRESNÉ TESTY PRE DYNAMICKÝ 30-SEKUNDOVÝ STAV PREŠLI NA 100%!')
