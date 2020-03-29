function Renderer(width, height) {

    let canvas = document.querySelector('canvas')
    let context = canvas.getContext('2d')

    canvas.width = width
    canvas.height = height

    this.screenBounds = function () {
        return { width: canvas.width, height: canvas.height }
    }

    this.clear = function () {
        context.clearRect(0, 0, canvas.width, canvas.height)
    }

    this.drawSprite = function (sprite) {
        context.fillStyle = sprite.color
        context.fillRect(sprite.x, sprite.y, sprite.width, sprite.height)
    }
}

function Input() {

    let keyPressed

    window.addEventListener('keydown', function (e) {
        keyPressed = e.key
    })

    this.keyPressed = function (key) {
        return keyPressed === key
    }
}

function FoodCreator() {

    this.framesBetweenFoods = 5

    this.update = function () {
        if (game.everyInterval(this.framesBetweenFoods)) {
            let randomX = random(0, 16)
            let randomY = random(0, 10)
            let newFood = new Food('yellow', randomX * boxSize, randomY * boxSize, boxSize, boxSize)
            game.addObject(newFood)
        }
    }
}

function Food(color, x, y, width, height) {
    this.sprite = new Sprite(color, x, y, width, height)
    this.collide = true

    this.draw = function () {
        renderer.drawSprite(this.sprite)
    }
}

function Background(color1, color2, rows, columns) {

    this.blocks = []
    let currentColor

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {

            if (y % 2 == 0)
                currentColor = x % 2 == 0 ? color1 : color2
            else
                currentColor = x % 2 == 0 ? color2 : color1

            let sprite = new Sprite(
                currentColor,
                x * boxSize,
                y * boxSize,
                boxSize,
                boxSize)

            this.blocks.push(sprite)
        }
    }

    this.draw = function () {
        this.blocks.forEach(b => renderer.drawSprite(b))
    }
}

function Player(color, x, y, width, height) {

    this.sprite = new Sprite(color, x, y, width, height)
    this.direction = { x: 0, y: 0 }
    this.collide = true

    this.sprites = [
        this.sprite
    ]

    this.head = this.sprites[0]

    this.updatePosition = function (sprite) {
        if (input.keyPressed('ArrowUp'))
            this.direction = { x: 0, y: -1 }
        if (input.keyPressed('ArrowDown'))
            this.direction = { x: 0, y: 1 }
        if (input.keyPressed('ArrowRight'))
            this.direction = { x: 1, y: 0 }
        if (input.keyPressed('ArrowLeft'))
            this.direction = { x: -1, y: 0 }

        sprite.x += this.direction.x * boxSize
        sprite.y += this.direction.y * boxSize
    }

    this.checkScreenBounds = function () {
        if (this.sprite.x + this.sprite.width > renderer.screenBounds().width) {
            this.sprite.x = 0
        }
        if (this.sprite.x < 0) {
            this.sprite.x = renderer.screenBounds().width - this.sprite.width
        }
        if (this.sprite.y < 0) {
            this.sprite.y = renderer.screenBounds().height - this.sprite.height
        }
        if (this.sprite.y + this.sprite.height > renderer.screenBounds().height) {
            this.sprite.y = 0
        }
    }

    this.update = function () {
        this.sprites.forEach(s => this.updatePosition(s))
        this.checkScreenBounds()
    }

    this.onCollision = function (object) {
        if (object.collide) {
            game.removeObject(object)
        }
    }

    this.draw = function () {
        this.sprites.forEach(s => renderer.drawSprite(s))
    }
}

function Sprite(color, x, y, width, height) {
    this.color = color
    this.x = x
    this.y = y
    this.width = width
    this.height = height

    this.checkCollision = function (other) {
        return this.x + this.width > other.x &&
            this.x < other.x + other.width &&
            this.y + this.height > other.y &&
            this.y < other.y + other.height
    }
}

function Game() {

    let objects = {}
    let collisionObjects = {}
    let frameCount = 0

    this.addObject = function (object) {
        // review this
        let keys = Object.keys(objects)
        let length = keys.length
        let index = length == 0 ? 1 : parseInt(keys[length - 1]) + 1
        object.id = index
        objects[index] = object

        if(object.collide){
            collisionObjects[index] = object
        }
    }

    this.removeObject = function (object) {
        delete objects[object.id]

        if(object.collide)
            delete collisionObjects[object.id]
    }


    this.start = function () {
        this.gameLoop = this.gameLoop.bind(this)
        // bind here is need because gameLoop function is called by window
        setInterval(this.gameLoop, 200)
    }

    this.checkCollisions = function () {
        // O(n²)
        for (let index1 in collisionObjects) {
            for (let index2 in collisionObjects) {

                let object1 = objects[index1]
                let object2 = objects[index2]
                // review this
                if (object1.id != object2.id &&
                    object1.sprite.checkCollision(object2.sprite) &&
                    object1.onCollision) {
                    object1.onCollision(object2)
                }
            }
        }
    }

    this.renderAll = function () {
        // clear screen before render game objects
        renderer.clear()
        // render all
        Object.values(objects).forEach(o => {
            if (o.draw)
                o.draw()
        })
    }

    this.updateAll = function () {
        Object.values(objects).forEach(o => {
            if (o.update)
                o.update()
        })
    }

    this.gameLoop = function () {
        this.updateAll()
        this.checkCollisions()
        this.renderAll()
        frameCount++
    }

    this.everyInterval = function (interval) {
        return (frameCount % interval) == 0
    }

}

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// dimensions
const boxSize = 16
const width = boxSize * 16
const height = boxSize * 10
// game controller
const game = new Game()
const input = new Input()
const renderer = new Renderer(width, height)

game.addObject(new Background('green', 'darkgreen', 10, 16))
game.addObject(new Player('red', boxSize * 2, boxSize * 2, boxSize, boxSize))
game.addObject(new FoodCreator())

game.start()

// 1 - Project
// 2 - Canvas, Context
// 3 - Sprite constructor
// 4 - GameLoop
// 5 - Input and Renderer
// 6 - Update position by input
// 7 - Player and Foods (Add and Remove objects, Generated unique ids, Map?)
// 8 - Collisions (Separeted Collection)
// 9 - Spawn Foods randomly every frame counts




