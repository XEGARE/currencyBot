process.env.NTBA_FIX_319 = 1;
process.env["NTBA_FIX_350"] = 1;
const TelegramBot = require('node-telegram-bot-api'); // npm install --save node-telegram-bot-api
const request = require('request'); // npm install request

const URL = ''; // URL с SSL сертификатом
const TOKEN = ''; // Токен бота от @BotFather
const URL_PARSE = 'https://www.cbr-xml-daily.ru/daily_json.js'; // URL с которого парсятся данные

const currencyBot = new TelegramBot(TOKEN, {
	webHook: {
		port: 80,
		autoOpen: false
	}
});

currencyBot.openWebHook();
currencyBot.setWebHook(`${URL}/bot${TOKEN}`);

currencyBot.on('message', msg => {
	let chatID = msg.chat.id;
    let text = msg.text;
	switch(text) {
		case 'EUR':
		case 'USD': {
			request(URL_PARSE, function (error, response, body) {
				if(response.statusCode == 200) {
					let r = JSON.parse(body);
					if(text == 'USD') {
                        currencyBot.sendMessage(chatID, `Курс $ за сегодня: ${r.Valute.USD.Value}₽`);
					}
					if(text == 'EUR') {
                        currencyBot.sendMessage(chatID, `Курс € за сегодня: ${r.Valute.EUR.Value}₽`);
					}
				} else {
					console.log('error:', error);
					console.log('statusCode:', response && response.statusCode);
				}
			});
			break;
		}
		default: {
			if (text == '/start') {
				let opts = {
					reply_markup: JSON.stringify({
						keyboard: [
							['USD','EUR']
						],
						resize_keyboard: true
					})
				};
				currencyBot.sendMessage(chatID, 'Какую валюту выбираете?', opts);
            }
            else {
				currencyBot.sendMessage(chatID, msg.from.first_name + ', прошу Вас использовать кнопки!');
			}
		}
	}
});