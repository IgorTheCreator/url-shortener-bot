import fetch from 'node-fetch';
import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

async function shortingUrl(url) {
  const apiUrl = `https://api-ssl.bitly.com/v4/shorten`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ long_url: url }),
    });
    const data = await response.json();
    const shortUrl = data.id;
    return shortUrl;
  } catch (err) {
    console.log('Некая ошибка: ', err);
  }
}

bot.on('message', async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;
  try {
    const url = await shortingUrl(new URL(text));
    bot.sendMessage(chatId, url);
  } catch (err) {
    bot.sendMessage(chatId, 'Введите ссылку!');
  }
});
