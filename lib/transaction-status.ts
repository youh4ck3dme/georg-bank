export const STATUS_DELIVERED_LABEL = 'Doručená v banke príjemcu'
export const STATUS_COMPLETED_LABEL = 'Spracovaná'

/**
 * Normalizuje a prekladá stav transakcie pre používateľské rozhranie a doklady.
 * Surové hodnoty z databázy (napr. 'completed', 'pending', 'failed')
 * prekladá do spisovnej bankovej slovenčiny.
 *
 * Ak je poskytnutá časová pečiatka createdAt a od vytvorenia ubehlo aspoň 30 sekúnd,
 * stav spracovanej platby sa dynamicky zmení na 'Doručená v banke príjemcu'.
 */
export function formatTransactionStatus(
  status?: string | null,
  createdAt?: string | Date | number | null,
  nowMs: number = Date.now()
): string {
  const s = status ? status.toLowerCase().trim() : ''

  if (s === 'pending' || s === 'čakajúca' || s === 'čakajúce' || s === 'čaká na spracovanie') {
    return 'Čaká na spracovanie'
  }
  if (s === 'failed' || s === 'odmietnutá' || s === 'odmietnuté' || s === 'zamietnutá' || s === 'zamietnuté') {
    return 'Zamietnutá'
  }
  if (s === 'doručená v banke príjemcu' || s === 'dorucena v banke prijemcu') {
    return STATUS_DELIVERED_LABEL
  }

  // Pre úspešné/spracované platby ('completed', 'Spracovaná', atď.):
  if (createdAt) {
    const createdTime =
      typeof createdAt === 'number' ? createdAt : new Date(createdAt).getTime()
    if (!isNaN(createdTime) && nowMs - createdTime >= 30_000) {
      return STATUS_DELIVERED_LABEL
    }
  }

  return STATUS_COMPLETED_LABEL
}

export function isDeliveredStatus(value: string | undefined | null): boolean {
  return value === STATUS_DELIVERED_LABEL
}

