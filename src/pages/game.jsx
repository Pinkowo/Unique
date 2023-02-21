import React from 'react';
import { Link } from "react-router-dom";
import { takeData } from '../components/gamedata.jsx';


class GamePage extends React.Component {
    constructor() {
        super();
        this.state = {
            minStarNum: 0
        };
    }
    componentDidMount() {
        takeData()
            .then((res) => {
                //view
                const pixel = 32;
                const stage = { w: 640, h: 480 };
                const chaPos = { x: res.chara.x, y: res.chara.y };
                const boundInfo = { w: pixel * res.map.w, h: pixel * res.map.h };
                const doorInfo = { x: res.door.x, y: res.door.y };
                const wallInfo = res.walls;
                const starInfo = res.stars;
                this.setState({
                    minStarNum: res.map.starMinNum
                });

                //controller
                let pressKey = { keyLeft: false, keyRight: false, keyJump: false };
                let jump = { status: 0, height: 32, distance: 32, from: boundInfo.h - pixel * 2, count: 1 };
                let map = { floor: boundInfo.h - pixel * 2, end: false };
                let charaStatus = { speed: 1.8, onGround: false };

                //view
                const app = new PIXI.Application({
                    background: '#1099bb',
                    width: stage.w,
                    height: stage.h,
                });
                app.view.setAttribute('id', 'canvas');
                const gameWindow = document.getElementById("game-window");
                gameWindow.appendChild(app.view);
                const scene = new PIXI.Container();

                //background
                const bgTexture = PIXI.Texture.from('../image/bg.jpg');
                const bg1 = new PIXI.Sprite(bgTexture);
                const bg2 = new PIXI.Sprite(bgTexture);
                bg1.position.set(0, 0);
                bg2.position.set(640, 0);
                app.stage.addChild(bg1);
                app.stage.addChild(bg2);

                //bound
                const bounds = new PIXI.ParticleContainer();
                const boundWidthNum = boundInfo.w / pixel;
                const boundHeightNum = boundInfo.h / pixel;
                const boundTexture = PIXI.Texture.from('../image/bound.jpg');
                for (let i = 0; i < boundWidthNum; i++) {
                    let bound = new PIXI.Sprite(boundTexture);
                    bound.position.set(pixel * i, 0);
                    bounds.addChild(bound);
                    bound = new PIXI.Sprite(boundTexture);
                    bound.position.set(pixel * i, boundInfo.h - pixel);
                    bounds.addChild(bound);
                }
                for (let i = 1; i < boundHeightNum - 1; i++) {
                    let bound = new PIXI.Sprite(boundTexture);
                    bound.position.set(0, pixel * i);
                    bounds.addChild(bound);
                    bound = new PIXI.Sprite(boundTexture);
                    bound.position.set(boundInfo.w - pixel, pixel * i);
                    bounds.addChild(bound);
                }
                scene.addChild(bounds);

                //door
                const doorCloseTexture = PIXI.Texture.from('../image/door_close.png');
                const doorClose = new PIXI.Sprite(doorCloseTexture);
                doorClose.position.set(doorInfo.x, doorInfo.y);
                if (res.door.x > 0) {
                    scene.addChild(doorClose);
                }

                const doorOpenTexture = PIXI.Texture.from('../image/door_open.png');
                const doorOpen = new PIXI.Sprite(doorOpenTexture);
                doorOpen.position.set(doorInfo.x, doorInfo.y);
                if (res.door.x > 0) {
                    scene.addChild(doorOpen);
                }
                if (res.map.starMinNum == 0) {
                    doorClose.visible = false;
                } else {
                    doorOpen.visible = false;
                }


                //wall
                let wallsGroup = [];
                const wallTexture = PIXI.Texture.from('../image/wall.jpeg');
                wallInfo.forEach(function (info) {
                    const bricks = new PIXI.ParticleContainer();
                    for (let i = 0; i < info.num; i++) {
                        const brick = new PIXI.Sprite(wallTexture);
                        brick.position.set(pixel * i, 0);
                        bricks.addChild(brick);
                    }
                    bricks.position.set(info.x, info.y);
                    scene.addChild(bricks);
                    const walls = {
                        id: info.num,
                        wall: bricks,
                        isUp: false,
                        isRight: false,
                        isMiddle: false
                    };
                    wallsGroup.push(walls);
                });

                //star
                const scoreNum = document.getElementById("score-number");
                let score = 0;
                let starGroup = [];
                let starTexture = PIXI.Texture.from('../image/star.png');
                starInfo.forEach(function (info) {
                    const star = new PIXI.Sprite(starTexture);
                    star.position.set(info.x - 16, info.y - 16);
                    scene.addChild(star);
                    const stars = {
                        star: star,
                        exist: info.exist
                    }
                    starGroup.push(stars);
                });
                app.stage.addChild(scene);

                //character
                const atlasData = {
                    frames: {
                        left1: {
                            frame: { x: 0, y: 32, w: 32, h: 32 },
                            sourceSize: { w: 32, h: 32 },
                            spriteSourceSize: { x: 0, y: 0, w: 32, h: 32 }
                        },
                        left2: {
                            frame: { x: 32, y: 32, w: 32, h: 32 },
                            sourceSize: { w: 32, h: 32 },
                            spriteSourceSize: { x: 0, y: 0, w: 32, h: 32 }
                        },
                        left3: {
                            frame: { x: 64, y: 32, w: 32, h: 32 },
                            sourceSize: { w: 32, h: 32 },
                            spriteSourceSize: { x: 0, y: 0, w: 32, h: 32 }
                        },
                        right1: {
                            frame: { x: 0, y: 64, w: 32, h: 32 },
                            sourceSize: { w: 32, h: 32 },
                            spriteSourceSize: { x: 0, y: 0, w: 32, h: 32 }
                        },
                        right2: {
                            frame: { x: 32, y: 64, w: 32, h: 32 },
                            sourceSize: { w: 32, h: 32 },
                            spriteSourceSize: { x: 0, y: 0, w: 32, h: 32 }
                        },
                        right3: {
                            frame: { x: 64, y: 64, w: 32, h: 32 },
                            sourceSize: { w: 32, h: 32 },
                            spriteSourceSize: { x: 0, y: 0, w: 32, h: 32 }
                        },
                    },
                    meta: {
                        image: '../image/cha.png',
                        format: 'RGBA8888',
                        size: { w: 96, h: 128 },
                        scale: 1
                    },
                    animations: {
                        left: ['left2', 'left3', 'left1'],
                        right: ['right2', 'right3', 'right1']
                    }
                }

                const spritesheet = new PIXI.Spritesheet(
                    PIXI.BaseTexture.from(atlasData.meta.image),
                    atlasData
                );
                spritesheet.parse();
                const walkLeft = new PIXI.AnimatedSprite(spritesheet.animations.left);
                const walkRight = new PIXI.AnimatedSprite(spritesheet.animations.right);
                walkLeft.animationSpeed = 0.1666;
                walkRight.animationSpeed = 0.1666;

                const stopRight = new PIXI.Sprite(spritesheet.textures.right2);
                const stopLeft = new PIXI.Sprite(spritesheet.textures.left2);
                const chara = new PIXI.Container();

                chara.addChild(stopRight);
                chara.addChild(stopLeft);
                chara.addChild(walkRight);
                chara.addChild(walkLeft);

                stopLeft.visible = false;
                stopRight.visible = false;
                walkLeft.visible = false;
                walkRight.visible = true;
                chara.position.set(chaPos.x, chaPos.y);
                if (res.chara.x > 0) {
                    app.stage.addChild(chara);
                }

                const endScene = new PIXI.Container();
                const successMsg = new PIXI.Container();
                let rectangle = new PIXI.Graphics();
                rectangle.lineStyle(4, 0xFFFFFF, 1);
                rectangle.beginFill(0x444444);
                rectangle.drawRoundedRect(0, 0, pixel * 10, pixel * 6, 10);
                rectangle.endFill();
                successMsg.addChild(rectangle);

                let style = new PIXI.TextStyle({
                    fontFamily: "Cubic",
                    fontSize: 36,
                    fill: "white"
                });
                let message = new PIXI.Text("恭喜通關", style);
                message.position.set(pixel * 2.5, pixel * 2.5)
                successMsg.addChild(message);
                successMsg.position.set(pixel * 5, pixel * 3);
                endScene.addChild(successMsg);
                endScene.visible = false;
                app.stage.addChild(endScene);

                //controller
                function init() {
                    initScenePos();
                    jump.status = 1;
                    app.ticker.add(delta => gameLoop(delta));
                }
                init();

                function initScenePos() {
                    let x;
                    if (chara.x - stage.w * 0.5 <= 0) x = 0;
                    else if (chara.x + chara.width + stage.w * 0.5 >= boundInfo.w) x = stage.w - boundInfo.w;
                    else x = stage.w * 0.5 - chara.x;

                    let y;
                    if (chara.y - stage.h * 0.5 <= 0) y = 0;
                    else if (chara.y + chara.height + stage.h * 0.5 >= boundInfo.h) y = stage.h - boundInfo.h;
                    else y = stage.h * 0.5 - chara.y;

                    scene.position.set(x, y);
                    chara.x += x;
                    chara.y += y;
                }

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
                                if (chara.x + chara.width > walls.wall.getGlobalPosition().x &&
                                    chara.x < walls.wall.getGlobalPosition().x + walls.wall.width &&
                                    (chara.y == walls.wall.getGlobalPosition().y + pixel * i ||
                                        chara.y == walls.wall.getGlobalPosition().y + pixel * i + 1)) {
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
                        if (score >= res.map.starMinNum) {
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
                                jump.from = stage.h - pixel * 2;
                                scene.y -= speed;
                                chara.y -= speed;
                                if (scene.y >= 0) {
                                    scene.y = 0;
                                    return false;
                                }
                                return true;
                            }
                            if (chara.y >= stage.h - pixel * 2) {
                                jump.from = stage.h - pixel * 2;
                                return false;
                            } else if (chara.y >= stage.h - pixel * 3
                                && stage.h - boundInfo.h < scene.y) {
                                scene.y += speed;
                                chara.y += speed;
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
            })
            .catch((err) => {
                console.log(err);
            });
    }

    componentWillUnmount() {
        document.getElementById("game-window").remove();
    }

    render() {
        return (
            <div className='container'>
                <div id="game-window">
                    <div id="score">
                        <img src="./image/star.png" alt="" />
                        <p>x <span id="score-number">0</span></p>
                        <p className='score-slash'>/<span id="score-goal">{this.state.minStarNum}</span></p>
                    </div>
                </div>
                <div className='container-btn-group'>
                    <Link to="/editor/pink" className="container-btn">
                        <img src="../image/icon_edit.png" alt="" />
                        <span className="tooltiptext">
                            Edit
                        </span>
                    </Link>
                </div>
            </div>
        )
    }
}

export default GamePage;