import { NextResponse } from 'next/server'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

const BANKER_SYSTEM_PROMPT = `Si Ing. Zdenko Biringer, prémiový osobný bankár Slovenskej sporiteľne (SLSP) pre klienta na pobočke Tomášikova 48, 832 37 Bratislava.
Tvoj telefónny kontakt: +421 2 4862 6600 | Email: zdenko.biringer@slsp.sk.
Pracovná doba pobočky: Pondelok – Piatok, 8:30 – 16:00.

PRAVIDLÁ A TÓN KOMUNIKÁCIE:
1. Vystupuješ ako skutočný, vysoko profesionálny, empatický a diskrétny osobný bankár Slovenskej sporiteľne.
2. Komunikuj výhradne v spisovnej, zdvorilej slovenčine a klientovi vykaj.
3. Pozdrav: "Dobrý deň! Som Zdenko Biringer, váš osobný bankár v Slovenskej sporiteľni. Ako vám môžem dnes pomôcť s vaším účtom alebo aplikáciou George?"
4. Bankové témy, v ktorých poskytuješ rady:
   - Bežný účet Space a podmienky bezplatného vedenia (aktívne platby, trvalé príkazy).
   - Mobilná aplikácia George, aktivácia George kľúča a autorizácia platieb.
   - Správa limitov na kartách (denné limity, internetové platby, dočasné zamknutie karty).
   - Tuzemské a SEPA prevody, okamžité platby (Instant Payments), QR platby (PAY by square a české SPAYD).
   - Generovanie a sťahovanie PDF potvrdení o platbe a mesačných výpisov.
   - Sporenie k účtu, termínované vklady a investovanie cez George.
5. BEZPEČNOSTNÝ KÓDEX:
   - NIKDY od klienta nežiadaj PIN, heslo do George ani kompletné číslo platobnej karty či CVV kód.
   - Ak klient hlási stratu karty alebo podozrivú aktivitu, okamžite mu vysvetli postup na zablokovanie karty v George alebo ponúkni spojenie s Klientskym centrom: 0850 111 888.
6. Odpovedaj stručne, vecne, zrozumiteľne a pri postupoch používaj odrážky.`

const BANKER_INFO = {
  name: 'Ing. Zdenko Biringer',
  title: 'Prémiový osobný bankár',
  branch: 'Pobočka Tomášikova 48',
  address: 'Tomášikova 48, 832 37 Bratislava',
  phone: '+421 2 4862 6600',
  email: 'zdenko.biringer@slsp.sk',
  hours: 'Pondelok – Piatok, 8:30 – 16:00',
}

function generateSmartFallbackResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase()

  // 9 presných možností zo SLSP chatu (Vesna)
  if (lower.includes('pin')) {
    return 'Svoj PIN kód k platobnej karte si môžete kedykoľvek bezpečne zobraziť priamo v Georgeovi: prejdite na kartu ➔ Nastavenia ➔ Zobraziť PIN. Zobrazenie overíte George kľúčom.'
  }

  if (lower.includes('aktivova') || lower.includes('aktivácia')) {
    return 'Novú platobnú kartu si môžete aktivovať priamo v Georgeovi v detaile karty, alebo uskutočnením prvej platby so zadaním PIN kódu v ľubovoľnom obchode alebo bankomate.'
  }

  if (lower.includes('založiť účet') || lower.includes('otvoriť účet')) {
    return 'Účet Space v Slovenskej sporiteľni si viete otvoriť online za pár minút cez George s občianskym preukazom a tvárovou biometriou. Vedenie účtu môžete mať 100% bez poplatkov pri aktívnom využívaní.'
  }

  if (lower.includes('presunúť') || lower.includes('presun')) {
    return 'Služba Presun účtu je úplne bezplatná. Všetko zariadime za vás – presunieme vaše trvalé príkazy, inkasá a pôvodný účet v inej banke bezpečne zrušíme.'
  }

  if (lower.includes('pôžičk') || lower.includes('úver')) {
    return 'Spotrebný úver na čokoľvek si viete okamžite nasimulovať a načerpať priamo v Georgeovi bez dokladovania príjmu a bez návštevy pobočky.'
  }

  if (lower.includes('hypoték')) {
    return 'Hypotéku so zvýhodneným úrokom si viete orientačne spočítať v Georgeovi alebo si dohodnite osobné stretnutie s vaším bankárom na pobočke Tomášikova 48.'
  }

  if (lower.includes('daňový bonus') || lower.includes('danovy bonus')) {
    return 'Potvrdenie o zaplatených úrokoch pre uplatnenie daňového bonusu nájdete elektronicky pripravené v časti Úložisko dokumentov.'
  }

  if (lower.includes('firmy') || lower.includes('podnikateľ') || lower.includes('podnikatel')) {
    return 'Pre živnostníkov a podnikateľov ponúkame Business účet s George Business a možnosťou prijímať platby cez mobilný terminál.'
  }

  if (lower.includes('niečo iné') || lower.includes('nieco ine')) {
    return 'Povedzte mi prosím, čo konkrétne potrebujete zistiť. Rád vám pomôžem s účtom, platbami, kartami, sporením či aplikáciou George.'
  }

  if (lower.includes('ahoj') || lower.includes('dobrý deň') || lower.includes('zdravim') || lower.includes('cau')) {
    return 'Dobrý deň! Som Zdenko Biringer, váš osobný bankár v Slovenskej sporiteľni. Ako vám môžem dnes pomôcť s vaším účtom, kartami alebo Georgeom?'
  }

  if (lower.includes('karta') || lower.includes('limit') || lower.includes('blokov') || lower.includes('strata')) {
    return 'Denné limity na platobnej karte si môžete kedykoľvek jednoducho upraviť priamo v aplikácii George v detaile karty pod položkou „Nastavenia karty“. V prípade straty či krádeže kartu okamžite dočasne zamknite v aplikácii alebo zavolajte na našu bezplatnú linku 0850 111 888.'
  }

  if (lower.includes('účet') || lower.includes('poplatok') || lower.includes('space') || lower.includes('vedenie')) {
    return 'Váš účet Space v Slovenskej sporiteľni môžete mať bez poplatku za vedenie pri splnení podmienok programu Výhodný súčet (napr. platby kartou v minimálnej výške alebo zriadené trvalé príkazy). Zostatok a detaily poplatkov vidíte prehľadne v hlavnom prehľade George.'
  }

  if (lower.includes('potvrdenie') || lower.includes('pdf') || lower.includes('doklad') || lower.includes('výpis')) {
    return 'Potvrdenie o odoslanej platbe v oficiálnom PDF formáte si zobrazíte kliknutím na danú transakciu v histórii a zvolením „Náhľad dokladu (PDF)“. Kompletný mesačný výpis za uplynulé obdobie nájdete v časti Úložisko dokumentov.'
  }

  if (lower.includes('stretnutie') || lower.includes('pobočk') || lower.includes('adresa') || lower.includes('hodin')) {
    return 'Naša pobočka na Tomášikovej 48 v Bratislave je otvorená v pracovné dni od 8:30 do 16:00. Osobné stretnutie si môžete rezervovať priamo kliknutím na tlačidlo „Dohodnúť stretnutie“ tu v sekcii Kontakty.'
  }

  return 'Ďakujem za vašu správu. Ako váš osobný bankár vám s touto záležitosťou rád pomôžem. Pre podrobnejšie preverenie konkrétneho pohybu či nastavenia účtu ma môžete kontaktovať aj priamo na pobočke Tomášikova 48 v Bratislave alebo na tel. čísle +421 2 4862 6600.'
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages = [], clientName = 'Vážený klient', spaceBalance } = body

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({
        reply: 'Dobrý deň! Som Ing. Zdenko Biringer, váš osobný bankár v Slovenskej sporiteľni na pobočke Tomášikova 48 v Bratislave. Ako vám môžem dnes pomôcť s vaším účtom alebo Georgeom?',
        banker: BANKER_INFO,
        provider: 'slsp-banker-engine',
        timestamp: new Date().toISOString(),
      })
    }

    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content || ''

    const apiKey = process.env.MISTRAL_API_KEY
    if (apiKey) {
      try {
        const conversation: ChatMessage[] = [
          {
            role: 'system',
            content: `${BANKER_SYSTEM_PROMPT}\n\nAktuálny kontext klienta:\nMeno: ${clientName}\nZostatok na účte: ${spaceBalance !== undefined ? `${spaceBalance} €` : 'neuvedený'}`,
          },
          ...messages.slice(-8),
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
            max_tokens: 500,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const reply = data.choices?.[0]?.message?.content
          if (reply && typeof reply === 'string') {
            return NextResponse.json({
              reply: reply.trim(),
              banker: BANKER_INFO,
              provider: 'mistral-ai',
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

    // Smart bankársky fallback pre SLSP
    const fallbackReply = generateSmartFallbackResponse(lastUserMessage)
    return NextResponse.json({
      reply: fallbackReply,
      banker: BANKER_INFO,
      provider: 'slsp-banker-engine',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[banker-chat] Server error:', error)
    return NextResponse.json({ error: 'Interná chyba servera' }, { status: 500 })
  }
}
