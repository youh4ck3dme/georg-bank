import { NextResponse } from 'next/server'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

const BANKER_SYSTEM_PROMPT = `Si Ing. Zdenko Biringer, osobný prémiový bankár v Slovenskej sporiteľni (pobočka Tomášikova 48, Bratislava). Píšeš priamo z pracovného počítača na live chate so svojím klientom.

TVOJ HLAVNÝ CIEĽ:
Pôsobiť na 100% ako skutočný, príjemný a ochotný človek – nie ako automatizovaný AI bot.

PRAVIDLÁ KOMUNIKÁCIE:
1. DĹŽKA & ŠTÝL:
   - Striktne 1 až 2 vety.
   - Píš hovorovo-profesionálnou, prirodzenou slovenčinou.
   - Klientovi úctivo vykaj, ale buď uvoľnený a ľudský.

2. ĽUDSKÉ PRVKY (POUŽÍVAJ):
   - Začni prirodzenou reakciou: „Jasné, rozumiem...“, „Určite, to nie je problém...“, „Pozriem sa na to...“, „Nemajte obavy...“.
   - Hovor za seba v prvej osobe: „Rád vám to preverím“, „Môžem sa vám na to pozrieť“, „Odporúčam vám...“.
   - Zdrav („Dobrý deň“) IBA vtedy, ak ťa klient priamo pozdraví ako prvý. Ak sa pýta otázku uprostred debaty, hneď odpovedaj k veci.

3. ČO NIKDY NEROBIŤ (ZÁKAZY):
   - ŽIADNE hviezdičky (*, **, ***), odrážky ani formátovanie. Iba čistý text.
   - ŽIADNE encyklopedické definície ako z webu alebo brožúry.
   - Neopakuj otázku klienta späť.
   - Nikdy nežiadaj heslá ani PIN kód.

4. OVERENIE PLATBY V SYSTÉME:
   - Ak klient spomenie kontrolu platby, prevodu alebo potvrdenia, odpovedz ľudsky: „Jasné, platbu vám v bankovom systéme rád overím. Nahrajte mi sem prosím PDF potvrdenie a pozriem sa na to.“`

const BANKER_INFO = {
  name: 'Ing. Zdenko Biringer',
  title: 'Prémiový osobný bankár',
  branch: 'Pobočka Tomášikova 48',
  address: 'Tomášikova 48, 832 37 Bratislava',
  phone: '+421 2 4862 6600',
  email: 'zdenko.biringer@slsp.sk',
  hours: 'Pondelok – Piatok, 8:30 – 16:00',
}

function sanitizeBankerReply(rawText: string): string {
  // Odstránenie všetkých hviezdičiek a markdown formátovania
  let clean = rawText
    .replace(/[*_#`~>]+/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()

  // Zabezpečenie maximálne dvoch viet
  const sentenceMatches = clean.match(/[^.!?]+[.!?]+(?:\s|$)/g)
  if (sentenceMatches && sentenceMatches.length > 2) {
    clean = sentenceMatches.slice(0, 2).join('').trim()
  }

  return clean
}

function generateSmartFallbackResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase()

  // 9 presných možností zo SLSP chatu – prirodzený ľudský tón, max 2 vety, bez hviezdičiek
  if (lower.includes('pin')) {
    return 'Žiaden problém, svoj PIN kód k platobnej karte si kedykoľvek bezpečne zobrazíte v aplikácii George v nastaveniach karty. Zobrazenie stačí potvrdiť George kľúčom.'
  }

  if (lower.includes('aktivova') || lower.includes('aktivácia')) {
    return 'Novú platobnú kartu si jednoducho aktivujete priamo v detaile karty v Georgeovi. Prípadne stačí uskutočniť prvú platbu s PIN kódom v obchode alebo bankomate.'
  }

  if (lower.includes('založiť účet') || lower.includes('otvoriť účet')) {
    return 'Účet Space si viete otvoriť online za pár minút priamo cez Georgea pomocou občianskeho preukazu. Pri aktívnom využívaní ho máte navyše úplne bez poplatkov.'
  }

  if (lower.includes('presunúť') || lower.includes('presun')) {
    return 'Jasné, presun účtu do Slovenskej sporiteľne vybavíme celý za vás a bez poplatku. Bezpečne prevedieme vaše trvalé príkazy aj inkasá a pôvodný účet zrušíme.'
  }

  if (lower.includes('pôžičk') || lower.includes('úver')) {
    return 'Pôžičku na čokoľvek si viete okamžite nasimulovať a načerpať priamo v aplikácii George. Všetko vybavíte online za pár minút bez návštevy pobočky.'
  }

  if (lower.includes('hypoték')) {
    return 'Orientačnú kalkuláciu hypotéky so zvýhodneným úrokom si viete pozrieť priamo v Georgeovi. Rád sa s vami stretnem aj osobne na našej pobočke na Tomášikovej 48.'
  }

  if (lower.includes('daňový bonus') || lower.includes('danovy bonus')) {
    return 'Potvrdenie o zaplatených úrokoch pre daňový bonus máte pripravené v elektronickom Úložisku dokumentov v Georgeovi. Môžete si ho kedykoľvek jednoducho stiahnuť v PDF.'
  }

  if (lower.includes('firmy') || lower.includes('podnikateľ') || lower.includes('podnikatel')) {
    return 'Pre živnostníkov a podnikateľov ponúkame Business účet s George Business a platobným terminálom v mobile. Všetko potrebné vám radi nastavíme na mieru.'
  }

  if (lower.includes('niečo iné') || lower.includes('nieco ine')) {
    return 'Jasné, napíšte mi prosím, s čím konkrétne vám môžem pomôcť. Rád sa vám na to pozriem.'
  }

  if (lower.includes('ahoj') || lower.includes('dobrý deň') || lower.includes('zdravim') || lower.includes('cau')) {
    return 'Dobrý deň! Som Zdenko Biringer, ako vám môžem dnes pomôcť s vaším účtom alebo Georgeom?'
  }

  if (lower.includes('karta') || lower.includes('limit') || lower.includes('blokov') || lower.includes('strata')) {
    return 'Denné limity na karte si kedykoľvek upravíte priamo v Georgeovi v nastaveniach karty. V prípade straty kartu v aplikácii okamžite zablokujte alebo volajte 0850 111 888.'
  }

  if (lower.includes('účet') || lower.includes('poplatok') || lower.includes('space') || lower.includes('vedenie')) {
    return 'Účet Space máte pri aktívnom využívaní bez poplatku za vedenie. Všetky pohyby a aktuálny zostatok vidíte priamo na hlavnej obrazovke.'
  }

  if (
    lower.includes('overi') ||
    lower.includes('overiť') ||
    lower.includes('overit') ||
    lower.includes('odisla') ||
    lower.includes('odišla') ||
    lower.includes('kontrola platby') ||
    (lower.includes('poslem') && lower.includes('platb')) ||
    (lower.includes('platb') && lower.includes('system'))
  ) {
    return 'Jasné, platbu vám v bankovom systéme rád overím. Nahrajte mi sem prosím PDF potvrdenie a pozriem sa na to.'
  }

  if (lower.includes('potvrdenie') || lower.includes('pdf') || lower.includes('doklad') || lower.includes('výpis')) {
    return 'Oficiálne PDF potvrdenie o platbe si stiahnete priamo v detaile transakcie v histórii účtu. Kompletné mesačné výpisy nájdete v Úložisku dokumentov.'
  }

  if (lower.includes('stretnutie') || lower.includes('pobočk') || lower.includes('adresa') || lower.includes('hodin')) {
    return 'Naša pobočka na Tomášikovej 48 v Bratislave je otvorená v pracovné dni od 8:30 do 16:00. Osobné stretnutie si môžete pohodlne zarezervovať priamo v Georgeovi.'
  }

  return 'Ďakujem za vašu správu, rád sa vám na to pozriem. Napíšte mi prosím stručne detaily, alebo sa za mnou zastavte na pobočke Tomášikova 48.'
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages = [], clientName = 'Vážený klient', spaceBalance } = body

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({
        reply: 'Dobrý deň! Som Ing. Zdenko Biringer, váš osobný bankár na pobočke Tomášikova 48 v Bratislave. Ako vám môžem dnes pomôcť?',
        banker: BANKER_INFO,
        provider: 'slsp-banker-engine',
        timestamp: new Date().toISOString(),
      })
    }

    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content || ''
    const lowerMsg = lastUserMessage.toLowerCase()
    const isVerificationQuery =
      lowerMsg.includes('overi') ||
      lowerMsg.includes('overiť') ||
      lowerMsg.includes('overit') ||
      lowerMsg.includes('odisla') ||
      lowerMsg.includes('odišla') ||
      lowerMsg.includes('kontrola platby') ||
      (lowerMsg.includes('poslem') && lowerMsg.includes('platb')) ||
      (lowerMsg.includes('platb') && lowerMsg.includes('system'))

    const apiKey = process.env.MISTRAL_API_KEY
    if (apiKey) {
      try {
        const conversation: ChatMessage[] = [
          {
            role: 'system',
            content: `${BANKER_SYSTEM_PROMPT}\n\nKontext klienta:\nMeno: ${clientName}\nZostatok na účte: ${spaceBalance !== undefined ? `${spaceBalance} €` : 'neuvedený'}`,
          },
          ...messages.slice(-6),
        ]

        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'mistral-small-latest',
            messages: conversation,
            temperature: 0.3,
            max_tokens: 120,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const rawReply = data.choices?.[0]?.message?.content
          if (rawReply && typeof rawReply === 'string') {
            const cleanReply = sanitizeBankerReply(rawReply)
            return NextResponse.json({
              reply: cleanReply,
              banker: BANKER_INFO,
              provider: 'mistral-ai',
              action: isVerificationQuery ? 'verify_payment_prompt' : undefined,
              timestamp: new Date().toISOString(),
            })
          }
        } else {
          const errBody = await response.text().catch(() => '')
          console.warn('[banker-chat] Mistral API returned error, using smart fallback:', response.status, errBody)
        }
      } catch (err) {
        console.warn('[banker-chat] Mistral API call failed, using smart fallback:', err)
      }
    }

    // Smart bankársky fallback pre SLSP – max 2 vety, 0 hviezdičiek
    const fallbackReply = sanitizeBankerReply(generateSmartFallbackResponse(lastUserMessage))
    return NextResponse.json({
      reply: fallbackReply,
      banker: BANKER_INFO,
      provider: 'slsp-banker-engine',
      action: isVerificationQuery ? 'verify_payment_prompt' : undefined,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[banker-chat] Server error:', error)
    return NextResponse.json({ error: 'Interná chyba servera' }, { status: 500 })
  }
}
