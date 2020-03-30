// 1 - Canvas
// 2 - Draw
// 3 - Gameloop
// 4 - Input
// 5 - Object Player
// 6 - Clear Rect
// 7 - Foods
// 8 - BlockSize
// 9 - BackGround
// 10 - Collisions
// 11 - Food Constructor (createFood)
// 12 - Random
// 13 - Start
// 14 - GameOver
// 15 - Text

// variables

// render
var canvas = document.querySelector('canvas')
var context = canvas.getContext('2d')

var columns = 16
var rows = 12
const blockSize = 16

canvas.width = columns * blockSize
canvas.height = rows * blockSize

// input
var currentKey

window.addEventListener('keydown', function (e) {
    currentKey = e.key
})

var interval

// game objects

var score = 0
var player
var food
var background

var textScore = {
    text: 'Score: 0',
    color: 'white',
    size: '12px',
    font: 'Arial',
    outline : 'black',
    x: 10,
    y: 20
}

// functions

function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function createBackground() {
    return {
        color: 'green',
        x: 0,
        y: 0,
        width: canvas.width,
        height: canvas.height
    }
}

function createFood() {
    return {
        color: 'yellow',
        x: random(0, columns) * blockSize,
        y: random(0, rows) * blockSize,
        width: blockSize, height: blockSize
    }
}

function createPlayer() {
    return {
        color: 'red',
        x: random(0, columns) * blockSize,
        y: random(0, rows) * blockSize,
        width: blockSize, height: blockSize
    }
}

function draw(object) {
    context.fillStyle = object.color
    context.fillRect(object.x, object.y, object.width, object.height)
}

function drawText(text){
    
    context.font = text.size + ' ' + text.font

    if(text.outline){
        context.strokeStyle = text.outline
        context.lineWidth = 4
        context.strokeText(text.text, text.x, text.y)
    }

    context.font = text.size + ' ' + text.font
    context.fillStyle = text.color
    context.fillText(text.text, text.x, text.y)
}

function start() {
    // init values
    score = 0
    player = createPlayer()
    food = createFood()
    background = createBackground()

    // start loop
    interval = setInterval(loop, 200)
}

function gameover(){
    clearInterval(interval)
}


function loop() {

    console.log('loop()')

    // process input

    if (currentKey == 'ArrowUp') {
        player.y -= blockSize
    }
    else if (currentKey == 'ArrowRight') {
        player.x += blockSize
    }
    else if (currentKey == 'ArrowDown') {
        player.y += blockSize
    }
    else if (currentKey == 'ArrowLeft') {
        player.x -= blockSize
    }

    // update objects (logic, collisions, etc)

    if (player.x == food.x && player.y == food.y) {
        score++
        food = createFood()
        textScore.text = 'Score: ' + score
    }

    if(player.x > canvas.width || player.x < 0 || player.y < 0 || player.y > canvas.height){
        gameover()
    }

    // render result

    context.clearRect(0, 0, canvas.width, canvas.height)

    draw(background)
    draw(player)
    draw(food)
    drawText(textScore)
}

start()





