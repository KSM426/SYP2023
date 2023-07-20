const mainPage = document.querySelector(".mainPage");
let gameBoard;
let ctx;

let level = 1;
let playerInitX = [0, 30, 30, 30, 30, 42.5, 40, 40, 40, 42.5];
let playerInitY = [0, 190, 30, 30, 30, 270, 40, 40, 40, 30];
let goalInitX = [0, 550, 570, 570, 450, 50, 330, 570, 570, 50];
let goalInitY = [0, 200, 30, 30, 250, 350, 50, 370, 370, 350];

let playerX;
let playerY;
const playerSize = 15;
const playerColor = "blue";
const playerInertia = 0.93;

let goalX;
let goalY;
const goalColor = "green";
const goalRadius = 10;

let gameWidth;
let gameHeight;
const backgroundColor = "white";

let vx = 0;
let vy = 0;
const speed = 0.12;


let wall = [[], [],
[
    {x : 150, y : 0, width : 2, height : 300, type : 0},
    {x : 300, y : 100, width : 2, height : 300, type : 0},
    {x : 450, y : 0, width : 2, height : 300, type : 0},
], 
[
    //0 : wall, 1 : closed door, 2 : open door, 3 : lava wall
    {x : 372.5, y : 300, width : 2, height : 100, type : 1, c : "#E19433"},
    {x : 150, y : 0, width : 2, height : 300, type : 0},
    {x : 300, y : 100, width : 2, height : 200, type : 0},
    {x : 450, y : 0, width : 2, height : 300, type : 0},
    {x : 300, y : 300, width : 152, height : 2, type : 0},
],
[
    {x : 350, y : 300, width : 2, height : 100, type : 1, c : "#E19433"},
    {x : 400, y : 100, width : 100, height : 2, type : 1, c : "#51E0DB"},
    {x : 100, y : 0, width : 2, height : 300, type : 3},
    {x : 300, y : 100, width : 2, height : 200, type : 3},
    {x : 500, y : 0, width : 2, height : 300, type : 3},
    {x : 400, y : 100, width : 2, height : 200, type : 3},
    {x : 100, y : 200, width : 125, height : 2, type : 3},
    {x : 175, y : 300, width : 327, height : 2, type : 3},
    {x : 175, y : 100, width : 127, height : 2, type : 3},
],
[
    {x : 150, y : 0, width : 2, height : 102, type : 1, c : "#E19433"},
    {x : 340, y : 320, width : 2, height : 40, type : 1, c : "#51E0DB"},
    {x : 0, y : 300, width : 100, height : 2, type : 1, c : "#7E02DB"},
    {x : 100, y : 240, width : 2, height : 160, type : 3},
    {x : 0, y : 160, width : 200, height : 2, type : 3},
    {x : 100, y : 100, width : 102, height : 2, type : 3},
    {x : 200, y : 160, width : 2, height : 202, type : 3},
    {x : 200, y : 100, width : 2, height : 62, type : 3},
    {x : 300, y : 100, width : 2, height : 262, type : 3},
    {x : 300, y : 360, width : 257, height : 2, type : 3},
    {x : 340, y : 360, width : 2, height : 42, type : 3},
    {x : 340, y : 0, width : 2, height : 322, type : 3},
    {x : 383, y : 40, width : 2, height : 322, type : 3},
    {x : 426, y : 0, width : 2, height : 322, type : 3},
    {x : 469, y : 40, width : 2, height : 322, type : 3},
    {x : 512, y : 0, width : 2, height : 322, type : 3},
    {x : 555, y : 40, width : 2, height : 322, type : 3},
    {x : 200, y : 50, width : 100, height : 2, type : 0},
    {x : 250, y : 50, width : 2, height : 352, type : 4, vx : 40, vy : 0, dur : 400, c : "black"},
    {x : 100, y : 30, width : 2, height : 100, type : 4, vx : 0, vy : 30, dur : 500, c : "red"},
    {x : 50, y : 240, width : 102, height : 2, type : 4, vx : 50, vy : 0, dur : 400, c : "red"},
],
[
    {x : 300, y : -20, width : 2, height : 382, type : 4, vx : 0, vy : -10, dur : 400, c : "red"},
    {x : -20, y : 80, width : 262, height : 2, type : 4, vx : 10, vy : 10, dur : 400, c : "red"},
    {x : 60, y : 360, width : 462, height : 2, type : 4, vx : 0, vy : -10, dur : 400, c : "red"},
    {x : 240, y : 80, width : 2, height : 222, type : 4, vx : 10, vy : 10, dur : 400, c : "red"},
    {x : 180, y : 140, width : 2, height : 222, type : 4, vx : 0, vy : -10, dur : 400, c : "red"},
    {x : 60, y : 140, width : 2, height : 222, type : 4, vx : 0, vy : -10, dur : 400, c : "red"},
    {x : 120, y : 80, width : 2, height : 222, type : 4, vx : 10, vy : 10, dur : 400, c : "red"},
    {x : 400, y : -10, width : 2, height : 282, type : 4, vx : 40, vy : -10, dur : 400, c : "red"},
    {x : 480, y : 50, width : 2, height : 312, type : 4, vx : 40, vy : -10, dur : 400, c : "red"},
    {x : 560, y : -10, width : 2, height : 372, type : 4, vx : 40, vy : -10, dur : 400, c : "red"},
    {x : 300, y : 140, width : 302, height : 2, type : 4, vx : 0, vy : 140, dur : 3200, c : "red"},
],
[

],
[

],
[
    
]
];

const wallColor = ["black", "yellow", "white", "red", "black"];
let die = false;

let lever = [[], [], [], 
[
    {x : 375, y : 250, c : "#E19433", click : 0},
],
[
    {x : 350, y : 250, c : "#E19433", click : 0},
    {x : 550, y : 30, c : "#51E0DB", click : 0},
],
[
    {x : 320, y : 380, c : "#E19433", click : 0},
    {x : 170, y : 130, c : "#51E0DB", click : 0},
    {x : 360, y : 380, c : "#7E02DB", click : 0},
],
[

],
[

],
[

],
[

]
];

let cannon = [
[], [], [], [], [], [], [],
[
    {x : 300, y : 200, v : 1, dur : 7, theta : 2 * Math.PI / 20, t0 : 0, vx : 0, vy : 0, vdur : 100},
],
[
    {x : 300, y : 200, v : 1, dur : 10, theta : 2 * Math.PI / 13, t0 : 0, vx : 100, vy : 0, vdur : 500},
],
[
    {x : 590, y : 100, v : 3, dur : 200, theta : 2 * Math.PI, t0 : Math.PI, vx : 0, vy : 0, vdur : 500},
    {x : 590, y : 200, v : 3, dur : 200, theta : 2 * Math.PI, t0 : Math.PI, vx : 0, vy : 0, vdur : 500},
    {x : 590, y : 300, v : 3, dur : 200, theta : 2 * Math.PI, t0 : Math.PI, vx : 0, vy : 0, vdur : 500},
],
]
const cannonColor = "red";
const cannonRadius = 20;
    
let bullet = [
    {x : 300, y : 200, vx : -1, vy : 0}, 
];
const bulletColor = "red";
const bulletRadius = 5;

const leverRadius = 10;
const duration = 500;
let timePassed = 0;

function gameStart() {
    mainPage.innerHTML = "<canvas id = 'gameBoard' width = '600' height = '400'></canvas>";
    gameBoard = document.querySelector("#gameBoard");
    ctx = gameBoard.getContext("2d");
    gameWidth = gameBoard.width;
    gameHeight = gameBoard.height;
    playerX = playerInitX[level];
    playerY = playerInitY[level];
    vx = vy = 0;
    goalX = goalInitX[level];
    goalY = goalInitY[level];
    die = false;
    timePassed = 0;
    goalEffectFlag = 1;
    dieEffectFlag = 1;
    for(let i=0; i<goalEffectNum; i++) goalEffect.pop();
    for(let i=0; i<dieEffectNum**2; i++) dieEffect.pop();
    drawPlayer();
    drawGoal();
    initDoor();
    setupInputs();
    nextMotion();
}

let goalEFrame = 140;
let mergeEFrame = 100;
let dieEFrame = 200;
let goalEffectFlag = 1;
let dieEffectFlag = 1;

function nextMotion() {
    setTimeout(()=>{
        ++timePassed;
        clearBoard();
        if(!isGoal() && !die) movePlayer();
        makeBullet();
        moveBullet();
        drawBullet();
        drawCannon();
        drawGoal();
        drawWall();
        drawLever();
        if(!die) drawPlayer();
        touchedBullet();
        onLever();
        if(die && dieEffectFlag <= dieEFrame){
            if(dieEffectFlag == 1) createDieEffect(playerX, playerY, vx, vy);
            if(dieEffectFlag == mergeEFrame) mergeDieEffect();
            moveDieEffect();
            drawDieEffect();
            dieEffectFlag++;
            nextMotion();
        }
        else if(die) gameStart();
        else if(isGoal() && goalEffectFlag <= goalEFrame) {
            if(goalEffectFlag == 1) createGoalEffect(goalX, goalY);
            moveGoalEffect();
            drawGoalEffect();
            goalEffectFlag++;
            nextMotion();
        }
        else if(isGoal()){
            ++level;
            gameStart();
        }
        else nextMotion();
    }, 1);
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
        if(wall[level][i].type == 1 || wall[level][i].type == 4) ctx.fillStyle = wall[level][i].c;
        else ctx.fillStyle = wallColor[wall[level][i].type];
        if(wall[level][i].type == 4) {
            let d = Math.sin(2 * Math.PI / wall[level][i].dur * timePassed);
            ctx.fillRect(wall[level][i].x + wall[level][i].vx * d, wall[level][i].y + wall[level][i].vy * d, wall[level][i].width, wall[level][i].height);
        }
        else ctx.fillRect(wall[level][i].x, wall[level][i].y, wall[level][i].width, wall[level][i].height);
    }
}

function drawLever() {
    for(let i = 0; i < lever[level].length; ++i) {
        if(lever[level][i].click) continue;
        ctx.fillStyle = lever[level][i].c;
        ctx.beginPath();
        ctx.arc(lever[level][i].x, lever[level][i].y, leverRadius + Math.sin(2 * Math.PI / duration * timePassed), 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.stroke();
    }
}

function drawGoal() {
    ctx.fillStyle = goalColor;
    ctx.beginPath();
    ctx.arc(goalX, goalY, goalRadius + Math.sin(2 * Math.PI / duration * timePassed), 0, 2 * Math.PI, true);
    ctx.fill();
}

function drawCannon() {
    ctx.fillStyle = cannonColor;
    for(let i = 0; i < cannon[level].length; ++i) {
        ctx.beginPath();
        let d = Math.sin(2 * Math.PI / cannon[level][i].vdur * timePassed);
        ctx.arc(cannon[level][i].x + cannon[level][i].vx * d, cannon[level][i].y + cannon[level][i].vy * d, cannonRadius + Math.sin(2 * Math.PI / duration * timePassed), 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.stroke();
    }
}

function drawBullet() {
    ctx.fillStyle = bulletColor;
    for(let i = 0; i < bullet.length; ++i) {
        ctx.beginPath();
        ctx.arc(bullet[i].x, bullet[i].y, bulletRadius, 0, 2 * Math.PI, true);
        ctx.fill();
    }
}

function moveBullet() {
    for(let i = bullet.length - 1; i >= 0; --i) {
        bullet[i].x += bullet[i].vx; bullet[i].y += bullet[i].vy;
        if(bullet[i].x < 0 || bullet[i].x > gameWidth || bullet[i].y < 0 || bullet[i].y > gameHeight) bullet.splice(i, 1);
    }
}

let cannonNum = 0;
function makeBullet() {
    ++cannonNum;
    for(let i = 0; i < cannon[level].length; ++i) {
        if(cannonNum % cannon[level][i].dur == 0) {
            let d = Math.sin(2 * Math.PI / cannon[level][i].vdur * timePassed);
            let theta = cannon[level][i].t0 + cannon[level][i].theta * cannonNum / cannon[level][i].dur;
            bullet.push({x : cannon[level][i].x + cannon[level][i].vx * d, y : cannon[level][i].y + cannon[level][i].vy * d, vx : cannon[level][i].v * Math.cos(theta), vy : cannon[level][i].v * Math.sin(theta)});
        }
    }
}


function initDoor() {
    for(let i = 0; i < lever[level].length; ++i) {
        lever[level][i].click = 0;
        wall[level][i].type = 1;
    }
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

function touchedBullet() {
    let x = playerX + playerSize/2;
    let y = playerY + playerSize/2;
    for(let i = 0; i < bullet.length; ++i) {
        let dist = ((x - bullet[i].x)**2 + (y - bullet[i].y)**2)**(1/2);
        let eps = 5;
        if(dist <= playerSize) die = true;
    }
}


let keyD = false;
let keyA = false;
let keyW = false;
let keyS = false;
function setupInputs() {
    document.addEventListener("keydown", function(event){
        const keyPressed = event.key;
        if(keyPressed == 'd' || keyPressed == 'ArrowRight') keyD = true;
        if(keyPressed == 'a' || keyPressed == 'ArrowLeft') keyA = true;
        if(keyPressed == 'w' || keyPressed == 'ArrowUp') keyW = true;
        if(keyPressed == 's' || keyPressed == 'ArrowDown') keyS = true;
    });
    
    document.addEventListener("keyup", function(event){
        const keyPressed = event.key;
        if(keyPressed == 'd'|| keyPressed == 'ArrowRight') keyD = false;
        if(keyPressed == 'a'|| keyPressed == 'ArrowLeft') keyA = false;
        if(keyPressed == 'w'|| keyPressed == 'ArrowUp') keyW = false;
        if(keyPressed == 's'|| keyPressed == 'ArrowDown') keyS = false;
    });
}

function movePlayer() {
    if(keyD) vx += speed;
    if(keyA) vx -= speed;
    if(keyS) vy += speed;
    if(keyW) vy -= speed;
    playerX += vx; playerY += vy;
    wallCollision();
    vx *= playerInertia;
    vy *= playerInertia;
}

let wallcnt = 0;
const wallmx = 13;
const elasticCoef = 1.3;
function wallCollision() {
    if(playerX < 0 || playerX + playerSize > gameWidth) playerX -= vx * elasticCoef, vx = -vx;
    if(playerY < 0 || playerY + playerSize > gameHeight) playerY -= vy * elasticCoef, vy = -vy;
    
    for(let i = 0; i < wall[level].length; ++i) {
        if(wall[level][i].type == 2) continue;
        if(wallcnt < wallmx) wallCollisionX(i), wallCollisionY(i);
        else wallCollisionY(i), wallCollisionX(i);
    }
    if(++wallcnt == 2 * wallmx) wallcnt = 0;
}

function wallCollisionX(i) {
    let flag = false;
    let x1 = playerX, x2 = x1 + playerSize;
    let y1 = playerY, y2 = y1 + playerSize;
    let wx1 = wall[level][i].x, wx2 = wall[level][i].x + wall[level][i].width;
    let wy1 = wall[level][i].y, wy2 = wall[level][i].y + wall[level][i].height;
    if(wall[level][i].type == 4) {
        let d = Math.sin(2 * Math.PI / wall[level][i].dur * timePassed);
        wx1 += wall[level][i].vx * d; wx2 += wall[level][i].vx * d;
        wy1 += wall[level][i].vy * d; wy2 += wall[level][i].vy * d;
    }
    if(y2 >= wy1 && y1 <= wy2) {
        if(x1 < wx1 && x2 > wx1) flag = true;
        if(x1 < wx2 && x2 > wx2) flag = true;
    }
    if(flag) {
        playerX -= vx * elasticCoef;
        if(wall[level][i].type != 3 && wall[level][i].c != "red") vx = -vx;
        if(wall[level][i].type == 4) {
            let d1 = Math.sin(2 * Math.PI / wall[level][i].dur * timePassed);
            let d2 = Math.sin(2 * Math.PI / wall[level][i].dur * (timePassed + 1));
            wx1 += wall[level][i].vx * (d2 - d1); wx2 += wall[level][i].vx * (d2 - d1);
            wy1 += wall[level][i].vy * (d2 - d1); wy2 += wall[level][i].vy * (d2 - d1);
            x1 = playerX, x2 = x1 + playerSize;
            if((x1 < wx1 && x2 > wx1) || (x1 < wx2 && x2 > wx2)) playerX += wall[level][i].vx * (d2 - d1) * elasticCoef;
        }
    }
    if((wall[level][i].type == 3 || wall[level][i].c == "red") && flag) die = true;
    
}

function wallCollisionY(i) {
    let flag = false;
    let x1 = playerX, x2 = x1 + playerSize;
    let y1 = playerY, y2 = y1 + playerSize;
    let wx1 = wall[level][i].x, wx2 = wall[level][i].x + wall[level][i].width;
    let wy1 = wall[level][i].y, wy2 = wall[level][i].y + wall[level][i].height;
    if(wall[level][i].type == 4) {
        let d = Math.sin(2 * Math.PI / wall[level][i].dur * timePassed);
        wx1 += wall[level][i].vx * d;
        wx2 += wall[level][i].vx * d;
        wy1 += wall[level][i].vy * d;
        wy2 += wall[level][i].vy * d;
    }
    if(x2 >= wx1 && x1 <= wx2) {
        if(y1 < wy1 && y2 > wy1) flag = true;
        if(y1 < wy2 && y2 > wy2) flag = true;
    }
    if(flag) {
        playerY -= vy * elasticCoef;
        if(wall[level][i].type != 3 && wall[level][i].c != "red") vy = -vy;
        if(wall[level][i].type == 4) {
            let d1 = Math.sin(2 * Math.PI / wall[level][i].dur * timePassed);
            let d2 = Math.sin(2 * Math.PI / wall[level][i].dur * (timePassed + 1));
            wx1 += wall[level][i].vx * (d2 - d1); wx2 += wall[level][i].vx * (d2 - d1);
            wy1 += wall[level][i].vy * (d2 - d1); wy2 += wall[level][i].vy * (d2 - d1);
            y1 = playerY, y2 = y1 + playerSize;
            if((y1 < wy1 && y2 > wy1) || (y1 < wy2 && y2 > wy2)) playerY += wall[level][i].vy * (d2 - d1) * elasticCoef;
        }
    }
    if((wall[level][i].type == 3 || wall[level][i].c == "red") && flag) die = true;
}

// ---------------------- EFFCET -----------------------------

let goalEffect=[
    //{x, y, vx, vy, ac, radius, alpha, border}
];
let dieEffect=[
    //{x, y, vx, vy, ac}
]
let goalEffectNum = 0;
let dieEffectNum = 3;
let splitSize = playerSize/dieEffectNum;

function createGoalEffect(gX, gY){
    goalEffectNum = 40+parseInt(Math.random()*20);
    for(let i=0; i<goalEffectNum ; i++){
        let goalEx, goalEy, goalEvx, goalEvy, ac, radius, alpha, border;
        goalEx=gX;
        goalEy=gY;
        goalEvx = 5.3+Math.random()*9;
        goalEvy = 5.3+Math.random()*9;
        if(parseInt(Math.random()*2)) goalEvx*=-1;
        if(parseInt(Math.random()*2)) goalEvy*=-1;
        ac = 0.84 + Math.random()/10;
        radius = 5+Math.random()*10;
        alpha = Math.random();
        border = parseInt(Math.random()*2);
        goalEffect.push({goalEy, goalEx, goalEvx, goalEvy, ac, radius, alpha, border});    
    }
}

function drawGoalEffect(){
    const sA = 0, eA = 2 * Math.PI;
    for(let i=0; i<goalEffectNum; i++){
        ctx.beginPath();
        ctx.arc(goalEffect[i].goalEx, goalEffect[i].goalEy, goalEffect[i].radius, sA, eA, true);
        ctx.fillStyle = "rgba(0, 150, 0, " + goalEffect[i].alpha + ")";
        ctx.fill();
        if(goalEffect[i].border) ctx.stroke();
    }
}

function moveGoalEffect(){
    for(let i=0; i<goalEffectNum; i++){
        goalEffect[i].goalEx += goalEffect[i].goalEvx;
        goalEffect[i].goalEy += goalEffect[i].goalEvy;
        goalEffect[i].goalEvx *= goalEffect[i].ac;
        goalEffect[i].goalEvy *= goalEffect[i].ac;
    }
}

function createDieEffect(pX, pY, vx, vy){
    for(let i=0; i<dieEffectNum; i++){
        for(let j=0; j<dieEffectNum; j++){
            let x, y, spvx, spvy, ac;
            x = pX + j*splitSize; y = pY + i*splitSize;
            spvx = vx + (1 - Math.random()*2)/3; spvy = vy + (1 - Math.random()*2)/3;
            ac = (Math.max(spvx, spvy) - Math.max(Math.abs(spvx/(mergeEFrame-1)), Math.abs(spvy/(mergeEFrame-1)))) / Math.max(spvx, spvy); 
            dieEffect.push({x, y, spvx, spvy, ac});
        }
    }
}

function mergeDieEffect(){
    for(let i=0; i<dieEffectNum; i++){
        for(let j=0; j<dieEffectNum; j++){
            let x0, y0, x, y, vx0, vy0, lx, ly;
            x0 = playerInitX[level] + j*splitSize; y0 = playerInitY[level] + i*splitSize;
            x = dieEffect[i*dieEffectNum+j].x; y = dieEffect[i*dieEffectNum+j].y;
            lx = x0 - x; ly = y0 - y;
            vx0 = lx/(dieEFrame - mergeEFrame); vy0 = ly/(dieEFrame - mergeEFrame);
            dieEffect[i*dieEffectNum+j].x = x;
            dieEffect[i*dieEffectNum+j].y = y;
            dieEffect[i*dieEffectNum+j].spvx = vx0;
            dieEffect[i*dieEffectNum+j].spvy = vy0;
            dieEffect[i*dieEffectNum+j].ac = 1;
        }
    }
}

function moveDieEffect(){
    for(let i=0; i<dieEffectNum*dieEffectNum; i++){
        dieEffect[i].x += dieEffect[i].spvx; dieEffect[i].y += dieEffect[i].spvy;
        dieEffect[i].spvx *= dieEffect[i].ac; dieEffect[i].spvy *= dieEffect[i].ac;
    }
}

function drawDieEffect(){
    for(let i=0; i<dieEffectNum*dieEffectNum; i++){
        ctx.beginPath();
        ctx.rect(dieEffect[i].x, dieEffect[i].y, splitSize, splitSize);
        ctx.fillStyle = "rgba(0, 0, 255)";
        ctx.fill();
    }
}
