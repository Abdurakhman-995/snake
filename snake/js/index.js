let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let width = canvas.width;
let height = canvas.height;

let blockSize = 10;

let widthInBlocks = width / blockSize;
let heightInBlocks = height / blockSize;

let score = 0;

let drawBorder = function () {
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, height - blockSize, width, blockSize);
    ctx.fillRect(0, 0, blockSize, height);
    ctx.fillRect(width - blockSize, 0, blockSize, height);
}

let drawScore = function () {
    ctx.font = "20px arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Score: " + score, blockSize, blockSize);
}

let gameOver = function () {
    ctx.font = "50px Arial";
    ctx.fillStyle = "Black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game over", width / 2, height / 2);
    clearTimeout(timeoutID);
}

let circle = function (x, y, radius, fill) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    if (fill) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
}


let Block = function (col, row) {
    this.col = col;
    this.row = row;
}

Block.prototype.drawSquare = function (color) {
    let x = this.col * blockSize;
    let y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
}




Block.prototype.drawCircle = function (color) {
    let centerX = this.col * blockSize + blockSize / 2;
    let centerY = this.row * blockSize + blockSize / 2;
    ctx.fillStyle = color;
    circle(centerX, centerY, blockSize / 2, true);
};


Block.prototype.equal = function (otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
};

let Snake = function () {
    this.segments = [
        new Block(7, 5),
        new Block(6, 5),
        new Block(5, 5)
    ];

    this.direction = "right";
    this.nextDirection = "right";
};

let difColor = function (differentColor) {
    ctx.fillStyle = differentColor
}

Snake.prototype.draw = function () {
    for (let i = 0; i < this.segments.length; i++) {
        this.segments[0].drawSquare("green")
        if (i % 2) {
            this.segments[i].drawSquare(difColor("orange"));
        } else {
            this.segments[i].drawSquare(difColor("blue"))
        }
    }
};


Snake.prototype.move = function () {
    let head = this.segments[0];
    let newHead;

    this.direction = this.nextDirection;

    if (this.direction === "right") {
        newHead = new Block(head.col + 1, head.row);
    } else if (this.direction === "down") {
        newHead = new Block(head.col, head.row + 1)
    } else if (this.direction === "left") {
        newHead = new Block(head.col - 1, head.row);
    } else if (this.direction === "up") {
        newHead = new Block(head.col, head.row - 1);
    }
    if (this.checkCollision(newHead)) {
        gameOver();
        return;
    }
    this.segments.unshift(newHead);

    if (newHead.equal(apple.position)) {
        score++;
        apple.move(this.segments);
        animationTime -= 2;
    }
    else {
        this.segments.pop();
    }
};


Snake.prototype.checkCollision = function (head) {
    let leftCollision = (head.col === 0);
    let topCollision = (head.row === 0);
    let rightCollision = (head.col === widthInBlocks - 1);
    let bottomCollision = (head.row === widthInBlocks - 1);

    let wallColiision = leftCollision || topCollision || rightCollision || bottomCollision;

    let selfCollision = false;

    for (let i = 0; i < this.segments.length; i++) {
        if (head.equal(this.segments[i])) {
            selfCollision = true;
        }
    }
    return wallColiision || selfCollision;
};


Snake.prototype.setDirection = function (newDirection) {
    if (this.direction === "up" && newDirection === "down") {
        return;
    }
    if (this.direction === "down" && newDirection === "up") {
        return;
    }
    if (this.direction === "left" && newDirection === "right") {
        return;
    }
    if (this.direction === "right" && newDirection === "left") {
        return;
    }
    this.nextDirection = newDirection;
}

let Apple = function () {
    this.position = new Block(10, 10)
}

Apple.prototype.draw = function () {
    this.position.drawCircle("LimeGreen")
}

let apple = new Apple;
let snake = new Snake;

Apple.prototype.move = function (occupiedBlocks) {
    let randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
    let randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
    this.position = new Block(randomCol, randomRow);

    for (let i = 0; i < occupiedBlocks.length; i++) {
        if (this.position.equal(occupiedBlocks[i])) {
            this.move(occupiedBlocks);
            return
        }
    }
};


let directions = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
}

$("body").keydown(function (event) {
    let newDirection = directions[event.keyCode];
    if (newDirection !== undefined) {
        snake.setDirection(newDirection);
    }
});


let animationTime = 100;

let gameloop = function () {
    ctx.clearRect(0, 0, width, height);
    drawScore();
    drawBorder();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();
    let timeoutID = setTimeout(gameloop, animationTime);
};

gameloop()


    // let intervalId = setInterval(function () {
    //     ctx.clearRect(0, 0, width, height);
    //     drawScore();
    //     drawBorder();
    //     snake.move();
    //     snake.draw();
    //     apple.draw();
    //     drawBorder();
    // }, 100);



