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
// 14 - Draw in object
// 15 - Snake Body (array)
// 16 - GrowUp and Move (this)
// 15 - Game Over (start(), gameover(), interval)
// 16 - Text
// 17 - Score

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
    this.console.log('Current Key: ', currentKey)
})

var interval

// game objects

var score = 0
var hiScore = 0
var gameOver = false
var snake
var food
var background

var textGameOver = createText('red', canvas.width / 2, canvas.height / 2,
    'Arial', '16px', 'center', 'Game Over')

var textAfterGameOver = createText('white', canvas.width / 2, canvas.height / 2 + blockSize,
    'Arial', '12px', 'center', 'Press Enter to Start!')

var textScoreAndHiScore = createText('white', canvas.width / 2, canvas.height / 2 + blockSize * 2,
    'Arial', '12px', 'center')

var textScore = createText('yellow', 10, 20, 'Arial', '12px')

// functions
function createText(color, x, y, font, size, align = 'start', defaultValue) {
    return {
        color, x, y, font, size, align, defaultValue,
        draw(value = defaultValue) {
            renderText(this.color, this.x, this.y, this.font, this.size, this.align, value)
        }
    }
}

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

    function newBlock(color) {
        return {
            color: color,
            x: 0,
            y: 0,
            width: blockSize,
            height: blockSize
        }
    }

    const body = [newBlock('red')]

    return {
        body: body,
        head: body[0],
        growUp() {
            // add a new sprite on tail
            var last = this.body[this.body.length - 1]

            var newBodyBlock = newBlock('darkred')
            newBodyBlock.x = last.x
            newBodyBlock.y = last.y

            this.body.push(newBodyBlock)
        },
        move(i, x, y) {
            if (i < this.body.length) {
                var prevX = this.body[i].x
                var prevY = this.body[i].y
                this.body[i].x = x
                this.body[i].y = y
                this.move(i + 1, prevX, prevY)
            }
        },
        draw() {
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

function renderText(color, x, y, font, size, align, value) {
    context.font = size + ' ' + font
    context.fillStyle = color
    context.textAlign = align
    context.fillText(value, x, y)
}

function start() {
    // init values
    score = 0
    snake = createSnake()
    food = createFood()
    background = createBackground()
    gameOver = false

    // start(re) loop
    if (interval) {
        console.log('clear interval!')
        clearInterval(interval)
    }


    interval = setInterval(loop, 200)
}

function loop() {

    if (!gameOver) {

        // process input
        if (currentKey == 'ArrowUp') {
            snake.move(0, snake.head.x, snake.head.y - blockSize)
        }
        else if (currentKey == 'ArrowRight') {
            snake.move(0, snake.head.x + blockSize, snake.head.y)
        }
        else if (currentKey == 'ArrowDown') {
            snake.move(0, snake.head.x, snake.head.y + blockSize)
        }
        else if (currentKey == 'ArrowLeft') {
            snake.move(0, snake.head.x - blockSize, snake.head.y)
        }

        // update objects (logic, collisions, etc)

        if (snake.head.x == food.x && snake.head.y == food.y) {
            score++
            snake.growUp()
            food = createFood()
            // textScore.text = 'Score: ' + score
        }

        if (snake.head.x > canvas.width || snake.head.x < 0 || snake.head.y < 0 || snake.head.y > canvas.height) {
            gameOver = true
            hiScore = score > hiScore ? score : hiScore
        }

        // render result

        context.clearRect(0, 0, canvas.width, canvas.height)

        background.draw()
        snake.draw()
        food.draw()
        textScore.draw('Score: ' + score)
    }
    else {

        if (currentKey == 'Enter')
            start()
        else {
            context.clearRect(0, 0, canvas.width, canvas.height)
            textGameOver.draw()
            textAfterGameOver.draw('Press Enter to Start!')
            textScoreAndHiScore.draw('Score: ' + score + " - Hi-Score: " + hiScore)
        }

    }
}

start()





