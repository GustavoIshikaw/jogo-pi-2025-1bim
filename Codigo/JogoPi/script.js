const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
canvas.width = 800;
canvas.height = 300;

let player = {
    x: 50,
    y: 200,
    width: 40,
    height: 40,
    dy: 0,
    gravity: 0.5,
    jumpPower: -10,
    doubleJumpPower: -8,
    grounded: false,
    jumpCount: 0
};

let obstacles = [];
let items = [];
let gameSpeed = 5;
let score = 0;
let coinCount = 0;
let isGameOver = false;

document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && (player.grounded || player.jumpCount < 2)) {
        if (player.grounded) {
            player.dy = player.jumpPower;
            player.grounded = false;
            player.jumpCount = 1; // Primeira vez que pulou
        } else if (player.jumpCount === 1) {
            player.dy = player.doubleJumpPower;
            player.jumpCount = 2; // Double jump
        }
    } else if (event.code === "ArrowDown" && player.grounded) {
        player.height = 20;
    }
});

document.addEventListener("keyup", (event) => {
    if (event.code === "ArrowDown") {
        player.height = 40;
    }
});

function endGame() {
    isGameOver = true;
    alert("Game Over! Score: " + score);
    document.location.reload(); // Reinicia o jogo
}

function update() {
    if (isGameOver) return;
    player.dy += player.gravity;
    player.y += player.dy;
    
    if (player.y >= 200) {
        player.y = 200;
        player.dy = 0;
        player.grounded = true;
        player.jumpCount = 0; // Reseta o contador de pulos
    }
    
    if (Math.random() < 0.02) {
        obstacles.push({ x: canvas.width, y: 220, width: 20, height: 40 });
    }
    
    if (Math.random() < 0.01) {
        items.push({ x: canvas.width, y: 180, width: 15, height: 15 });
    }
    
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= gameSpeed;
        if (
            player.x < obstacles[i].x + obstacles[i].width &&
            player.x + player.width > obstacles[i].x &&
            player.y < obstacles[i].y + obstacles[i].height &&
            player.y + player.height > obstacles[i].y
        ) {
            endGame();
        }
    }
    
    for (let i = 0; i < items.length; i++) {
        items[i].x -= gameSpeed;
        if (
            player.x < items[i].x + items[i].width &&
            player.x + player.width > items[i].x &&
            player.y < items[i].y + items[i].height &&
            player.y + player.height > items[i].y
        ) {
            coinCount += 1;
            items.splice(i, 1);
        }
    }
    
    obstacles = obstacles.filter((obstacle) => obstacle.x > -obstacle.width);
    items = items.filter((item) => item.x > -item.width);
    score++;
    gameSpeed += 0.001;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fundo do jogo (simples cor de fundo)
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Jogador (quadrado preto)
    ctx.fillStyle = "black";
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Obstáculos (retângulos vermelhos)
    ctx.fillStyle = "red";
    obstacles.forEach((obstacle) => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
    
    // Moedas (círculos amarelos)
    ctx.fillStyle = "gold";
    items.forEach((item) => {
        ctx.beginPath();
        ctx.arc(item.x + item.width / 2, item.y + item.height / 2, item.width / 2, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Exibe o texto de pontuação e moedas
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
    ctx.fillText("Coins: " + coinCount, 10, 40);
}

function gameLoop() {
    if (isGameOver) return;
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop(); // Inicia o jogo automaticamente
