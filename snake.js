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
// 17 - Game Over (start(), gameover(), interval)
// 18 - Text
// 19 - Score

// variables

// render
var canvas = document.querySelector('canvas')
var context = canvas.getContext('2d')

var columns = 16
var rows = 12
const blockSize = 16
const hud = blockSize * 2

var board = {
    left: 0,
    top: hud, // hud
    right: columns * blockSize,
    bottom: rows * blockSize + hud
}

canvas.width = board.right
canvas.height = board.bottom


// input
var currentKey

window.addEventListener('keydown', function (e) {
    currentKey = e.key
})

var interval

var audioBackground = new Audio('./assets/audio/bush_week.mp3')
var audioDeath = new Audio('./assets/audio/death.wav')
var audioItem = new Audio('./assets/audio/item.wav')
var audioItem2 = new Audio('./assets/audio/item2.wav')
var audioLetsRock = new Audio('./assets/audio/lets-rock.wav')
var audioMenu = new Audio('./assets/audio/menu.wav')
var audioPortal = new Audio('./assets/audio/portal.wav')

// game objects
var speed = 200
var score = 0
var hiScore = 0
var gameOver = false
var portal = false
var snake
var food
var background
var portal

var textGameOver = createText('#282a36', canvas.width / 2, canvas.height / 2,
    'Arial Black', '16px', 'center', 'Game Over', '#ff79c6')

var textPressEnter = createText('#8be9fd', canvas.width / 2, canvas.height / 2 + blockSize,
    'Arial', '12px', 'center', 'Press Enter to Start!')

var textScoreAndHiScore = createText('#f1fa8c', canvas.width / 2, canvas.height / 2 + blockSize * 2,
    'Arial', '12px', 'center')

var textScore = createText('#ff79c6', 24, 20, 'Arial', '12px')

var foodHUD = createBlock('#6b3454', 10, 12, blockSize / 2, blockSize / 2)

// functions
function createText(color, x, y, font, size, align = 'start', defaultValue, strokeColor) {
    return {
        color, x, y, font, size, align, defaultValue, strokeColor,
        draw(value = defaultValue) {
            renderText(this.color, this.x, this.y, this.font, this.size, this.align, value, this.strokeColor)
        }
    }
}

function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function createPortal() {
    var blocks = []
    for (var r = 0; r < rows; r++) {
        var row = []
        for (var c = 0; c < columns; c++) {

            if ((r == 0 || r == rows - 1 )) {
                var block = createBlock('#282a36')
                block.x = c * blockSize
                block.y = board.top + r * blockSize
                row.push(block)
            }

            if ((c == 0 || r == columns - 1 )) {
                var block = createBlock('#282a36')
                block.x = c * blockSize
                block.y = board.top + r * blockSize

                row.push(block)
            }

        }
        blocks.push(row)
    }


    return {

        draw() {
            for (var r = 0; r < rows; r++) {
                for (var c = 0; c < columns; c++) {
                    if ((r == 0 || r == rows - 1 )) {
                        var block = blocks[r][c]
                        render(block.color, block.x, block.y, blockSize, blockSize, '#8be9fd')
                    }
                    if ((c == 0 || r == columns - 1 )) {
                        var block = blocks[r][c]
                        render(block.color, block.x, block.y, blockSize, blockSize, '#ffb86c')
                    }

                }
            }
        }
    }
}

function createBackground() {

    var blocks = []
    for (var r = 0; r < rows; r++) {
        var row = []
        for (var c = 0; c < columns; c++) {
            var block = createBlock('#282a36')
            block.x = c * blockSize
            block.y = board.top + r * blockSize
            row.push(block)
        }
        blocks.push(row)
    }


    return {

        draw() {
            for (var r = 0; r < rows; r++) {
                for (var c = 0; c < columns; c++) {
                    var block = blocks[r][c]
                    render(block.color, block.x, block.y, blockSize, blockSize, '#6272a4')
                }
            }
        }
    }
}

function createFood() {
    return {
        color: '#6b3454',
        x: random(0, columns) * blockSize,
        y: board.top + random(0, rows) * blockSize,
        width: blockSize,
        height: blockSize,
        draw() {
            render(this.color, this.x, this.y, this.width, this.height, '#ff79c6')
        }
    }
}

function createBlock(color, x = 0, y = board.top, width = blockSize, height = blockSize, strokeColor = '#ff79c6') {
    return {
        color: color,
        x: x,
        y: y,
        width: width,
        height: height,
        strokeColor: strokeColor,
        draw() {
            render(this.color, this.x, this.y, this.width, this.height, this.strokeColor)
        }
    }
}

function createSnake() {

    // #32994c
    const body = [createBlock('#1b5429')]

    return {
        body: body,
        head: body[0],
        highlightedBlockIndex: null,
        growUp() {
            // add a new sprite on tail
            var last = this.body[this.body.length - 1]

            var newBodyBlock = createBlock('#1b5429')
            newBodyBlock.x = last.x
            newBodyBlock.y = last.y

            this.body.push(newBodyBlock)

            this.highlightedBlockIndex = 0
        },
        xDirection: 0,
        yDirection: 0,
        lastX: 0,
        lastY: 0,
        changeDirection(x, y) {

            // if(x != this.xDirection || y != this.yDirection)
            //     audioMenu.play()

            this.xDirection = x
            this.yDirection = y
        },
        move() {


            for (var i = 0; i < this.body.length; i++) {
                this.body[i].lastX = this.body[i].x
                this.body[i].lastY = this.body[i].y

                if (this.body[i] == this.head) {
                    this.body[i].x += this.xDirection * blockSize
                    this.body[i].y += this.yDirection * blockSize
                }
                else {
                    this.body[i].x = this.body[i - 1].lastX
                    this.body[i].y = this.body[i - 1].lastY
                }
            }

            this.highlightedBlockIndex += this.body.length <= 2 ? 1 : 2
        },
        draw() {
            this.body.forEach((b, i) => {
                if (i == this.highlightedBlockIndex) {
                    render('#50fa7b', b.x, b.y, b.width, b.height, '#50fa7b')
                }
                else {
                    render(b.color, b.x, b.y, b.width, b.height, '#50fa7b')
                }
            })
        }
    }
}

function render(color, x, y, width, height, strokeColor) {
    if (strokeColor) {
        context.strokeStyle = strokeColor
        context.lineWidth = 2
        context.strokeRect(x, y, width, height)
    }
    context.fillStyle = color
    context.fillRect(x, y, width, height)
}

function renderText(color, x, y, font, size, align, value, strokeColor) {
    if (strokeColor) {
        context.strokeStyle = strokeColor
        context.lineWidth = 2
        context.font = size + ' ' + font
        context.textAlign = align
        context.strokeText(value, x, y)
    }
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
    portal = createPortal()
    gameOver = false
    speed = 200

    // start(re) loop
    if (interval)
        clearInterval(interval)

    interval = setInterval(loop, speed)

    audioBackground.loop = true
    audioLetsRock.play()

}

function changeSpeed() {
    speed -= 50
    clearInterval(interval)
    interval = setInterval(loop, speed)
}

function loop() {

    if (audioBackground.paused)
        audioBackground.play()

    if (!gameOver) {

        // process input
        if (currentKey == 'ArrowUp' && snake.yDirection != 1)
            snake.changeDirection(0, -1)
        if (currentKey == 'ArrowRight' && snake.xDirection != -1)
            snake.changeDirection(1, 0)
        if (currentKey == 'ArrowDown' && snake.yDirection != -1)
            snake.changeDirection(0, 1)
        if (currentKey == 'ArrowLeft' && snake.xDirection != 1)
            snake.changeDirection(-1, 0)

        snake.move()

        // update objects (position, collisions, etc)

        // check collision with food
        if (snake.head.x == food.x && snake.head.y == food.y) {
            score++
            audioItem.play()
            snake.growUp()
            food = createFood()

            if (score % 10 == 0) {
                audioItem2.play()
                changeSpeed()
            }

        }

        // check collision with screen bounds
        if (snake.head.x >= board.right || snake.head.x < board.left || snake.head.y < board.top || snake.head.y >= board.bottom) {
            audioDeath.play()
            gameOver = true
            hiScore = score > hiScore ? score : hiScore
        }

        // collision with body

        if (snake.body.length > 4) {
            snake.body.forEach(b => {
                if (snake.head != b) {
                    if (snake.head.x == b.x && snake.head.y == b.y) {
                        audioDeath.play()
                        gameOver = true
                        hiScore = score > hiScore ? score : hiScore
                    }
                }
            })
        }
        // render result
        context.clearRect(0, 0, canvas.width, canvas.height)

        background.draw()
        portal.draw()
        snake.draw()
        food.draw()
        textScore.draw('x ' + score)
        foodHUD.draw()
    }
    else {

        if (currentKey == 'Enter')
            start()
        else {
            context.clearRect(0, 0, canvas.width, canvas.height)
            textGameOver.draw()
            textPressEnter.draw()
            textScoreAndHiScore.draw('Score: ' + score + " - Hi-Score: " + hiScore)
        }

    }
}

start()





