import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { bankAccount, transaction } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { buildPaymentConfirmationFromTransaction } from '@/lib/payment-confirmation-from-transaction'
import {
  generatePaymentConfirmationHtml,
  getPaymentConfirmationFilename,
} from '@/lib/payment-confirmation-pdf'
import {
  afterPdfSuccess,
  clearAccessCookie,
  readAccessCookieToken,
  requireAccessForPdf,
} from '@/lib/access-session'
import { isSuperadminCode, isSuperadminToken } from '@/lib/access-flow'
import { createServiceSupabase } from '@/lib/demo-transactions-supabase'
import { DEMO_ACCOUNT_NUMBER } from '@/lib/demo-user'

export async function GET(req: Request) {
  try {
    const cookieToken = await readAccessCookieToken()
    const pdfGate = await requireAccessForPdf(cookieToken)
    if (!pdfGate.ok) {
      const response = NextResponse.json({ error: pdfGate.error }, { status: pdfGate.status })
      return pdfGate.status === 403 ? clearAccessCookie(response) : response
    }
    const accessSessionRow = pdfGate.skipped ? null : pdfGate.session

    const isSuperadmin = Boolean(
      isSuperadminToken(cookieToken) ||
      isSuperadminCode(cookieToken) ||
      isSuperadminToken(accessSessionRow?.sessionToken)
    )

    const url = new URL(req.url)
    const transactionId = url.searchParams.get('transactionId')

    if (!transactionId) {
      return NextResponse.json({ error: 'Missing transactionId' }, { status: 400 })
    }

    const session = await auth.api.getSession({ headers: req.headers })
    const isGuestAccess = Boolean(pdfGate.ok && (cookieToken || pdfGate.skipped))
    if (!session?.user && !isGuestAccess) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session?.user?.id

    const txnResult = await db
      .select()
      .from(transaction)
      .where(
        and(
          eq(transaction.id, transactionId),
          userId ? eq(transaction.userId, userId) : undefined,
          isSuperadmin ? undefined : eq(transaction.isSuperadmin, false),
        ),
      )
      .limit(1)

    let txn = txnResult[0]
    if (!txn) {
      const supabase = createServiceSupabase()
      if (supabase) {
        const query = supabase
          .from('transaction')
          .select('*')
          .eq('id', transactionId)
          .limit(1)
        if (!isSuperadmin) {
          query.eq('isSuperadmin', false)
        }
        const { data } = await query.maybeSingle()
        if (data) {
          txn = {
            id: data.id,
            userId: data.userId || 'guest',
            fromAccountId: data.fromAccountId || 'demo-acc',
            toAccountId: data.toAccountId || null,
            amount: Number(data.amount) || 0,
            currency: data.currency || 'EUR',
            type: data.type || 'outgoing',
            status: data.status || 'completed',
            description: data.description || '',
            recipientName: data.recipientName || data.recipient || '',
            recipientIban: data.recipientIban || data.iban || '',
            variableSymbol: data.variableSymbol || data.vs || null,
            constantSymbol: data.constantSymbol || '0308',
            specificSymbol: data.specificSymbol || null,
            note: data.note || null,
            balanceBefore: data.balanceBefore !== null && data.balanceBefore !== undefined ? Number(data.balanceBefore) : null,
            balanceAfter: data.balanceAfter !== null && data.balanceAfter !== undefined ? Number(data.balanceAfter) : null,
            createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
            updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
            pdfUrl: data.pdfUrl || null,
            isSuperadmin: Boolean(data.isSuperadmin),
          } as unknown as typeof txn
        }
      }
    }

    if (!txn) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    const OUTGOING_TYPES = ['withdrawal', 'transfer', 'outgoing']
    if (!OUTGOING_TYPES.includes(txn.type)) {
      return NextResponse.json({ error: 'Confirmation available only for outgoing payments' }, { status: 400 })
    }

    const accountId = txn.fromAccountId
    const account = accountId
      ? (
          await db
            .select()
            .from(bankAccount)
            .where(
              and(
                eq(bankAccount.id, accountId),
                userId ? eq(bankAccount.userId, userId) : undefined,
              ),
            )
            .limit(1)
        )[0]
      : undefined

    const accountRecord = {
      accountNumber: account?.accountNumber || DEMO_ACCOUNT_NUMBER,
      currency: account?.currency || 'EUR',
    }

    const confirmation = buildPaymentConfirmationFromTransaction(txn, accountRecord)
    const htmlContent = generatePaymentConfirmationHtml(confirmation)

    if (accessSessionRow) {
      await afterPdfSuccess(accessSessionRow)
    }

    const response = new NextResponse(htmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="${getPaymentConfirmationFilename(confirmation)}"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    })
    return accessSessionRow ? clearAccessCookie(response) : response
  } catch (error) {
    console.error('Error generating payment confirmation:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}