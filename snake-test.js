let canvas = document.querySelector('canvas')
let context = canvas.getContext('2d')

// screen size
let blockSize = 30
let rows = 12
let columns = 12
canvas.width = columns * blockSize
canvas.height = rows * blockSize


function createSnake() {
    return {
        body: [
            createGameObject(blockSize, blockSize, blockSize, blockSize, 'green'),
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
            if (this.head().x > canvas.width)
                this.head().x = 0
            if (this.head().x < 0)
                this.head().x = canvas.width
            if (this.head().y < 0)
                this.head().y = canvas.height
            if (this.head().y > canvas.height)
                this.head().y = 0
        },
        checkCollisions() {
            // check fruit collision
            if (this.head().x == fruit.x && this.head().y == fruit.y) {
                fruit = createGameObject(random(0, columns - 1) * blockSize, random(0, rows - 1) * blockSize, blockSize, blockSize, 'red')
                score++
                this.body.push(createGameObject(this.head().x, this.head().y, blockSize, blockSize, 'green'))
            }
            // check body collisions
            for (let i = 1; i < this.body.length - 1; i++) {
                if (this.body[i].x == this.head().x && this.body[i].y == this.head().y) {
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

function createGameObject(x, y, width, height, color) {
    return {
        x,
        y,
        width,
        height,
        color,
        draw() {
            renderGameObject(this)
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
let gameOver = true
let interval

let textGameOver = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    font: 'Arial',
    size: '22px',
    color: 'yellow',
    value: 'Game Over!',
    align: 'center',
    draw() {
        renderText(this)
    }
}



start()

function start() {
    reset()
    interval = setInterval(gameloop, 200)
}

function reset() {
    fruit = createGameObject(6 * blockSize, 6 * blockSize, blockSize, blockSize, 'red')
    snake = createSnake()
    score = 0
    gameOver = false
}


function gameloop() {

    if (!gameOver) {
        snake.update()
        snake.checkCollisions()

        clear()
        snake.draw()
        fruit.draw()
    }
    else {
        // check if start again!
        if(key == 'Enter')
            reset()

        clear()
        textGameOver.draw()
    }
}

function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height)
}

function renderGameObject(gameObject) {
    context.fillStyle = gameObject.color
    context.fillRect(gameObject.x, gameObject.y, gameObject.width, gameObject.height)
}

function renderText(text) {
    console.log(text)
    context.font = text.size + ' ' + text.font
    context.fillStyle = text.color
    context.textAlign = text.align
    context.fillText(text.value, text.x, text.y)
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}




