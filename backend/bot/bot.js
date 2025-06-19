const { Telegraf } = require('telegraf');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });


const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Commande /start
bot.start((ctx) => {
  const firstName = ctx.from.first_name || 'utilisateur';
  const url = 'https://whitecheck.ai/miniapp'; // ➜ À remplacer par ton URL réelle plus tard

  ctx.reply(`Salut ${firstName} 👋\nBienvenue sur WhiteCheckAI.\nClique ci-dessous pour ouvrir la Mini App :`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🚀 Ouvrir WhiteCheckAI', web_app: { url } }]
      ]
    }
  });
});

// Lancer le bot
bot.launch();
console.log('🤖 Bot Telegram lancé...');
