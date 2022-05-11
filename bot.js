require('dotenv').config()
const token = process.env.TOKEN
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(token, { polling: true });


let scene = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
]
const wins = [
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]],
    [[2, 0], [1, 1], [0, 2]],
]
const signs = ['⬜', '❌', '⚪']
const reset = () => {
    scene = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ]
}
const renderButtons = (scene) => {
    return [[
        {
            text: signs[scene[0][0]],
            callback_data: "t,0,0",
        },
        {
            text: signs[scene[0][1]],
            callback_data: "t,0,1",
        },
        {
            text: signs[scene[0][2]],
            callback_data: "t,0,2",
        },
    ],
    [
        {
            text: signs[scene[1][0]],
            callback_data: "t,1,0",
        },
        {
            text: signs[scene[1][1]],
            callback_data: "t,1,1",
        },
        {
            text: signs[scene[1][2]],
            callback_data: "t,1,2",
        },
    ],
    [
        {
            text: signs[scene[2][0]],
            callback_data: "t,2,0",
        },
        {
            text: signs[scene[2][1]],
            callback_data: "t,2,1",
        },
        {
            text: signs[scene[2][2]],
            callback_data: "t,2,2",
        },
    ]]

}
const random = (num) => {
    const res = Math.floor(Math.random() * num)
    return res
}
const getFreeRandomCoords = (scene) => {
    let freePlaces = 0
    for (let x = 0; x < scene.length; x += 1) {
        for (let y = 0; y < scene[x].length; y += 1) {
            if (scene[x][y] === 0) {
                freePlaces += 1
            }
        }
    }
    if (freePlaces === 0) {
        return [-1, -1]
    }
    let freeIndex = random(freePlaces)
    for (let x = 0; x < scene.length; x += 1) {
        for (let y = 0; y < scene[x].length; y += 1) {
            if (scene[x][y] === 0) {
                if (freeIndex === 0) {
                    return [x, y]
                }
                freeIndex -= 1
            }
        }
    }
}
const checkIfWin = (scene, wins, sign) => {
    for (let win of wins) {
        let points = 0
        for (let coords of win) {
            const [x, y] = coords
            if (scene[x][y] === sign) {
                points += 1
            }
        }
        if (points === 3) {
            return true
        }
    }
    return false
}
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
    try {

        const chatId = query.from.id
        const [prefix] = query.data.split(',')
        if (prefix === 'c') {

        }
        else if (prefix === 't') {

            // Получаем ход пользователя
            const [prefix, x, y] = query.data.split(',')
            console.log(x, y)
            scene[x][y] = 1 //Ставим крестик
            if (checkIfWin(scene, wins, 1)) { //Проверяем не победил ли пользователь
                bot.sendMessage(chatId, 'Вы победили, поздравляю!', {
                    "reply_markup": {
                        "inline_keyboard": renderButtons(scene)
                    },
                })
                reset()
                return false
            }
            // Получаем ход бота абсциссу ординату
            const [botX, botY] = getFreeRandomCoords(scene)
            if (botX === -1 && botY === -1) {
                bot.sendMessage(chatId, 'Ничья!', {
                    "reply_markup": {
                        "inline_keyboard": renderButtons(scene)
                    },
                })
                reset()
                return false
            }
            scene[botX][botY] = 2 //Ставим нолик
            if (checkIfWin(scene, wins, 2)) {  //Проверяем не победил ли бот
                bot.sendMessage(chatId, 'Вы проиграли, повезёт в следующий раз', {
                    "reply_markup": {
                        "inline_keyboard": renderButtons(scene)
                    },
                })
                reset()
                return false
            }
            //Предлагаем пользователю сделать ход
            bot.sendMessage(chatId, 'Выполните ход!', {
                "reply_markup": {
                    "inline_keyboard": renderButtons(scene)

                },

            });
        }
    } catch (error) {
        console.log(error)
    }

    // bot.sendMessage(chatId, str)
})


module.exports = bot