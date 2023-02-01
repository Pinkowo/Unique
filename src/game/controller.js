let pressKey = { keyLeft: false, keyRight: false, keyJump: false };
let jump = { status: 0, height: 32, distance: 32, from: boundInfo.h - pixel * 2, count: 1 };
let map = { floor: boundInfo.h - pixel * 2, goal: 5, end: false };
let charaStatus = { speed: 1.8, onGround: false };
let initScenePos = { x: 0, y: -64 };

function init() {
    scene.position.set(initScenePos.x, initScenePos.y);
    jump.status = 1;
    app.ticker.add(delta => gameLoop(delta));
}
init();

function gameLoop(delta) {
    gameStatus();
    if (!map.end) {
        showScene();
    }
    chaMove(delta);
}

function gameStatus() {
    if (doorOpen.visible &&
        boxesIntersect(chara, doorOpen) &&
        (chara.x > doorOpen.getGlobalPosition().x) &&
        (chara.x - 16 < doorOpen.getGlobalPosition().x)) {
        scene.visible = false;
        endScene.visible = true;
        doorOpen.visible = false;
        map.end = true;
    }
    bg1.x -= 0.5;
    bg2.x -= 0.5;
    if (bg1.x == -640)
        bg1.x = 640;
    if (bg2.x == -640)
        bg2.x = 640;
}

function showScene() {
    let maxWallPrior = 4;
    wallsGroup.forEach(walls => {
        if (chara.x + chara.width >= walls.wall.getGlobalPosition().x - pixel * 2 &&
            chara.x <= walls.wall.getGlobalPosition().x + walls.wall.width + pixel * 2 &&
            walls.wall.getGlobalPosition().y >= chara.y - 100 &&
            walls.wall.getGlobalPosition().y <= chara.y + chara.height + 5) {
            let wallPrior = detectWall(walls);
            if (wallPrior < maxWallPrior) maxWallPrior = wallPrior;
        }
    });
    switch (maxWallPrior) {
        case 1:
            jump.distance = 0;
            break;
        case 2:
            jump.distance = 16;
            break;
        case 3:
            jump.distance = 24;
            break;
        case 4:
            break;
    }

    starGroup.forEach(star => {
        if (star.exist) detectStar(star);
    });
}

function detectWall(walls) {
    if (chara.y < walls.wall.getGlobalPosition().y)
        walls.isUp = true;
    else if (chara.y > walls.wall.getGlobalPosition().y + walls.wall.height)
        walls.isUp = false;

    if (chara.x > walls.wall.getGlobalPosition().x + walls.wall.width) {
        walls.isMiddle = false;
        walls.isRight = true;
    } else if (chara.x + chara.width < walls.wall.getGlobalPosition().x) {
        walls.isMiddle = false;
        walls.isRight = false;
    } else {
        walls.isMiddle = true;
    }

    if (walls.isUp) {
        if (boxesIntersect(chara, walls.wall)) {
            jump.from = walls.wall.getGlobalPosition().y - chara.height + 1;
        } else {
            jump.from = map.floor;
            jump.status = jump.count;
            walls.isUp = false;
        }
    }
    if (!walls.isUp) {
        if (walls.isMiddle) {
            for (let i = 1; i <= 3; i++) {
                if (chara.y == walls.wall.getGlobalPosition().y + pixel * i ||
                    chara.y == walls.wall.getGlobalPosition().y + pixel * i + 1) {
                    return i;
                }
            }
        }

        if (boxesIntersect(chara, walls.wall)) {
            if (!walls.isRight) {
                chara.x = walls.wall.getGlobalPosition().x - chara.width;
            }
            if (walls.isRight) {
                chara.x = walls.wall.getGlobalPosition().x + walls.wall.width;
            }
        }
    }
}

function detectStar(star) {
    if (boxesIntersect(chara, star.star) &&
        (chara.x + 20 > star.star.getGlobalPosition().x) &&
        (chara.x - 10 < star.star.getGlobalPosition().x)) {
        star.star.visible = false;
        star.exist = false;
        score++;
        scoreNum.innerHTML = score;
        if (score >= map.goal) {
            doorOpen.visible = true;
        }
    }
}

function chaMove(delta) {
    if (pressKey.keyLeft) {
        closeMainChaPic(walkLeft);
        let cameraMove = camera('left', charaStatus.speed + delta);
        if (!cameraMove) chara.x -= charaStatus.speed + delta;

    }
    if (pressKey.keyRight) {
        closeMainChaPic(walkRight);
        let cameraMove = camera('right', charaStatus.speed + delta);
        if (!cameraMove) chara.x += charaStatus.speed + delta;
    }
    if (jump.status > 0) {
        jump.distance -= 2;
        let cameraMove = camera('jump', jump.distance);
        if (!cameraMove) chara.y -= jump.distance;
        jump.distance *= 0.8;
        if (chara.y >= jump.from) {
            chara.y = jump.from;
            jump.status = 0;
        }
    }
}

document.onkeydown = function (e) {
    if (e.key === "ArrowLeft") {
        pressKey.keyLeft = true;
        walkLeft.play();
    }
    if (e.key === "ArrowRight") {
        pressKey.keyRight = true;
        walkRight.play();
    }
    if (e.key === " " && !pressKey.keyJump && jump.status < jump.count) {
        jump.distance = jump.height;
        pressKey.keyJump = true;
        jump.status += 1;
    }
}
document.onkeyup = function (e) {
    if (e.key === "ArrowLeft") {
        pressKey.keyLeft = false;
        closeMainChaPic(stopLeft);
        walkLeft.stop();
    }
    if (e.key === "ArrowRight") {
        pressKey.keyRight = false;
        closeMainChaPic(stopRight);
        walkRight.stop();
    }
    if (e.key === " ") {
        pressKey.keyJump = false;
    }
}

function camera(status, speed) {
    switch (status) {
        case 'right':
            if (chara.x >= stage.w - pixel * 2) {
                chara.x = stage.w - pixel * 2;
                return false;
            } else if (chara.x >= stage.w - pixel * 3
                && stage.w - boundInfo.w < scene.x) {
                scene.x -= speed;
                if (stage.w - boundInfo.w > scene.x)
                    scene.x = stage.w - boundInfo.w;
                return true;
            }
            return false;
        case 'left':
            if (chara.x < pixel) {
                chara.x = pixel;
                return false;
            } else if (chara.x <= pixel * 2
                && scene.x < 0) {
                scene.x += speed;
                if (scene.x > 0)
                    scene.x = 0;
                return true;
            }
            return false;
        case 'jump':
            if (chara.y <= pixel * 3
                && scene.y < 0) {
                scene.y -= speed;
                if (scene.y > 0) {
                    scene.y = 0;
                    return false;
                }
                return true;
            }
            if (chara.y >= stage.h - pixel * 2) {
                jump.from = stage.h - pixel * 2;
                chara.y = jump.from;
                return false;
            } else if (chara.y >= stage.h - pixel * 3
                && stage.h - boundInfo.h < scene.y) {
                scene.y += speed;
                if (stage.h - boundInfo.h > scene.y)
                    scene.y = stage.h - boundInfo.h;
                return true;
            }
            return false;
    }
}

function closeMainChaPic(obj) {
    stopLeft.visible = false;
    stopRight.visible = false;
    walkLeft.visible = false;
    walkRight.visible = false;
    obj.visible = true;
}

function boxesIntersect(a, b) {
    let ab = a.getBounds();
    let bb = b.getBounds();
    return ab.x + ab.width > bb.x &&
        ab.x < bb.x + bb.width &&
        ab.y + ab.height > bb.y &&
        ab.y < bb.y + bb.height;
}