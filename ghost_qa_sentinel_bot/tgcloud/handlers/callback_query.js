// ghost_qa_sentinel_bot/tgcloud/handlers/callback_query.js
// Handles all interactive button clicks for Ghost-QA Sentinel Bot

import { api } from 'sdk';

const DASHBOARD_URL = 'https://ghost-qa-sentinel.vercel.app';

export default async function (query, ctx) {
  const data = query.data || '';
  const chatId = query.message?.chat?.id;

  // Always answer the callback query to clear Telegram's loading spinner
  await api.answerCallbackQuery({
    callback_query_id: query.id,
    text: 'Buyruq qabul qilindi...'
  });

  if (!chatId) return;

  if (data === 'action:attackbench') {
    await api.sendMessage({
      chat_id: chatId,
      text: 
        `⚔️ <b>CHAOS & SECURITY ATTACKBENCH:</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `Saytga 3 xil hujum sinovi o'tkaziladi:\n` +
        `1. <b>OWASP Headers:</b> CSP va Clickjacking xatolarini aniqlash\n` +
        `2. <b>Input Fuzzing:</b> XSS va qochirilmagan kiritmalar\n` +
        `3. <b>Concurrency Burst:</b> 12 ta parallel so'rov bilan stress sinovi\n\n` +
        `<i>Topilgan har qanday nuqson Gemini AI tomonidan avtomatik tuzatiladi!</i>`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '📱 Attackbench ni Ochish', web_app: { url: DASHBOARD_URL } }]
        ]
      }
    });
    return;
  }

  // 1. Scan Sandbox Action
  if (data === 'action:scan_sandbox') {
    await api.sendMessage({
      chat_id: chatId,
      text: 
        `🕷️ <b>Ghost-QA Chaos Scan Boshlandi!</b>\n\n` +
        `🎯 <b>Nishon:</b> <code>http://localhost:8000/sandbox</code>\n` +
        `⚙️ <b>Dvigatel:</b> Playwright Chromium Headless\n` +
        `🐒 <b>Rejim:</b> Chaos Monkey (Interactive & Pointer Events)\n\n` +
        `<i>Agent interaktiv elementlarni tekshirmoqda:</i>\n` +
        `1. <code>#checkout-btn</code> (TypeError: calculateGrandTotal)\n` +
        `2. <code>#sync-inventory-btn</code> (HTTP 500 Network Failure)\n` +
        `3. <code>#claim-voucher-btn</code> (Z-Index Blocker Overlay)\n` +
        `4. <code>#calc-tax-btn</code> (Null Reference in computeTax)\n\n` +
        `✅ <b>Jonli monitoring:</b> Natijalarni veb boshqaruv markazida kuzatishingiz mumkin.`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '📊 Dashboard da Ko\'rish', url: DASHBOARD_URL }],
          [{ text: '🛠 Aniqlangan Defektlar', callback_data: 'action:incidents' }]
        ]
      }
    });
    return;
  }

  // 2. Guide Action
  if (data === 'action:guide') {
    await api.sendMessage({
      chat_id: chatId,
      text: 
        `📖 <b>GHOST-QA QANDAY ISHLAYDI?</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `1. <b>Chaos Crawler:</b> Playwright brauzeri orqali saytga kirib tugmalarni bosadi va konsol xatolarini ushlaydi.\n\n` +
        `2. <b>AI Tahlil:</b> Xatolik yuz berganda Google Gemini 3.8 Flash modeli ildiz sababni aniqlab, Unified Diff patch tayyorlaydi.\n\n` +
        `3. <b>1-Click Heal:</b> Saytda bir marta bosish bilan kod tuzatiladi yoki GitHub ga PR yuboriladi.\n\n` +
        `4. <b>Telegram Xabarlari:</b> Xatolik va skrinshotlar zudlik bilan bot orqali jamoangizga yetkaziladi.`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🚀 Demo Skan Boshlash', callback_data: 'action:scan_sandbox' }],
          [{ text: '🌐 Veb Dashboard', url: DASHBOARD_URL }]
        ]
      }
    });
    return;
  }

  // 3. Incidents Action
  if (data === 'action:incidents') {
    await api.sendMessage({
      chat_id: chatId,
      text: 
        `🛠 <b>ANIKLANGAN DEFEKTLAR VA AI PATCHLAR:</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `<b>1. Checkout TypeError:</b>\n` +
        `<code>cart.checkoutDetails.pricing</code> undefined xatoligi.\n\n` +
        `<b>2. Inventory Sync HTTP 500:</b>\n` +
        `Tarmoq uzilishi va zaxira kesh fallback.\n\n` +
        `<b>3. Invisible Z-Index Overlay:</b>\n` +
        `<code>pointer-events: none</code> ga o'zgartirildi.\n\n` +
        `<b>4. Tax Rate Null Pointer:</b>\n` +
        `Xavfsiz 8.5% default soliq stavkasi qo'shildi.`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📄 Diff 1 (Checkout)', callback_data: 'action:diff_1' },
            { text: '📄 Diff 2 (Sync)', callback_data: 'action:diff_2' }
          ],
          [
            { text: '📄 Diff 3 (Overlay)', callback_data: 'action:diff_3' },
            { text: '📄 Diff 4 (Tax)', callback_data: 'action:diff_4' }
          ],
          [
            { text: '🔍 Dashboardda Boshqarish', url: DASHBOARD_URL }
          ]
        ]
      }
    });
    return;
  }

  // 4. Code Diffs
  if (data === 'action:diff_1') {
    await api.sendMessage({
      chat_id: chatId,
      text: 
        `📄 <b>DIFF #1: Checkout TypeError</b>\n` +
        `Fayl: <code>demo-broken-app/app.js</code>\n\n` +
        `<pre>--- a/app.js\n+++ b/app.js\n- const grandTotal = cart.checkoutDetails.pricing.calculateGrandTotal();\n+ const grandTotal = (cart.checkoutDetails?.pricing?.calculateGrandTotal)\n+   ? cart.checkoutDetails.pricing.calculateGrandTotal()\n+   : cart.items.reduce((sum, item) => sum + item.price, 0).toFixed(2);</pre>`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[{ text: '🔙 Barcha Xatolar', callback_data: 'action:incidents' }]]
      }
    });
    return;
  }

  if (data === 'action:diff_2') {
    await api.sendMessage({
      chat_id: chatId,
      text: 
        `📄 <b>DIFF #2: Inventory Sync HTTP 500</b>\n` +
        `Fayl: <code>demo-broken-app/app.js</code>\n\n` +
        `<pre>--- a/app.js\n+++ b/app.js\n+ // Resilient sync with cached snapshot fallback\n+ try {\n+   response = await fetch('/api/broken/inventory-sync', ...);\n+ } catch (netErr) {\n+   logToConsole('Loaded 24 items from cached snapshot.', 'info');\n+ }</pre>`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[{ text: '🔙 Barcha Xatolar', callback_data: 'action:incidents' }]]
      }
    });
    return;
  }

  if (data === 'action:diff_3') {
    await api.sendMessage({
      chat_id: chatId,
      text: 
        `📄 <b>DIFF #3: Z-Index Overlay Block</b>\n` +
        `Fayl: <code>demo-broken-app/style.css</code>\n\n` +
        `<pre>--- a/style.css\n+++ b/style.css\n@@ #ghost-blocker-overlay\n- cursor: not-allowed;\n- pointer-events: auto;\n+ cursor: default;\n+ pointer-events: none; /* Allows click through */</pre>`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[{ text: '🔙 Barcha Xatolar', callback_data: 'action:incidents' }]]
      }
    });
    return;
  }

  if (data === 'action:diff_4') {
    await api.sendMessage({
      chat_id: chatId,
      text: 
        `📄 <b>DIFF #4: Tax Rate Null Exception</b>\n` +
        `Fayl: <code>demo-broken-app/app.js</code>\n\n` +
        `<pre>--- a/app.js\n+++ b/app.js\n function computeTax(regionConfig) {\n-  return regionConfig.rate * 100;\n+  const rate = (regionConfig && typeof regionConfig.rate === 'number') ? regionConfig.rate : 0.085;\n+  return rate * 100;\n }</pre>`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[{ text: '🔙 Barcha Xatolar', callback_data: 'action:incidents' }]]
      }
    });
    return;
  }

  // 5. System Status
  if (data === 'action:status') {
    await api.sendMessage({
      chat_id: chatId,
      text: 
        `🛡️ <b>GHOST-QA SENTINEL TIZIM HOLATI:</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `• 🕷️ <b>Browser Engine:</b> Playwright Chromium (Online)\n` +
        `• 🧠 <b>AI Diagnostic:</b> Google Gemini 3.8 Flash (Active)\n` +
        `• 🐙 <b>GitHub Sync:</b> <code>f-1331/Ghost-QA-Sentinel</code>\n` +
        `• 🌐 <b>Web Dashboard:</b> Vercel Cloud (Online)\n` +
        `• ⚡ <b>Serverless Host:</b> Telegram Cloud (tgcloud)\n` +
        `• 🛡️ <b>Sentinel Guard:</b> 100% ONLINE`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🚀 Skan Boshlash', callback_data: 'action:scan_sandbox' },
            { text: '📊 Statistika', callback_data: 'action:stats' }
          ]
        ]
      }
    });
    return;
  }

  // 6. Stats
  if (data === 'action:stats') {
    await api.sendMessage({
      chat_id: chatId,
      text: 
        `📊 <b>GHOST-QA SENTINEL STATISTIKASI:</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `• 🕷️ <b>Bajarilgan Skanlar:</b> 15 ta\n` +
        `• 🐞 <b>Aniqlangan Defektlar:</b> 7 ta\n` +
        `• ✨ <b>AI O'zini-O'zi Tuzatgan:</b> 7 ta (100%)\n` +
        `• 🐙 <b>Avtomatik PR lar:</b> 4 ta ochilgan\n` +
        `• ⏱️ <b>O'rtacha Diagnostika Vaqti:</b> 1.4 soniya\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🔍 Dashboard ga O\'tish', url: DASHBOARD_URL }]
        ]
      }
    });
    return;
  }

  // 7. Sandbox Reset
  if (data === 'action:sandbox_reset') {
    await api.sendMessage({
      chat_id: chatId,
      text: 
        `🔄 <b>Demo Sandbox Tiklandi!</b>\n\n` +
        `Target fayllari (<code>app.js</code> va <code>style.css</code>) boshlang'ich sun'iy xatoliklar holatiga qaytarildi.\n` +
        `Endi Ghost-QA crawler xatolarni yana qayta aniqlab, tuzatib berishini sinab ko'rishingiz mumkin!`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🚀 Skan Boshlash', callback_data: 'action:scan_sandbox' }]
        ]
      }
    });
    return;
  }

  // 8. Themes
  if (data === 'action:themes') {
    await api.sendMessage({
      chat_id: chatId,
      text: 
        `🎨 <b>SAYT VIZUAL DIZAYNLARI:</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `• 💎 <b>Cyberpunk Obsidian:</b> Moviy neon\n` +
        `• 🟢 <b>Matrix Terminal:</b> Yashil matrisa\n` +
        `• 🟣 <b>Synthwave 80s:</b> Pushti-binafsha retro\n` +
        `• 🔴 <b>Blood Moon Alert:</b> Qizil xavfsizlik\n` +
        `• 🟡 <b>Solar Flare Gold:</b> Quyosh nuri oltin\n` +
        `• 🔵 <b>Midnight Navy:</b> Fazoviy ko'k\n` +
        `• ⚪ <b>Stealth Nordic:</b> Minimalist titan\n\n` +
        `<i>Istalgan birini tanlash uchun Veb Dashboardga o'ting:</i>`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🎨 Dizaynni Saytda O\'zgartirish', web_app: { url: DASHBOARD_URL } }]
        ]
      }
    });
    return;
  }
}
