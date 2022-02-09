const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options.js');

const token = '***';

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Я загадаю цифру от 0 до 9, а ты должен её отгадать.')
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Начальное приветствие' },
        { command: '/info', description: 'Получить информацию о пользователе' },
        { command: '/game', description: 'Угадай цифру' }
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/88e/586/88e586f0-4299-313f-bedb-ef45c7710422/192/1.webp')
            return bot.sendMessage(chatId, `Чат Georaz приветствует тебя.`)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Твой username - ${msg.from.username}`)
        }
        if (text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, 'Я не разобрал, что ты написал.')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId)
        }
        if (data === chats[chatId]) {
            return await bot.sendMessage(chatId, `Молодцом. ты отгадал цифру ${chats[chatId]}`, againOptions)
        } else {
            return await bot.sendMessage(chatId, `Ты не угадал, то была цифра ${chats[chatId]}`, againOptions)
        }
    })
}

start();

