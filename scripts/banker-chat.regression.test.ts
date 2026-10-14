import assert from 'assert'
import fs from 'fs'
import path from 'path'
import { POST } from '../app/api/chat/banker/route'

async function runBankerChatRegressionTest() {
  console.log('--- Testing Banker Chat API & UI Regression (Zdenko Biringer SLSP) ---')

  // 1. Test POST /api/chat/banker with empty body
  {
    const req = new Request('http://localhost:3000/api/chat/banker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [] }),
    })
    const res = await POST(req)
    assert.strictEqual(res.status, 200, 'POST /api/chat/banker should return 200')
    const json = (await res.json()) as { reply?: string; banker?: { name: string; phone: string; address: string } }
    assert.ok(json.reply, 'Should return reply')
    assert.ok(json.banker, 'Should return banker metadata')
    assert.strictEqual(json.banker.name, 'Ing. Zdenko Biringer')
    assert.strictEqual(json.banker.address, 'Tomášikova 48, 832 37 Bratislava')
    assert.strictEqual(json.banker.phone, '+421 2 4862 6600')
    assert.ok(json.reply.includes('Zdenko Biringer'), 'Greeting should contain Zdenko Biringer')
    console.log('  ✓ Initial greeting & metadata verified')
  }

  // 2. Test POST /api/chat/banker with banking question (Fallback / Mistral)
  {
    const req = new Request('http://localhost:3000/api/chat/banker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'Ako si môžem zmeniť denný limit na platby?' },
        ],
        clientName: 'Peter',
        spaceBalance: 4500.5,
      }),
    })
    const res = await POST(req)
    assert.strictEqual(res.status, 200)
    const json = (await res.json()) as { reply: string }
    assert.ok(json.reply.length > 20, 'Reply should be a full helpful answer')
    assert.ok(json.reply.toLowerCase().includes('limit') || json.reply.toLowerCase().includes('nastaven'), 'Answer should address daily limit')
    console.log('  ✓ Daily limit banking question answered appropriately')
  }

  // 3. Test UI file presence of required data-testids in george-dashboard-client.tsx
  {
    const clientPath = path.resolve(process.cwd(), 'components/george-dashboard/george-dashboard-client.tsx')
    const code = fs.readFileSync(clientPath, 'utf-8')

    const requiredTestIds = [
      'banker-chat-fab',
      'banker-chat-modal',
      'contact-send-message-btn',
      'banker-chat-input',
      'banker-chat-send-btn',
      'banker-chat-close-btn',
    ]

    for (const testId of requiredTestIds) {
      assert.ok(
        code.includes(`data-testid="${testId}"`),
        `george-dashboard-client.tsx must contain data-testid="${testId}"`
      )
    }

    assert.ok(code.includes('Zdenko Biringer'), 'george-dashboard-client.tsx must mention Zdenko Biringer')
    assert.ok(code.includes('Tomášikova 48'), 'george-dashboard-client.tsx must mention Tomášikova 48')
    assert.ok(code.includes('Pobočka otvorená do 16:00'), 'george-dashboard-client.tsx must display branch opening hours')
    assert.ok(code.includes('bg-[#151621]'), 'george-dashboard-client.tsx must use dark mode tokens')
    assert.ok(code.includes('Overenie platby v systéme SLSP'), 'george-dashboard-client.tsx must contain verification header')
    assert.ok(code.includes('Overiť v systéme'), 'george-dashboard-client.tsx must contain verify button')
    assert.ok(code.includes('SEPA Instant'), 'george-dashboard-client.tsx must support SEPA Instant verification')
    console.log('  ✓ UI contract, dark theme tokens and data-testids verified in george-dashboard-client.tsx')
  }

  // 4. Test POST /api/chat/banker with payment verification request
  {
    const req = new Request('http://localhost:3000/api/chat/banker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'poslem vam platbu viete mi ju overit v systeme ci odisla ?' },
        ],
        clientName: 'Peter',
        spaceBalance: 15190.46,
      }),
    })
    const res = await POST(req)
    assert.strictEqual(res.status, 200)
    const json = (await res.json()) as { reply: string; action?: string }
    assert.ok(json.reply.length > 20, 'Reply should be an empathetic helpful answer')
    assert.strictEqual(json.action, 'verify_payment_prompt', 'Action must trigger verify_payment_prompt')
    assert.ok(
      json.reply.toLowerCase().includes('overi') || json.reply.toLowerCase().includes('systém') || json.reply.toLowerCase().includes('doklad'),
      'Reply should mention verification or document'
    )
    console.log('  ✓ Payment verification trigger & action flag verified')
  }

  console.log('✅ Banker Chat Regression Test PASSED!')
}

void runBankerChatRegressionTest()
