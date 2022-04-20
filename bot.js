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
const getFreeRandomCoords = (scene) => {
    for (let x=0; x<scene.length; x+=1){
        for(let y=0; y<scene[x].length; y+=1){
            if (scene[x][y]===0){
                return [x,y]
            }
        }
    }
}
const checkIfWin = (scene, wins, sign) => {
    for (let win of wins) {
        let points = 0
        for (let coords of win){
            const [x,y] = coords
            if(scene[x][y]===sign){
                points+=1
            }
        }
        if(points===3){
            return true
        }
    }
    return false
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
    try {
        
        const chatId = query.from.id
        const [x, y] = query.data.split(',')
        console.log(x, y)
        scene[x][y] = 1
        if (checkIfWin(scene, wins, 1)){
            bot.sendMessage(chatId, 'Вы победили, поздравляю!', {
                "reply_markup": {
                    "inline_keyboard": renderButtons(scene)  
                },
            })
            return false
        }
        const [botX,botY] = getFreeRandomCoords(scene)
        scene[botX][botY] = 2
        if (checkIfWin(scene, wins, 2)){
            bot.sendMessage(chatId, 'Вы проиграли, повезёт в следующий раз', {
                "reply_markup": {
                    "inline_keyboard": renderButtons(scene)
                },
            })
            return false
        }
        bot.sendMessage(chatId, 'Выполните ход!', {
            "reply_markup": {
                "inline_keyboard": renderButtons(scene)
                
            },

        });
    } catch (error) {
        console.log(error)    
    }
s
        // bot.sendMessage(chatId, str)
})


module.exports = bot