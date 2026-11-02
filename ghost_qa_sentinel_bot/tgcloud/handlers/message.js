// tgcloud/handlers/message.js
// Serverless handler for Ghost-QA Sentinel Telegram Bot

import { api } from 'sdk';

export default async function (message, ctx) {
  const chatId = message.chat.id;
  const text = (message.text || '').trim();
  const userName = message.from?.first_name || 'Engineer';

  if (text.startsWith('/start') || text.startsWith('/help')) {
    const welcomeText = 
      `🛡️ <b>Ghost-QA & Self-Healing Sentinel Bot</b>\n\n` +
      `Salom, <b>${userName}</b>! Ghost-QA Sentinel avtonom sifat nazorati va o'zini-o'zi tuzatuvchi botiga xush kelibsiz.\n\n` +
      `<b>⚡ Asosiy Imkoniyatlar:</b>\n` +
      `• 🕷️ <b>Playwright Chaos Crawler:</b> Sahifalarni headless brauzerda aylanib, console, network (500) va layout xatoliklarini avtomatik topadi.\n` +
      `• 🧠 <b>Google Gemini AI Diagnostic:</b> Xatolik sababini o'zbek va ingliz tillarida aniqlab, tuzatish uchun diff patch yaratadi.\n` +
      `• 🐙 <b>1-Click GitHub PR:</b> Xato aniqlanganda to'g'ridan-to'g'ri yangi branch ochib, Pull Request yaratadi.\n\n` +
      `<b>📌 Buyruqlar:</b>\n` +
      `/status — Tizim holatini ko'rish\n` +
      `/scan — Chaos testni ishga tushirish\n` +
      `/dashboard — Web boshqaruv panelini ochish`;

    await api.sendMessage({
      chat_id: chatId,
      text: welcomeText,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🔍 Sentinel Dashboard', url: 'http://localhost:3000' }
          ],
          [
            { text: '⚠️ Demo Sandbox Target', url: 'http://localhost:8000/sandbox' },
            { text: '🐙 GitHub Repo', url: 'https://github.com/f-1331/Ghost-QA-Sentinel' }
          ]
        ]
      }
    });
    return;
  }

  if (text.startsWith('/status')) {
    await api.sendMessage({
      chat_id: chatId,
      text: 
        `🛡️ <b>Ghost-QA Sentinel Holati:</b>\n\n` +
        `• <b>Engine:</b> Playwright Chromium (Active)\n` +
        `• <b>AI Core:</b> Google Gemini 3.8 Flash (Online)\n` +
        `• <b>GitHub Repo:</b> <code>f-1331/Ghost-QA-Sentinel</code>\n` +
        `• <b>Serverless Host:</b> Telegram Cloud (tgcloud)\n` +
        `• <b>Sentinel Guard:</b> ONLINE & PROTECTING`,
      parse_mode: 'HTML'
    });
    return;
  }

  if (text.startsWith('/scan')) {
    await api.sendMessage({
      chat_id: chatId,
      text: 
        `🕷️ <b>Chaos Scan Boshlandi!</b>\n\n` +
        `Target: <code>http://localhost:8000/sandbox</code>\n` +
        `Rejim: <code>CHAOS_MONKEY</code>\n\n` +
        `<i>Playwright brauzer tugmalarni bosib, konsol va tarmoq xatolarini tekshirmoqda... Natijalarni Dashboard da kuzatishingiz mumkin.</i>`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '📊 Dashboard da Jonli Ko\'rish', url: 'http://localhost:3000' }]
        ]
      }
    });
    return;
  }

  // Default response
  await api.sendMessage({
    chat_id: chatId,
    text: `🛡️ <b>Ghost-QA Sentinel:</b> Buyruq qabul qilindi: <code>${text}</code>\n\nYordam uchun /help yoki /status yozing.`,
    parse_mode: 'HTML'
  });
}
