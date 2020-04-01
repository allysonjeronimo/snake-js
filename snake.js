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

context.lineJoin = "round";
context.globalCompositeOperation = "lighter";


var columns = 16
var rows = 14
const blockSize = 18
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

var audioBackground = new Audio('./assets/audio/music/bush_week.mp3')
var audioDeath = new Audio('./assets/audio/fx/death.wav')
var audioItem = new Audio('./assets/audio/fx/item.wav')
var audioItem2 = new Audio('./assets/audio/fx/item2.wav')
var audioLetsRock = new Audio('./assets/audio/fx/lets-rock.wav')
var audioMenu = new Audio('./assets/audio/fx/menu.wav')
var audiowall = new Audio('./assets/audio/fx/wall.wav')

// game objects
var speed = 200
var score = 0
var hiScore = 0
var gameOver = false
var showWall = false
var snake
var food
var background
var wall
var frames = 0

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

function everyFrameCount(count) {
    return frames % count == 0
}

function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function createWall() {
    var blocks = []
    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < columns; c++) {
            if (c == 0 || c == columns - 1 || r == 0 || r == rows - 1) {
                var block = createBlock('#3b656e')
                block.x = c * blockSize
                block.y = board.top + r * blockSize
                blocks.push(block)
            }
        }
    }

    return {

        blocks: blocks,
        highlightedBlockIndex: null,
        update() {

            // if (!this.highlightedBlockIndex && everyFrameCount(100)) {
            //     this.highlightedBlockIndex = 0
            // }

            // this.highlightedBlockIndex += 4

            // if(this.highlightedBlockIndex > this.blocks.length)
            //     this.highlightedBlockIndex = null
        },
        draw() {
            blocks.forEach((block, index) => {
                if (index == this.highlightedBlockIndex)
                    render('#8be9fd', block.x, block.y, blockSize, blockSize, '#8be9fd')
                else
                    render(block.color, block.x, block.y, blockSize, blockSize, '#8be9fd')
            })
        }
    }
}

function createBackground() {

    var blocks = []

    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < columns; c++) {
            var block = createBlock('#282a36')
            block.x = c * blockSize
            block.y = board.top + r * blockSize
            blocks.push(block)
        }
    }

    return {

        draw() {
            blocks.forEach(block => {
                render(block.color, block.x, block.y, blockSize, blockSize, '#6272a4')
            })
        }
    }
}

function createFood() {
    return {
        color: '#6b3454',
        x: random(1, columns - 1) * blockSize,
        y: board.top + random(1, rows - 1) * blockSize,
        width: blockSize,
        height: blockSize,
        highlight: false,
        draw() {
            render(this.highlight ? '#ff79c6' : '#6b3454', this.x, this.y, this.width, this.height, '#ff79c6', this.highlight ? 8 : 4)
        },
        update() {
            if (everyFrameCount(10)){
                this.highlight = true
            }
            else{
                this.highlight = false
            }
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

    head = createBlock('#1b5429')
    head.x = random(1, columns - 1) * blockSize
    head.y = board.top + random(1, rows - 1) * blockSize

    const body = [head]

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
                    render('#50fa7b', b.x, b.y, b.width, b.height, '#50fa7b', 8)
                }
                else {
                    render(b.color, b.x, b.y, b.width, b.height, '#50fa7b', 4)
                }
            })
        }
    }
}

function render(color, x, y, width, height, strokeColor, neon) {

    if (strokeColor) {
        context.strokeStyle = strokeColor
        context.lineWidth = 2
        context.strokeRect(x, y, width, height)
    }
    if(neon){
        context.shadowColor = strokeColor
        context.shadowBlur = neon;
    }
    context.fillStyle = color
    context.fillRect(x, y, width, height)
    context.shadowBlur = 0;
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
    showWall = true
    gameOver = false
    speed = 200
    snake = createSnake()
    food = createFood()
    background = createBackground()
    wall = createWall()

    // start(re) loop
    if (interval)
        clearInterval(interval)

    interval = setInterval(loop, speed)

    audioBackground.loop = true
    audioLetsRock.play()

    frames = 0
}

function changeSpeed() {
    speed -= 10
    clearInterval(interval)
    interval = setInterval(loop, speed)
}

function loop() {

    frames++

    if (audioBackground.paused)
        audioBackground.play()

    if (!gameOver) {

        food.update()

        wall.update()
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

            if (score % 5 == 0) {
                showWall = !showWall
                audioItem2.play()
                changeSpeed()
            }

        }

        // check collision with screen bounds
        if (snake.head.x > board.right)
            snake.head.x = board.left
        if (snake.head.x < board.left)
            snake.head.x = board.right - blockSize
        if (snake.head.y < board.top)
            snake.head.y = board.bottom - blockSize
        if (snake.head.y > board.bottom)
            snake.head.y = board.top

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

        // collision with wall
        if (showWall) {
            wall.blocks.forEach((block, i) => {
                if (block.x == snake.head.x && block.y == snake.head.y) {
                    wall.highlightedBlockIndex = i
                    audioDeath.play()
                    gameOver = true
                    hiScore = score > hiScore ? score : hiScore
                }
            })
        }

        // render result
        context.clearRect(0, 0, canvas.width, canvas.height)

        background.draw()

        snake.draw()
        food.draw()

        if (showWall)
            wall.draw()

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





