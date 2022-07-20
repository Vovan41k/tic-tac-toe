const { signs } = require("./ttt")

let bot
const setBot = (tgbot)=>{
    bot = tgbot
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

/**
 * Отправляет сообщение о совершении хода
 * 
 * @param {int} player 
 * @param {string} text 
 * @param {array} scene 
 * @param {number} sign 
 * @param {string} prefix 
 */
const sendTurn = (player, text, scene, sign, prefix)=> {
    bot.sendMessage(player, text,
    {
        "reply_markup": {
            "inline_keyboard": renderButtons(scene, sign, prefix)
        },
    })
}


module.exports = {
    sendTurn,
    setBot,
}