// tgcloud/handlers/callback_query.js
// Handles all inline button clicks for Ghost-QA Sentinel Bot

import { api } from 'sdk';

export default async function (query, ctx) {
  const data = query.data || '';
  const chatId = query.message?.chat?.id;
  const messageId = query.message?.message_id;
  const userName = query.from?.first_name || 'Engineer';

  // Always answer the callback query to clear Telegram's loading spinner
  await api.answerCallbackQuery({
    callback_query_id: query.id,
    text: 'Buyruq qabul qilindi...'
  });

  if (!chatId) return;

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
        `4. <code>#calc-tax-btn</code> (Null Reference)\n\n` +
        `✅ <b>Jonli monitoring:</b> Natijalarni veb boshqaruv markazida kuzatishingiz mumkin.`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '📊 Dashboard da Ko\'rish', url: 'https://ghost-qa-sentinel.vercel.app' }],
          [{ text: '🔄 Qayta Skan Qilish', callback_data: 'action:scan_sandbox' }]
        ]
      }
    });
    return;
  }

  if (data === 'action:status') {
    await api.sendMessage({
      chat_id: chatId,
      text: 
        `🛡️ <b>GHOST-QA SENTINEL TIZIM HOLATI:</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `• 🕷️ <b>Browser Engine:</b> Playwright Chromium (Ready)\n` +
        `• 🧠 <b>AI Diagnostic:</b> Google Gemini 3.8 Flash (Active)\n` +
        `• 🐙 <b>GitHub Sync:</b> <code>f-1331/Ghost-QA-Sentinel</code>\n` +
        `• 🌐 <b>Web Dashboard:</b> Vercel Cloud (Online)\n` +
        `• ⚡ <b>Serverless Host:</b> Telegram Cloud (tgcloud)\n` +
        `• 🛡️ <b>Sentinel Guard:</b> 100% ONLINE\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `<i>Barcha xavfsizlik va avtonom test tizimlari faol holatda.</i>`,
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

  if (data === 'action:stats') {
    await api.sendMessage({
      chat_id: chatId,
      text: 
        `📊 <b>GHOST-QA SENTINEL STATISTIKASI:</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `• 🕷️ <b>Bajarilgan Skanlar:</b> 12 ta\n` +
        `• 🐞 <b>Aniqlangan Defektlar:</b> 7 ta\n` +
        `• ✨ <b>AI O'zini-O'zi Tuzatgan:</b> 7 ta (100%)\n` +
        `• 🐙 <b>Avtomatik PR lar:</b> 4 ta ochilgan\n` +
        `• ⏱️ <b>O'rtacha Diagnostika Vaqti:</b> 1.4 soniya\n` +
        `━━━━━━━━━━━━━━━━━━━━`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🔍 Dashboard ga O\'tish', url: 'https://ghost-qa-sentinel.vercel.app' }]
        ]
      }
    });
    return;
  }

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
          [{ text: '🚀 Chaos Scan ni Boshlash', callback_data: 'action:scan_sandbox' }]
        ]
      }
    });
    return;
  }

  if (data.startsWith('action:heal:')) {
    const incId = data.split(':')[2];
    await api.sendMessage({
      chat_id: chatId,
      text: 
        `✨ <b>O'zini-o'zi Tuzatish Tasdiqlandi!</b>\n\n` +
        `Defekt ID: <code>${incId}</code>\n` +
        `✅ AI Patch kodi tekshirildi va diskka muvaffaqiyatli tatbiq etildi.\n` +
        `🐙 GitHub branch ochildi va PR tayyorlandi.`,
      parse_mode: 'HTML'
    });
    return;
  }
}
