let canvas = document.querySelector('canvas')
let context = canvas.getContext('2d')

// screen size
let blockSize = 30
let rows = 12
let columns = 12
let hudHeight = blockSize * 2
canvas.width = columns * blockSize
canvas.height = rows * blockSize + hudHeight

let colors = {
    green: '#50fa7b',
    darkGreen: '#164a23',
    red: '#ff5555',
    darkRed: '#591e1e',
    cyan: '#8be9fd',
    gray: '#44475a',
    darkGray: '#282a36',
    pink: '#ff79c6',
    darkPink: '#5c2b47',
    yellow: '#f1fa8c'
}

let screenBounds = {
    top: hudHeight,
    right: canvas.width,
    bottom: canvas.height,
    left: 0
}

function createItemHUD(x, y, color, outlineColor){
    let icon = createGameObject(x, y, blockSize /2, blockSize/ 2, color, outlineColor)
    let text = createText(icon.x + icon.width + 6, icon.y + icon.height, 'Arial', '12px', outlineColor, 'left')

    return {
        icon,
        text,
        draw(value){
            text.draw(value)
            icon.draw()
        }
    }
}

function createBoard() {

    let blocks = []

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            blocks.push(
                createGameObject(
                    blockSize * j,
                    blockSize * i + hudHeight,
                    blockSize,
                    blockSize,
                    colors.darkGray,
                    colors.gray
                ))
        }
    }

    return {
        blocks,
        draw() {
            blocks.forEach(b => {
                b.draw()
            })
        }
    }
}

function createSnake() {
    return {
        body: [
            createGameObject(screenBounds.left, screenBounds.top, blockSize, blockSize, colors.darkGreen, colors.green),
        ],
        directionX: 0,
        directionY: 0,
        head() {
            return this.body[0]
        },
        tail() {
            return this.body[this.body.length - 1]
        },
        update() {
            // move body (before head)
            for (let i = this.body.length - 1; i > 0; i--) {
                this.body[i].x = this.body[i - 1].x
                this.body[i].y = this.body[i - 1].y
            }
            // move head
            // process input
            if (key == 'ArrowUp' && this.directionY != blockSize) {
                this.directionY = -blockSize
                this.directionX = 0
            }

            if (key == 'ArrowRight' && this.directionX != -blockSize) {
                this.directionX = blockSize
                this.directionY = 0
            }

            if (key == 'ArrowDown' && this.directionY != -blockSize) {
                this.directionY = blockSize
                this.directionX = 0
            }

            if (key == 'ArrowLeft' && this.directionX != blockSize) {
                this.directionX = -blockSize
                this.directionY = 0
            }

            this.head().x += this.directionX
            this.head().y += this.directionY

            // check screen bounds
            if (this.head().x > screenBounds.right - blockSize)
                this.head().x = screenBounds.left
            if (this.head().x < screenBounds.left)
                this.head().x = screenBounds.right - blockSize
            if (this.head().y < screenBounds.top)
                this.head().y = screenBounds.bottom - blockSize
            if (this.head().y > screenBounds.bottom)
                this.head().y = screenBounds.top
        },
        checkCollisions() {
            // check fruit collision
            if (this.head().x == fruit.x && this.head().y == fruit.y) {
                fruit = createGameObject(random(0, columns - 1) * blockSize, random(0, rows - 1) * blockSize + screenBounds.top, blockSize, blockSize, colors.darkPink, colors.pink)
                score++
                this.body.push(createGameObject(this.tail().x, this.tail().y, blockSize, blockSize, colors.darkGreen, colors.green))
            }

            if (this.body.length < 5) return

            // check body collisions
            for (let i = 0; i < this.body.length; i++) {
                if (this.body[i] != this.head() &&
                    this.body[i].x == this.head().x && this.body[i].y == this.head().y) {
                    gameOver = true
                }
            }
        },
        draw() {
            this.body.forEach(block => {
                block.draw()
            })
        }
    }
}

function createGameObject(x, y, width, height, color, outlineColor) {
    return {
        x,
        y,
        width,
        height,
        color,
        outlineColor,
        draw() {
            renderGameObject(this)
        }
    }
}

function createText(x, y, font = 'Arial', size = '22px', color = 'white', defaultValue, align = 'left') {
    return {
        x,
        y,
        font,
        size,
        color,
        value: defaultValue,
        align,
        draw(value) {

            if (value)
                this.value = value

            renderText(this)
        }
    }
}

// input
let key

window.addEventListener('keydown', function (e) {
    key = e.key
})

let score = 0
let fruit
let snake
let board
let gameOver = true
let interval

let textGameOver = createText(canvas.width / 2, canvas.height / 2, 'Arial', '22px', colors.yellow, 'Game Over!', 'center')
//let textScore = createText(blockSize / 2, blockSize, 'Arial', '16px', colors.pink, 'left')
let scoreHUD = createItemHUD(blockSize / 2, blockSize - blockSize/4, colors.darkPink, colors.pink)

start()

function start() {
    reset()
    interval = setInterval(gameloop, 200)
}

function reset() {
    fruit = createGameObject(6 * blockSize, 6 * blockSize, blockSize, blockSize, colors.darkPink, colors.pink)
    snake = createSnake()
    board = createBoard()
    score = 0
    gameOver = false
}

function gameloop() {

    if (!gameOver) {
        snake.update()
        snake.checkCollisions()

        clear()
        board.draw()
        snake.draw()
        fruit.draw()
        scoreHUD.draw('x ' + score)
    }
    else {
        // check if start again!
        if (key == 'Enter')
            reset()

        clear()
        textGameOver.draw()
    }
}

function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height)
}

function renderGameObject(gameObject) {
    if (gameObject.outlineColor) {
        context.fillStyle = gameObject.outlineColor
        context.fillRect(gameObject.x, gameObject.y, gameObject.width, gameObject.height)
        context.fillStyle = gameObject.color
        context.fillRect(gameObject.x+1, gameObject.y+1, gameObject.width-2, gameObject.height-2)
    }
    else {
        context.fillStyle = gameObject.color
        context.fillRect(gameObject.x, gameObject.y, gameObject.width, gameObject.height)
    }
}


function renderText(text) {
    context.font = text.size + ' ' + text.font
    context.fillStyle = text.color
    context.textAlign = text.align
    context.fillText(text.value, text.x, text.y)
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}




