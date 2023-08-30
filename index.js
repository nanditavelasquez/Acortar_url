const TelegramBot = require("node-telegram-bot-api");
const shortid = require("shortid");
const request = require("request");

// Reemplaza <TOKEN> con el token de tu bot de Telegram
const bot = new TelegramBot('6580643823:AAFDH-hBVbLZw_DLylCuD5eWYBQZTI7a2fw', { polling: true });

// Reemplaza <API_KEY> con la clave API de tu servicio de acortamiento de URLs
const apiUrl = 'https://api-ssl.bitly.com/v4/shorten';
const apiKey = '779bd26d62c87ab0c0166edd0944dd546cee1f19';

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '¡Hola! Envíame una URL para acortarla.');
});

bot.onText(/^(?!\/start)(.*)$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match[1];
  const id = shortid.generate();

  // Envía una solicitud HTTP POST al servicio de acortamiento de URLs
  request.post({
    url: apiUrl,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ long_url: url })
  }, (error, response, body) => {
    if (error) {
      console.error(error);
      bot.sendMessage(msg.chat.id, 'Ocurrió un error al acortar la URL');
    } else {
      const data = JSON.parse(body);
      const shortUrl = data.link;

      bot.sendMessage(msg.chat.id, `URL acortada: ${shortUrl}`);
    }
  });
});