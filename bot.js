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
let userPoints = 0
let botPoints = 0
const getPoints = () => {
    return `общий счет игры  (пользователь:бот) ${userPoints}:${botPoints}`
}
const renderButtons = (scene, sign, prefix='t') => {
    return scene.map((row, indexX)=>{
        return scene[indexX].map((num, indexY) => {
            return {
                text: signs[scene[indexX][indexY]],
                callback_data: `${prefix},${indexX},${indexY},` + sign,
            }
        })
    })
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

let player1 
let player2 



bot.onText(/\/play/, (msg, match) => {
    reset()
    if (msg.chat.id === +process.env.ID_VLADIMIR){
        player1 = +process.env.ID_VLADIMIR
        player2 = +process.env.ID_VASILIY
    }
    else {
        player2 = +process.env.ID_VLADIMIR
        player1 = +process.env.ID_VASILIY
    }
    bot.sendMessage(player1, 'Ваш ход',
        {
            "reply_markup": {
                "inline_keyboard":renderButtons(scene, 1, 'p')
            },
        })
        bot.sendMessage(player2, 'Ваш соперник совершает ход')
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
        const chatId = msg.chat.id;
        if (Math.random() < 0.5) {
            //ход пользователя
            bot.sendMessage(chatId, 'Выполните ход!', {
                "reply_markup": {
                    "inline_keyboard": renderButtons(scene, 1)

                },

            });
        } else {
            const [botX, botY] = getFreeRandomCoords(scene)
            scene[botX][botY] = 1
            bot.sendMessage(chatId, 'Выполните ход!', {
                "reply_markup": {
                    "inline_keyboard": renderButtons(scene, 2)

                },

            });
        }
    } catch (error) {
        console.log(error)
    }
});

bot.on('callback_query', (query) => {
    console.log(query.from.id, query.data)
    try {

        const chatId = query.from.id
        const [prefix] = query.data.split(',')
        
        if (prefix === 'p') {
            const [, x, y, strsign] = query.data.split(',')
            if (scene[x][y] !== 0) {
                bot.sendMessage(chatId, 'Так ходить нельзя, выберите другую клетку')
                return false
            }
            const sign = +strsign
            scene[x][y] = sign
            const currentPlayer = chatId    
            const anotherPlayer = (currentPlayer === player1) ? player2 : player1
            bot.sendMessage(currentPlayer, 'Ожидаем ход противника', {
                "reply_markup": {
                    "inline_keyboard": renderButtons(scene, sign, 'd')
                },
            })
            console.log({anotherPlayer})
            bot.sendMessage(anotherPlayer, 'Ваш ход', {
                "reply_markup": {
                    "inline_keyboard": renderButtons(
                        scene,
                        (currentPlayer === player1) ? 2 : 1,
                        'p'
                    )
                },
            })

        }

        if (prefix === 'c') {

        }
        else if (prefix === 't') {

            // Получаем ход пользователя
            const [, x, y, strsign] = query.data.split(',')
            if (scene[x][y] !== 0) {
                bot.sendMessage(chatId, 'Так ходить нельзя, выберите другую клетку')
                return false
            }
            const sign = +strsign
            console.log(x, y)
            scene[x][y] = sign //Ставим значок пользователя
            if (checkIfWin(scene, wins, sign)) { //Проверяем не победил ли пользователь
                bot.sendMessage(chatId, 'Вы победили, поздравляю!', {
                    "reply_markup": {
                        "inline_keyboard": renderButtons(scene) //конец игры
                    },
                })
                userPoints += 1
                bot.sendMessage(chatId, getPoints())
                reset()
                return false
            }
            // Получаем ход бота абсциссу ординату
            const [botX, botY] = getFreeRandomCoords(scene)
            if (botX === -1 && botY === -1) {
                bot.sendMessage(chatId, 'Ничья!', {
                    "reply_markup": {
                        "inline_keyboard": renderButtons(scene) //конец игры
                    },
                })
                bot.sendMessage(chatId, getPoints())
                reset()
                return false
            }
            const botsign = sign === 1 ? 2 : 1
            scene[botX][botY] = botsign //Ставим нолик
            if (checkIfWin(scene, wins, botsign)) {  //Проверяем не победил ли бот
                bot.sendMessage(chatId, 'Вы проиграли, повезёт в следующий раз', {
                    "reply_markup": {
                        "inline_keyboard": renderButtons(scene) //конец игры
                    },
                })
                botPoints += 1
                bot.sendMessage(chatId, getPoints())
                reset()
                return false
            }
            //Предлагаем пользователю сделать ход
            bot.sendMessage(chatId, 'Выполните ход!', {
                "reply_markup": {
                    "inline_keyboard": renderButtons(scene, sign)

                },

            });
        }
    } catch (error) {
        console.log(error)
    }

    // bot.sendMessage(chatId, str)
})
bot.on('message',(msg)=>{
    console.log(msg)
})

module.exports = bot