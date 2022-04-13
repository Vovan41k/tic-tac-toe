require('dotenv').config()
const token = process.env.TOKEN
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(token, { polling: true });


const scene = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
]
const wins = [
    [[0,0],[0,1],[0,2]],
    [[1,0],[1,1],[1,2]],
    [[2,0],[2,1],[2,2]],
    [[0,0],[1,0],[2,0]],
    [[0,1],[1,1],[2,1]],
    [[0,2],[1,2],[2,2]],
    [[0,0],[1,1],[2,2]],
    [[2,0],[1,1],[0,2]],
]
const signs = ['⬜', '❌', '⚪']
const renderButtons = (scene) => {
    return [[
        {
            text: signs[scene[0][0]],
            callback_data: "0,0",
        },
        {
            text: signs[scene[0][1]],
            callback_data: "0,1",
        },
        {
            text: signs[scene[0][2]],
            callback_data: "0,2",
        },
    ],
    [
        {
            text: signs[scene[1][0]],
            callback_data: "1,0",
        },
        {
            text: signs[scene[1][1]],
            callback_data: "1,1",
        },
        {
            text: signs[scene[1][2]],
            callback_data: "1,2",
        },
    ],
    [
        {
            text: signs[scene[2][0]],
            callback_data: "2,0",
        },
        {
            text: signs[scene[2][1]],
            callback_data: "2,1",
        },
        {
            text: signs[scene[2][2]],
            callback_data: "2,2",
        },
    ]]

}

bot.onText(/\/ttt/, (msg, match) => {
    try {

        const chatId = msg.chat.id;
        bot.sendMessage(chatId, 'Выполните ход!', {
            "reply_markup": {
                "inline_keyboard": renderButtons(scene)

            },

        });
    } catch (error) {
        console.log(error)
    }
});

bot.on('callback_query', (query) => {
    console.log(query.from.id, query.data)
    const chatId = query.from.id
    const [x,y] = query.data.split(',')
    console.log(x,y)
    scene[x][y] = 1
    bot.sendMessage(chatId, 'Выполните ход!', {
        "reply_markup": {
            "inline_keyboard": renderButtons(scene)

        },

    });
    // bot.sendMessage(chatId, str)
})


module.exports = bot