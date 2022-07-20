require('dotenv').config()
const token = process.env.TOKEN
const TelegramBot = require('node-telegram-bot-api');
const { reset,
    getScene,
    wins, 
    checkIfWin,
    getFreeRandomCoords, 
    getPoints } = require('./lib/ttt');
const { sendTurn, setBot } = require('./lib/tttTg');
const { random } = require('./lib/utils');

const bot = new TelegramBot(token, { polling: true });
setBot(bot)

let player1
let player2

bot.onText(/\/play/, (msg, match) => {
    try {
        reset()
        const scene = getScene()
        if (msg.chat.id === +process.env.ID_VLADIMIR) {
            player1 = +process.env.ID_VLADIMIR
            player2 = +process.env.ID_VASILIY
        }
        else {
            player2 = +process.env.ID_VLADIMIR
            player1 = +process.env.ID_VASILIY
        }
        sendTurn(player1, 'Ваш ход', scene, 1, 'p')

        bot.sendMessage(player2, 'Ваш соперник совершает ход')
    } catch (error) {
        console.log(error)
    }
})


bot.onText(/\/start/, (msg, match) => {
    bot.sendMessage(msg.chat.id, 'Чем будете ходить?',
        {
            "reply_markup": {
                "inline_keyboard": [[
                    {
                        text: '❌',
                        callback_data: 'c,1',
                    },
                    {
                        text: '⚪',
                        callback_data: 'c,2',
                    },
                ]],

            },
        })
})

bot.onText(/\/ttt/, (msg, match) => {
    try {
        reset()
        const scene = getScene()
        const chatId = msg.chat.id;
        if (Math.random() < 0.5) {
            //ход пользователя
            sendTurn(chatId, 'Выполните ход!', scene, 1)
        } else {
            const [botX, botY] = getFreeRandomCoords(scene)
            scene[botX][botY] = 1
            sendTurn(chatId, 'Выполните ход!', scene, 2)
        }
    } catch (error) {
        console.log(error)
    }
});

bot.on('callback_query', (query) => {
    console.log(query.from.id, query.data)
    try {
        const scene = getScene()
        const chatId = query.from.id
        const [prefix] = query.data.split(',')

        if (prefix === 'p') {
            const [, x, y, strsign] = query.data.split(',')
            const sign = +strsign
            if (scene[x][y] !== 0) {
                bot.sendMessage(chatId, 'Так ходить нельзя, выберите другую клетку')
                return false
            }
            scene[x][y] = sign
            // const currentPlayer = chatId
            const anotherPlayer = (chatId === player1) ? player2 : player1
            const anotherSign = (currentPlayer === player1) ? 2 : 1
            if (checkIfWin(scene, wins, sign)) { //Проверяем не победил ли пользователь
                sendTurn(chatId, 'Вы победили, поздравляю!', scene)
                sendTurn(anotherPlayer, 'Вы проиграли, повезет в следующий раз', scene)
                reset()
                return false
            }
            const [freeX, freeY] = getFreeRandomCoords(scene)
            if (freeX === -1 && freeY === -1) {
                sendTurn(chatId, 'Ничья!', scene)
                sendTurn(anotherPlayer, 'Ничья!', scene)
                reset()
                return false
            }
            sendTurn(chatId, 'Ожидаем ход противника', scene)
            sendTurn(anotherPlayer, 'Ваш ход', scene, anotherSign, 'p')
        }

        if (prefix === 'c') {

        }
        else if (prefix === 't') {

            // Получаем ход пользователя
            const [, x, y, strsign] = query.data.split(',')
            const sign = +strsign
            const botsign = sign === 1 ? 2 : 1
            if (scene[x][y] !== 0) {
                bot.sendMessage(chatId, 'Так ходить нельзя, выберите другую клетку')
                return false
            }
            scene[x][y] = sign //Ставим значок пользователя
            if (checkIfWin(scene, wins, sign)) { //Проверяем не победил ли пользователь
                sendTurn(chatId, 'Вы победили, поздравляю!', scene)
                reset()
                return false
            }
            // Получаем ход бота абсциссу ординату
            const [botX, botY] = getFreeRandomCoords(scene)
            if (botX === -1 && botY === -1) {
                sendTurn(chatId, 'Ничья!', scene)
                reset()
                return false
            }
            scene[botX][botY] = botsign //Ставим нолик
            if (checkIfWin(scene, wins, botsign)) {  //Проверяем не победил ли бот
                sendTurn(chatId, 'Вы проиграли, повезёт в следующий раз', scene)
                reset()
                return false
            }
            const [botX2, botY2] = getFreeRandomCoords(scene)
            if (botX2 === -1 && botY2 === -1) {
                sendTurn(chatId, 'Ничья!', scene)
                reset()
                return false
            }
            //Предлагаем пользователю сделать ход
            sendTurn(chatId, 'Выполните ход!', scene, sign)
        }
    } catch (error) {
        console.log(error)
    }
})
bot.on('message', (msg) => {
    console.log(msg)
})

module.exports = bot