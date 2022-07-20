const { random } = require("./utils")

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
const getScene = ()=>{
    return scene
}
module.exports = {
    reset,
    getScene,
    signs,
    wins, 
    checkIfWin,
    getFreeRandomCoords, 
    getPoints
}