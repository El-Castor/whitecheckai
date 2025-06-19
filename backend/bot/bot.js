// backend/bot/bot.js
const { Telegraf } = require('telegraf');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// ✅ On utilise bien `frontendUrl` partout
const frontendUrl = process.env.MINIAPP_URL || 'https://whitecheck.ai/miniapp';

bot.start((ctx) => {
  const firstName = ctx.from.first_name || 'utilisateur';

  ctx.reply(`Salut ${firstName} 👋\nBienvenue sur WhiteCheckAI.\nClique ci-dessous pour ouvrir la Mini App :`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🚀 Ouvrir WhiteCheckAI', web_app: { url: frontendUrl } }]
      ]
    }
  });
});

// ✅ On affiche correctement l’URL utilisée
bot.launch();
console.log('🤖 Bot Telegram lancé avec Mini App URL :', frontendUrl);
