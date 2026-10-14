'use client'

import React, { useState } from 'react'

/**
 * Rebuilt UI from RebuildSpec:
 * Rezervačný systém pre salóny, gastro a služby | Bookio
 * Source: https://www.bookio.com/sk
 * Design tokens:
 *  - bg: #000000
 *  - surface: #080032
 *  - text: #ffffff
 *  - muted / success: #3fca90
 *  - accent: #ffb719
 *  - border: #de9100
 */

export default function BookioWelcome2Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('SK')

  const languages = [
    { code: 'SK', flag: 'https://flagcdn.com/32x24/sk.webp', name: 'Slovensky' },
    { code: 'CZ', flag: 'https://flagcdn.com/32x24/cz.webp', name: 'Čeština' },
    { code: 'DE', flag: 'https://flagcdn.com/32x24/de.webp', name: 'Deutsch' },
    { code: 'GB', flag: 'https://flagcdn.com/32x24/gb.webp', name: 'English' },
    { code: 'HU', flag: 'https://flagcdn.com/32x24/hu.webp', name: 'Magyar' },
    { code: 'PL', flag: 'https://flagcdn.com/32x24/pl.webp', name: 'Polski' },
  ]

  const featureLinks = [
    { title: 'Rezervačná kniha', desc: 'Prehľadný kalendár a online správa rezervácií v reálnom čase.' },
    { title: 'Kalendár', desc: 'Prepojenie s Google a iPhone kalendárom pre okamžitú synchronizáciu.' },
    { title: 'Rezervácie 24/7', desc: 'Vaši klienti sa objednajú kedykoľvek, aj cez víkendy a sviatky.' },
    { title: 'Pripomienky', desc: 'Automatické SMS a e-mailové notifikácie znižujú výpadky až o 70%.' },
    { title: 'Špeciálne udalosti', desc: 'Workshopy, degustačné večery a jednorazové skupinové termíny.' },
    { title: 'Platené rezervácie', desc: 'Zálohy a platby kartou vopred chránia pred no-show klientmi.' },
    { title: 'Darčekové poukážky', desc: 'Automatizovaný predaj a evidencia poukazov online na webe.' },
    { title: 'Prehľady a štatistiky', desc: 'Kompletný prehľad o tržbách, vyťaženosti zamestnancov a zákazníkoch.' },
    { title: 'Informácie o zákazníkoch', desc: 'História návštev, preferencie a kontakty bezpečne na jednom mieste.' },
    { title: 'Spätná väzba', desc: 'Hodnotenia od spokojných klientov pre rast vašej reputácie.' },
    { title: 'Vzdialený prístup', desc: 'Prístup z mobilu, tabletu alebo notebooku odkiaľkoľvek.' },
    { title: 'Bezpečná archivácia', desc: 'Dáta v bezpečí podľa GDPR s pravidelnými cloudovými zálohami.' },
    { title: 'Správa miestností', desc: 'Riadenie kapacít stolov, boxov, salónikov a pracovísk.' },
    { title: 'Skupinové rezervácie', desc: 'Hromadné objednávky a firemné akcie jednoducho a bez chýb.' },
    { title: 'Google / iPhone Kalendár', desc: 'Obojsmerná automatická synchronizácia s osobnými zariadeniami.' },
  ]

  const stats = [
    { title: 'Rezervácie 24/7', value: '24/7', desc: 'Neustály príjem objednávok aj mimo otváracích hodín.' },
    { title: 'Ušetrite 40% času', value: '40%', desc: 'Menej telefonátov a papierovania, viac času na klientov.' },
    { title: 'Vyššie tržby o 35%', value: '+35%', desc: 'Viac obsadených termínov a platby vopred bez výpadkov.' },
    { title: 'Dokonalý prehľad', value: '100%', desc: 'Všetky rezervácie, tím a tržby prehľadne na jednej obrazovke.' },
    { title: 'Nastavené za pár minút', value: '5 min', desc: 'Rýchle spustenie bez technických znalostí a inštalácií.' },
    { title: 'Priateľský tím ľudí', value: '10+ rokov', desc: 'Skúsená slovenská podpora pripravená pomôcť kedykoľvek.' },
    { title: 'Notifikácie a SMS pripomienky', value: '0 % no-show', desc: 'Automatické pripomenutie termínu klientovi pred návštevou.' },
    { title: 'Jednoduchší predaj a platby', value: 'Online', desc: 'Okamžité platby kartou, zálohy a darčekové poukazy.' },
  ]

  const segments = [
    { name: 'Krása a Wellness', img: 'https://www.bookio.com/storage/files/8XqoSYfMc91yNV4hwL5C4kSfcFnsw69MmDGKNB9J.webp' },
    { name: 'Kaderníctva & Barbery', img: 'https://www.bookio.com/storage/files/oTP3ZMpFGNhELnPCFyDabHUrBpA9Rm8DQWEAL28V.png' },
    { name: 'Gastro & Reštaurácie', img: 'https://www.bookio.com/storage/files/w1dOOMSidGUU8NDbq8vanWhZIdledGnrVNWtnwTj.jpg' },
    { name: 'Zdravie & Masáže', img: 'https://www.bookio.com/storage/files/sTh7viCrM97Ve2aqOoSDm5JGI5qty0szXE15RBx8.webp' },
    { name: 'Kozmetické salóny', img: 'https://www.bookio.com/storage/files/UO37bgjRg5ZXHCvkP5vGAnquz3BoWVSfYi5XVmb5.webp' },
    { name: 'Šport & Fitness', img: 'https://www.bookio.com/storage/files/frESRVIGmup2p78kUrWfnDJc7qpJ4Ee2bgtAWtgf.webp' },
  ]

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans antialiased selection:bg-[#ffb719] selection:text-black">
      {/* ------------------------------------------------------------- */}
      {/* SECTION 01 - 13: NAVIGATION BAR & BRAND                      */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 bg-[#080032]/95 backdrop-blur-md border-b border-[#de9100]/25 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* sec-02: navbar-brand */}
            <div className="flex items-center gap-8">
              <a href="https://www.bookio.com/sk" className="flex items-center gap-2 group">
                <img
                  src="https://www.bookio.com/assets/img/logo-white.svg"
                  alt="Bookio"
                  className="h-8 w-auto object-contain"
                />
              </a>

              {/* sec-06, sec-07, sec-08, sec-09, sec-10: Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-200">
                <a href="#funkcie" className="hover:text-[#ffb719] transition-colors py-2">
                  Funkcie
                </a>
                <a href="#segmenty" className="hover:text-[#ffb719] transition-colors py-2">
                  Segmenty
                </a>
                <a href="#cennik" className="hover:text-[#ffb719] transition-colors py-2">
                  Cenník
                </a>
                <a href="#kontakt" className="hover:text-[#ffb719] transition-colors py-2">
                  Kontakt
                </a>
              </nav>
            </div>

            {/* sec-11, sec-12, sec-13: Action CTAs & Language Switcher */}
            <div className="hidden sm:flex items-center gap-3">
              {/* sec-13: Language Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#de9100] text-xs font-semibold uppercase tracking-wider text-slate-200 transition"
                  aria-expanded={langMenuOpen}
                >
                  <img
                    src={languages.find((l) => l.code === currentLang)?.flag}
                    alt={currentLang}
                    className="w-4 h-3 object-cover rounded-xs"
                  />
                  <span>{currentLang}</span>
                  <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {langMenuOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-[#080032] border border-[#de9100]/40 rounded-xl shadow-2xl py-1 z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setCurrentLang(lang.code)
                          setLangMenuOpen(false)
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left hover:bg-white/10 transition text-slate-200"
                      >
                        <img src={lang.flag} alt={lang.name} className="w-4 h-3 object-cover rounded-xs" />
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* comp-cta-link: Prihlásiť sa */}
              <a
                href="https://services.bookio.com/auth/login?targetUri=%2Fclient-admin&lang=sk"
                className="px-4 py-2 text-xs md:text-sm font-semibold text-white/90 hover:text-white border border-white/20 hover:border-[#de9100] rounded-full transition"
              >
                Prihlásiť sa
              </a>

              {/* nav.link.01: Vyskúšať zdarma */}
              <a
                href="#konzultacia"
                className="px-5 py-2 text-xs md:text-sm font-bold text-black bg-[#ffb719] hover:bg-[#de9100] rounded-full shadow-lg shadow-[#ffb719]/20 transition transform active:scale-95"
              >
                Vyskúšať zdarma
              </a>
            </div>

            {/* sec-03, sec-04: Mobile Menu Toggler */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:text-[#ffb719]"
                aria-label="Toggle navigation"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* sec-05: Mobile Menu Collapse */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-[#080032] border-b border-[#de9100]/30 px-4 pt-2 pb-6 space-y-3">
            <a
              href="#funkcie"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-200 hover:text-[#ffb719]"
            >
              Funkcie
            </a>
            <a
              href="#segmenty"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-200 hover:text-[#ffb719]"
            >
              Segmenty
            </a>
            <a
              href="#cennik"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-200 hover:text-[#ffb719]"
            >
              Cenník
            </a>
            <a
              href="#kontakt"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-200 hover:text-[#ffb719]"
            >
              Kontakt
            </a>
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
              <a
                href="https://services.bookio.com/auth/login?targetUri=%2Fclient-admin&lang=sk"
                className="w-full text-center py-2.5 rounded-full border border-white/20 text-sm font-semibold"
              >
                Prihlásiť sa
              </a>
              <a
                href="#konzultacia"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full bg-[#ffb719] text-black font-bold text-sm shadow-md"
              >
                Vyskúšať zdarma
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 14: HERO / BK-MAIN                                    */}
      {/* ------------------------------------------------------------- */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-linear-to-b from-[#080032] via-[#080032]/80 to-[#000000]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(255,183,25,0.15),transparent)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ffb719]/10 border border-[#de9100]/40 text-[#ffb719] text-xs font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-[#3fca90] animate-pulse" />
              14 dní zadarmo bez zadania platobnej karty
            </div>

            {/* heading.h1.01 */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Moderný rezervačný systém pre salóny, gastro a služby
            </h1>

            {/* heading.h2.02 */}
            <p className="text-xl sm:text-2xl font-medium text-[#3fca90]">
              Menej chaosu. Viac klientov. Vyššie tržby.
            </p>

            {/* meta.description summary */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Online rezervačný systém pre salóny, reštaurácie a služby. Rezervácie 24/7, platby, SMS pripomienky.
              Používa ho viac ako 2 500+ prevádzok na Slovensku a v Česku.
            </p>

            {/* Action buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#konzultacia"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#ffb719] hover:bg-[#de9100] text-black font-extrabold text-base shadow-xl shadow-[#ffb719]/25 transition transform active:scale-95"
              >
                Vyskúšať zdarma na 14 dní
              </a>
              <a
                href="#funkcie"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-base transition"
              >
                Preskúmať funkcie
              </a>
            </div>
          </div>

          {/* Hero Visual Mockup: bento-main / scheduler */}
          <div className="mt-14 relative max-w-5xl mx-auto rounded-3xl border border-[#de9100]/30 shadow-2xl overflow-hidden bg-slate-900/60 p-3 sm:p-5 backdrop-blur-xl">
            <img
              src="https://www.bookio.com/assets/img/bento/main.png?v=1"
              alt="Bookio Rezervačný systém rozhranie"
              className="w-full h-auto rounded-2xl object-cover shadow-inner"
              onError={(e) => {
                // fallback to scheduler image if bento has version param issues
                ;(e.currentTarget as HTMLImageElement).src = 'https://www.bookio.com/assets/img/features/scheduler.jpg'
              }}
            />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 15: MAIN CONTENT / PX-2 (BENTO GRID, STATS, FEATURES) */}
      {/* ------------------------------------------------------------- */}
      <main className="px-2 sm:px-4 py-16 space-y-28 max-w-7xl mx-auto">
        {/* heading.h2.04: Bookio vám pomáha v biznise vyhrať */}
        <section id="preco-bookio" className="text-center space-y-4">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Bookio vám pomáha v biznise vyhrať. Každý deň.
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Už žiadne zmeškané hovory, neprehľadné papierové diáre a prázdne miesta v rozvrhu kvôli zabudnutým termínom.
          </p>

          {/* heading.h2.07: Čísla hovoria jasne (Bento Stats Grid) */}
          <div className="pt-10">
            <h3 className="text-lg font-semibold text-[#ffb719] uppercase tracking-wider mb-8">
              Čísla hovoria jasne
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-[#080032] border border-[#de9100]/25 hover:border-[#ffb719] transition-all space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#3fca90] px-2 py-0.5 rounded-full bg-[#3fca90]/10">
                      Výhoda
                    </span>
                    <span className="text-2xl font-black text-[#ffb719] group-hover:scale-105 transition-transform">
                      {stat.value}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white group-hover:text-[#ffb719] transition-colors">
                    {stat.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {stat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* heading.h2.05: 10+ rokov vývoja. 100+ dostupných segmentov. */}
        <section id="segmenty" className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-bold text-white">
              10+ rokov vývoja. 100+ dostupných segmentov.
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Riešenie prispôsobené pre kaderníctva, barberov, kozmetiky, masáže, reštaurácie aj zdravotnícke centrá.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {segments.map((seg, i) => (
              <div
                key={i}
                className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-[#ffb719] transition bg-[#080032] flex flex-col"
              >
                <div className="aspect-4/3 w-full overflow-hidden bg-slate-800">
                  <img
                    src={seg.img}
                    alt={seg.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                </div>
                <div className="p-3 text-center">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-[#ffb719] transition">
                    {seg.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* heading.h3.16 - heading.h3.20: Funkcie / Rezervácie / Marketing / Predaj / Manažment */}
        <section id="funkcie" className="space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-block text-xs font-bold uppercase tracking-wider text-[#3fca90] px-3 py-1 bg-[#3fca90]/10 rounded-full">
              Prehľad možností
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white">
              Všetky funkcie pod jednou strechou
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#ffb719]/15 text-[#ffb719] border border-[#ffb719]/30">
                Rezervácie
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-slate-300 border border-white/10">
                Marketing
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-slate-300 border border-white/10">
                Predaj a platby
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-slate-300 border border-white/10">
                Manažment
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureLinks.map((item, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-[#080032] border border-[#de9100]/20 hover:border-[#ffb719] transition space-y-2.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#ffb719]/20 flex items-center justify-center text-[#ffb719]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-base font-bold text-white">{item.title}</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-11">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* comp-form-other: FORMULÁR PRE ONLINE KONZULTÁCIU & TESTOVANIE */}
        <section
          id="konzultacia"
          className="relative rounded-3xl bg-[#080032] border border-[#de9100]/40 p-6 sm:p-12 overflow-hidden shadow-2xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              {/* heading.h2.03 & heading.h2.06 */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#ffb719] uppercase tracking-wider">
                  Nezáväzná ponuka
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                  Dohodnite si online konzultáciu
                </h2>
                <h3 className="text-lg sm:text-xl font-medium text-[#3fca90]">
                  Vyskúšajte si Bookio nezáväzne
                </h3>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                Náš špecialista vám ukáže systém v reálnom čase na mieru vášho salónu, gastra alebo prevádzky.
                Odpovieme na všetky vaše otázky a nastavíme všetko potrebné.
              </p>

              <div className="flex items-center gap-4 pt-2">
                <img
                  src="https://www.bookio.com/assets/img/bento/consultation.png?v=1"
                  alt="Online konzultácia"
                  className="w-16 h-16 rounded-xl object-cover border border-[#de9100]/30"
                  onError={(e) => {
                    ;(e.currentTarget as HTMLImageElement).src = 'https://www.bookio.com/assets/img/bento/handshake.png?v=1'
                  }}
                />
                <div className="text-xs text-slate-300">
                  <div className="font-bold text-white text-sm">Priateľský tím ľudí</div>
                  <div>Bezplatné predvedenie a poradenstvo do 15 minút</div>
                </div>
              </div>
            </div>

            {/* comp-form-other Form Implementation */}
            <div className="bg-black/60 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
              <form
                action="https://www.bookio.com/sendForm"
                method="POST"
                className="space-y-4"
              >
                {/* Form CSRF _token placeholder as specified in comp-form-other */}
                <input type="hidden" name="_token" value="static_csrf_token_slot" />
                <input type="hidden" name="category" value="other" />

                <div>
                  <label htmlFor="form-email" className="block text-xs font-medium text-slate-300 mb-1">
                    Váš e-mail <span className="text-[#ffb719]">*</span>
                  </label>
                  <input
                    type="email"
                    id="form-email"
                    name="email"
                    required
                    placeholder="vas@email.sk"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-[#ffb719] transition"
                  />
                </div>

                <div>
                  <label htmlFor="form-phone" className="block text-xs font-medium text-slate-300 mb-1">
                    Telefónne číslo <span className="text-[#ffb719]">*</span>
                  </label>
                  <input
                    type="tel"
                    id="form-phone"
                    name="phone"
                    required
                    placeholder="+421 900 000 000"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-[#ffb719] transition"
                  />
                </div>

                <div>
                  <label htmlFor="form-message" className="block text-xs font-medium text-slate-300 mb-1">
                    Správa alebo názov prevádzky
                  </label>
                  <textarea
                    id="form-message"
                    name="message"
                    rows={3}
                    placeholder="Napíšte nám, aké služby ponúkate a koľko máte pracovníkov..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-[#ffb719] transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#ffb719] hover:bg-[#de9100] text-black font-extrabold text-sm shadow-lg shadow-[#ffb719]/25 transition active:scale-98"
                >
                  Odoslať nezáväznú žiadosť
                </button>

                <p className="text-[11px] text-center text-slate-400">
                  Odoslaním súhlasíte so spracovaním osobných údajov pre účely kontaktovania.
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 16: FOOTER (CONTAINER ROLE: FOOTER)                   */}
      {/* ------------------------------------------------------------- */}
      <footer id="kontakt" className="bg-[#080032] border-t border-[#de9100]/25 pt-14 pb-12 mt-20 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Brand & Bio */}
            <div className="space-y-4 md:col-span-1">
              <img
                src="https://www.bookio.com/assets/img/logo-white.svg"
                alt="Bookio"
                className="h-7 w-auto object-contain"
              />
              <p className="text-slate-300 leading-relaxed text-xs">
                Online rezervačný systém pre salóny, reštaurácie a služby. Rezervácie 24/7, platby, SMS pripomienky.
              </p>
              <div className="pt-2">
                <img
                  src="https://www.bookio.com/assets/img/credit-cards.png"
                  alt="Platobné karty"
                  className="h-6 w-auto opacity-80"
                />
              </div>
            </div>

            {/* Col 2: Funkcie */}
            <div className="space-y-2">
              <div className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Funkcie</div>
              <ul className="space-y-1.5">
                <li><a href="#funkcie" className="hover:text-[#ffb719] transition">Rezervačná kniha</a></li>
                <li><a href="#funkcie" className="hover:text-[#ffb719] transition">Kalendár</a></li>
                <li><a href="#funkcie" className="hover:text-[#ffb719] transition">Rezervácie 24/7</a></li>
                <li><a href="#funkcie" className="hover:text-[#ffb719] transition">Pripomienky a SMS</a></li>
                <li><a href="#funkcie" className="hover:text-[#ffb719] transition">Platené rezervácie</a></li>
              </ul>
            </div>

            {/* Col 3: Segmenty */}
            <div className="space-y-2">
              <div className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Segmenty</div>
              <ul className="space-y-1.5">
                <li><a href="#segmenty" className="hover:text-[#ffb719] transition">Krása a Wellness</a></li>
                <li><a href="#segmenty" className="hover:text-[#ffb719] transition">Kaderníctva a Barbery</a></li>
                <li><a href="#segmenty" className="hover:text-[#ffb719] transition">Gastro a Reštaurácie</a></li>
                <li><a href="#segmenty" className="hover:text-[#ffb719] transition">Kozmetické salóny</a></li>
                <li><a href="#segmenty" className="hover:text-[#ffb719] transition">Masáže a Fyzioterapia</a></li>
              </ul>
            </div>

            {/* Col 4: Prístup a kontakt */}
            <div className="space-y-3">
              <div className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Klientska zóna</div>
              <p className="text-slate-300">
                Už máte svoj účet v Bookio? Prihláste sa do svojej administrácie:
              </p>
              <a
                href="https://services.bookio.com/auth/login?targetUri=%2Fclient-admin&lang=sk"
                className="inline-block px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition"
              >
                Prihlásiť sa do Bookio
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              © {new Date().getFullYear()} Bookio. Všetky práva vyhradené. Rezervačný systém pre salóny, gastro a služby.
            </div>
            <div className="flex items-center gap-4">
              <a href="https://www.bookio.com/sk" className="hover:text-slate-400">Podmienky používania</a>
              <span>•</span>
              <a href="https://www.bookio.com/sk" className="hover:text-slate-400">Ochrana osobných údajov</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
