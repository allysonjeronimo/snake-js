// 1 - Canvas
// 2 - Draw
// 3 - Gameloop
// 4 - Input
// 5 - Object snake
// 6 - Clear Rect
// 7 - Foods
// 8 - BlockSize
// 9 - BackGround
// 10 - Collisions
// 11 - Food Constructor (createFood)
// 12 - Random
// 13 - Start
// 14 - Draw on object
// 15 - Snake Body
// 15 - GameOver
// 16 - Text

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
var snake
var food
var background

// var textScore = {
//     text: 'Score: 0',
//     color: 'white',
//     size: '12px',
//     font: 'Arial',
//     outline : 'black',
//     x: 10,
//     y: 20
// }

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
        height: canvas.height,
        draw() {
            render(this.color, this.x, this.y, this.width, this.height)
        }
    }
}

function createFood() {
    return {
        color: 'yellow',
        x: random(0, columns) * blockSize,
        y: random(0, rows) * blockSize,
        width: blockSize, 
        height: blockSize,
        draw() {
            render(this.color, this.x, this.y, this.width, this.height)
        }
    }
}

function createSnake() {
    return {
        head: {
            color: 'red',
            x: random(0, columns) * blockSize,
            y: random(0, rows) * blockSize,
            width: blockSize, height: blockSize
        },
        body: [],
        draw() {

            render(
                this.head.color, 
                this.head.x, 
                this.head.y, 
                this.head.width, 
                this.head.height)

            this.body.forEach(b => {
                render(b.color, b.x, b.y, b.width, b.height)
            })
        }
    }
}

function render(color, x, y, width, height) {
    context.fillStyle = color
    context.fillRect(x, y, width, height)
}

// function drawText(text){

//     context.font = text.size + ' ' + text.font

//     if(text.outline){
//         context.strokeStyle = text.outline
//         context.lineWidth = 4
//         context.strokeText(text.text, text.x, text.y)
//     }

//     context.font = text.size + ' ' + text.font
//     context.fillStyle = text.color
//     context.fillText(text.text, text.x, text.y)
// }

function start() {
    // init values
    score = 0
    snake = createSnake()
    food = createFood()
    background = createBackground()

    // start loop
    interval = setInterval(loop, 200)
}

// function gameover(){
//     clearInterval(interval)
// }

function loop() {

    // process input

    if (currentKey == 'ArrowUp') {
        snake.head.y -= blockSize
    }
    else if (currentKey == 'ArrowRight') {
        snake.head.x += blockSize
    }
    else if (currentKey == 'ArrowDown') {
        snake.head.y += blockSize
    }
    else if (currentKey == 'ArrowLeft') {
        snake.head.x -= blockSize
    }

    // update objects (logic, collisions, etc)

    if (snake.head.x == food.x && snake.head.y == food.y) {
        score++
        food = createFood()
        // textScore.text = 'Score: ' + score
    }

    // if(snake.x > canvas.width || snake.x < 0 || snake.y < 0 || snake.y > canvas.height){
    //     gameover()
    // }

    // render result

    context.clearRect(0, 0, canvas.width, canvas.height)

    background.draw()
    snake.draw()
    food.draw()

    // drawText(textScore)
}

start()





