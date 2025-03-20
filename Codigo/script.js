// Criando o canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
canvas.width = 800;
canvas.height = 300;

// Recupera moedas do localStorage
let coinCount = parseInt(localStorage.getItem("coinCount")) || 0;

let hero = {
    x: 50,
    y: 200,
    width: 40,
    height: 90,
    dy: 0,
    gravity: 0.5,
    jumpPower: -10,
    grounded: false,
    canDoubleJump: false,
    color: "blue"
};

let obstacles = [];
let coins = [];
let gameSpeed = 5;
let score = 0;
let isGameOver = false;
let upgrades = { jumpPower: -10, gravity: 0.5, speed: 5 };
let colorPrices = { "red": 5, "green": 10, "purple": 15 };

function changeColor(color) {
    if (coinCount >= colorPrices[color]) {
        coinCount -= colorPrices[color];
        localStorage.setItem("coinCount", coinCount);
        hero.color = color;
        updateShopScreen();
    } else {
        alert("Not enough coins!");
    }
}

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        if (hero.grounded) {
            hero.dy = upgrades.jumpPower;
            hero.grounded = false;
            hero.canDoubleJump = true;
        } else if (hero.canDoubleJump) {
            hero.dy = upgrades.jumpPower;
            hero.canDoubleJump = false;
        }
    }
});

function update() {
    if (isGameOver) return;
    hero.dy += upgrades.gravity;
    hero.y += hero.dy;

    if (hero.y >= 200) {
        hero.y = 200;
        hero.dy = 0;
        hero.grounded = true;
        hero.canDoubleJump = false;
    }

    if (Math.random() < 0.02) {
        obstacles.push({ x: canvas.width, y: 220, width: 20, height: Math.random() * 30 + 30, color: "red" });
    }

    if (Math.random() < 0.03) {
        coins.push({ x: canvas.width, y: Math.random() * 150 + 50, width: 15, height: 15, color: "gold" });
    }

    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= upgrades.speed;

        if (
            hero.x < obstacles[i].x + obstacles[i].width &&
            hero.x + hero.width > obstacles[i].x &&
            hero.y < obstacles[i].y + obstacles[i].height &&
            hero.y + hero.height > obstacles[i].y
        ) {
            isGameOver = true;
            showGameOverScreen();
        }
    }

    for (let i = 0; i < coins.length; i++) {
        coins[i].x -= upgrades.speed;

        if (
            hero.x < coins[i].x + coins[i].width &&
            hero.x + hero.width > coins[i].x &&
            hero.y < coins[i].y + coins[i].height &&
            hero.y + hero.height > coins[i].y
        ) {
            coins.splice(i, 1);
            coinCount++;
            localStorage.setItem("coinCount", coinCount);
            score += 5;
        }
    }

    obstacles = obstacles.filter((obstacle) => obstacle.x > -obstacle.width);
    coins = coins.filter((coin) => coin.x > -coin.width);
    score++;
}

function showGameOverScreen() {
    const gameOverScreen = document.createElement("div");
    gameOverScreen.id = "gameOverScreen";
    gameOverScreen.style.position = "absolute";
    gameOverScreen.style.top = "50%";
    gameOverScreen.style.left = "50%";
    gameOverScreen.style.transform = "translate(-50%, -50%)";
    gameOverScreen.style.padding = "20px";
    gameOverScreen.style.backgroundColor = "#FFF";
    gameOverScreen.style.border = "2px solid black";
    gameOverScreen.style.textAlign = "center";
    gameOverScreen.innerHTML = `
        <p style="font-size: 30px;">Game Over!</p>
        <p>Score: ${score}</p>
        <p>Coins: ${coinCount}</p>
        <button onclick="restartGame()">Restart</button>
        <button onclick="openShop()">Shop</button>
    `;
    document.body.appendChild(gameOverScreen);
}

function restartGame() {
    document.getElementById("gameOverScreen").remove();
    score = 0;
    isGameOver = false;
    obstacles = [];
    coins = [];
    hero.y = 200;
    hero.dy = 0;
    hero.grounded = false;
    hero.canDoubleJump = false;
    gameLoop();
}

function openShop() {
    const existingShop = document.getElementById("shopScreen");
    if (existingShop) existingShop.remove();

    const shopScreen = document.createElement("div");
    shopScreen.id = "shopScreen";
    shopScreen.style.position = "absolute";
    shopScreen.style.top = "50%";
    shopScreen.style.left = "50%";
    shopScreen.style.transform = "translate(-50%, -50%)";
    shopScreen.style.padding = "20px";
    shopScreen.style.backgroundColor = "#FFF";
    shopScreen.style.border = "2px solid black";
    shopScreen.style.textAlign = "center";

    shopScreen.innerHTML = `<p style="font-size: 24px;">Shop</p>
                            <p><strong>Coins: <span id="coinDisplay">${coinCount}</span></strong></p>`;

    Object.keys(colorPrices).forEach(color => {
        const button = document.createElement("button");
        button.innerText = `${color} - ${colorPrices[color]} coins`;
        button.style.display = "block";
        button.style.margin = "5px auto";
        button.onclick = () => changeColor(color);
        shopScreen.appendChild(button);
    });

    const closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.style.marginTop = "10px";
    closeButton.onclick = closeShop;
    shopScreen.appendChild(closeButton);

    document.body.appendChild(shopScreen);
}

function updateShopScreen() {
    const coinDisplay = document.getElementById("coinDisplay");
    if (coinDisplay) coinDisplay.innerText = coinCount;
}

function closeShop() {
    const shop = document.getElementById("shopScreen");
    if (shop) shop.remove();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#2E8B57";
    ctx.fillRect(0, 250, canvas.width, 50);

    ctx.fillStyle = hero.color;
    ctx.fillRect(hero.x, hero.y, hero.width, hero.height);

    ctx.fillStyle = "red";
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    ctx.fillStyle = "gold";
    coins.forEach(coin => {
        ctx.fillRect(coin.x, coin.y, coin.width, coin.height);
    });

    ctx.fillStyle = "black";
    ctx.fillText(`Score: ${score}`, 10, 20);
    ctx.fillText(`Coins: ${coinCount}`, 10, 40);
}

function gameLoop() {
    update();
    draw();
    if (!isGameOver) requestAnimationFrame(gameLoop);
}

gameLoop();
