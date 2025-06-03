
// board
let board
let boradWidth = 360
let boradHeight = 640
let context

// bird
let birdWidth = 34
let birdHeight = 24
let birdX = boradWidth / 8
let birdY = boradHeight / 2
let birdImg

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

// pipes
let pipeArray = []
let pipeWidth = 64
let pipeHeight = 512
let pipeX = boradWidth
let pipeY = 0

let topPipeImage
let bottomPipeImage

// physics
let velocityX = -1
let velocityY = 0
let gravity = 0.15

let gameOver = false
let score = 0

window.onload = () => {
    board = document.getElementById("board")
    board.height = boradHeight
    board.width = boradWidth
    context = board.getContext("2d")

    // draw bird

    // load Image
    birdImg = new Image()
    birdImg.src = "/public/flappybird.png"
    birdImg.onload = () => {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height)
    }

    topPipeImage = new Image()
    topPipeImage.src = "/public/toppipe.png"

    bottomPipeImage = new Image()
    bottomPipeImage.src = "/public/bottompipe.png"

    requestAnimationFrame(update)
    setInterval(placePipes, 1500)
    document.addEventListener("keydown", moveBird)
}

function update() {
    requestAnimationFrame(update)

    if(gameOver) {
        return
    }

    context.clearRect(0, 0, board.width, board.height)

    // bird
    velocityY += gravity
    if (velocityY > 5) {
        velocityY = 5
    }
    bird.y = Math.max(bird.y + velocityY, 0)
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height)

    if(bird.y > board.height) {
        gameOver = true
    }

    // pipes
    for(let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i]
        pipe.x += velocityX
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height)
    
        if(!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5
            pipe.passed = true
        }

        if(detectCollision(bird, pipe)) {
            gameOver = true
        }
    }

    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift()
    }

    context.fillStyle = "white"
    context.font = "45px sans-serif"
    context.fillText(score, 5, 45)

    if(gameOver) {
        context.fillText("Game Over", board.width / 6, board.height / 2)
    }
}

function placePipes() {

    if(gameOver) {
        return
    }

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2)
    let openningSpace = board.height / 4

    let toppipe = {
        img: topPipeImage,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }

    pipeArray.push(toppipe)

    let bottomPipe = {
        img: bottomPipeImage,
        x: pipeX,
        y: randomPipeY + pipeHeight + openningSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }

    pipeArray.push(bottomPipe)
}

function moveBird(e) {
    if(e.code == "space" || e.code == "ArrowUp" || e.code == "keyX") {
        velocityY = -4.5

        if(gameOver) {
            bird.y = birdY
            pipeArray = []
            score = 0
            gameOver = false
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width && 
    a.x + a.width > b.x && 
    a.y < b.y + b.height && 
    a.y + a.height > b.y
}