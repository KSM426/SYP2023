const mainPage = document.querySelector(".mainPage");
let gameBoard;
let ctx;

let level = 1;
let playerInitX = [0, 30, 30, 29];
let playerInitY = [0, 190, 30, 248];
let goalInitX = [0, 550, 570, 570];
let goalInitY = [0, 200, 30, 30];

let playerX;
let playerY;
const playerSize = 20;
const playerColor = "blue";

let goalX;
let goalY;
const goalColor = "green";
const goalRadius = 10;

let gameWidth;
let gameHeight;
const backgroundColor = "white";

let vx = 0;
let vy = 0;
const speed = 0.3;

let wall = [[], [],
[
    {x : 150, y : 0, width : 5, height : 300, type : 0},
    {x : 300, y : 100, width : 5, height : 300, type : 0},
    {x : 450, y : 0, width : 5, height : 300, type : 0},
], 
[
    //0 : wall, 1 : closed door, 2 : open door, 3 : lava wall
    {x : 372.5, y : 305, width : 5, height : 100, type : 1, c : "yellow"},
    {x : 150, y : 0, width : 5, height : 300, type : 0},
    {x : 300, y : 100, width : 5, height : 200, type : 0},
    {x : 450, y : 0, width : 5, height : 300, type : 0},
    {x : 300, y : 300, width : 155, height : 5, type : 0},
]
];
const wallColor = ["black", "yellow", "white", "red"];

let lever = [[], [], [], 
[
    {x : 375, y : 250, c : "yellow", click : 0},
]];
const leverRadius = 10;

function gameStart() {
    mainPage.innerHTML = "<canvas id = 'gameBoard' width = '600' height = '400'></canvas>";
    gameBoard = document.querySelector("#gameBoard");
    ctx = gameBoard.getContext("2d");
    gameWidth = gameBoard.width;
    gameHeight = gameBoard.height;
    vx = vy = 0;
    keyA = keyS = keyD = keyW = false;
    playerX = playerInitX[level];
    playerY = playerInitY[level];
    goalX = goalInitX[level];
    goalY = goalInitY[level];
    drawPlayer();
    drawGoal();
    setupInputs();
    nextMotion();
}

function nextMotion() {
    setTimeout(()=>{
        clearBoard();
        movePlayer();
        drawGoal();
        drawWall();
        drawLever();
        drawPlayer();
        onLever();
        if(isGoal()) {
            ++level;
            gameStart();
        }
        else nextMotion();
    }, 10);
}

function clearBoard() {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function drawPlayer() {
    ctx.fillStyle = playerColor;
    ctx.fillRect(playerX, playerY, playerSize, playerSize);
}

function drawWall() {
    for(let i = 0; i < wall[level].length; ++i) {
        if(wall[level][i].type == 2) continue;
        if(wall[level][i].type == 1) ctx.fillStyle = wall[level][i].c;
        else ctx.fillStyle = wallColor[wall[level][i].type];
        ctx.fillRect(wall[level][i].x, wall[level][i].y, wall[level][i].width, wall[level][i].height);
    }
}

function drawLever() {
    for(let i = 0; i < lever[level].length; ++i) {
        if(lever[level][i].click) continue;
        ctx.fillStyle = lever[level][i].c;
        ctx.beginPath();
        ctx.arc(lever[level][i].x, lever[level][i].y, leverRadius, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.stroke();
    }
}

function drawGoal() {
    ctx.fillStyle = goalColor;
    ctx.beginPath();
    ctx.arc(goalX, goalY, goalRadius, 0, 2 * Math.PI, true);
    ctx.fill();
}

function isGoal() {
    let x = playerX + playerSize/2;
    let y = playerY + playerSize/2;
    let dist = ((x - goalX)**2 + (y - goalY)**2)**(1/2);
    let eps = 5;
    if(dist <= goalRadius + eps) return true;
    else return false;
}

function onLever() {
    let x = playerX + playerSize/2;
    let y = playerY + playerSize/2;
    for(let i = 0; i < lever[level].length; ++i) {
        let dist = ((x - lever[level][i].x)**2 + (y - lever[level][i].y)**2)**(1/2);
        let eps = 5;
        if(dist <= leverRadius + eps){
            wall[level][i].type = 2;
            lever[level][i].click = 1;
        } 
    }
}

let keyD = false;
let keyA = false;
let keyW = false;
let keyS = false;
function setupInputs() {
    document.addEventListener("keydown", function(event){
        const keyPressed = event.key;
        if(keyPressed == 'd') keyD = true;
        if(keyPressed == 'a') keyA = true;
        if(keyPressed == 'w') keyW = true;
        if(keyPressed == 's') keyS = true;
    });

    document.addEventListener("keyup", function(event){
        const keyPressed = event.key;
        if(keyPressed == 'd') keyD = false;
        if(keyPressed == 'a') keyA = false;
        if(keyPressed == 'w') keyW = false;
        if(keyPressed == 's') keyS = false;
    });
}

function movePlayer() {
    if(keyD) vx += speed;
    if(keyA) vx -= speed;
    if(keyS) vy += speed;
    if(keyW) vy -= speed;
    wallCollision();
    vx *= 0.95;
    vy *= 0.95;
}

function wallCollision() {
    let flagX = false;
    let flagY = false;
    let x1 = playerX + vx;
    let x2 = x1 + playerSize;
    let y1 = playerY + vy;
    let y2 = y1 + playerSize;
    if(x1 < 0 || x2 > gameWidth) flagX = true;
    for(let i = 0; i < wall[level].length; ++i) {
        if(wall[level][i].type == 2) continue;
        let wx1 = wall[level][i].x;
        let wx2 = wall[level][i].x + wall[level][i].width;
        let wy1 = wall[level][i].y;
        let wy2 = wall[level][i].y + wall[level][i].height;
        if(y2 >= wy1 && y1 <= wy2) {
            if(x1 < wx1 && x2 > wx1 && vx > 0) flagX = true;
            if(x1 < wx2 && x2 > wx2 && vx < 0) flagX = true;
        }
    }
    if(flagX) vx = -0.9 * vx;
    playerX += vx;
    
    if(y1 < 0 || y2 > gameHeight) flagY = true;
    for(let i = 0; i < wall[level].length; ++i) {
        if(wall[level][i].type == 2) continue;
        let wx1 = wall[level][i].x;
        let wx2 = wall[level][i].x + wall[level][i].width;
        let wy1 = wall[level][i].y;
        let wy2 = wall[level][i].y + wall[level][i].height;
        if(x2 >= wx1 && x1 <= wx2) {
            if(y1 < wy1 && y2 > wy1 && vy > 0) flagY = true;
            if(y1 < wy2 && y2 > wy2 && vy < 0) flagY = true;
        }
    }
    if(flagY) vy = -0.9 * vy;
    playerY += vy;
}