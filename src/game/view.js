const pixel = 32;
const chaPos = { x: pixel * 6, y: pixel * 13 };
const stage = { w: pixel * 20, h: pixel * 15 };
const boundInfo = { w: pixel * 22, h: pixel * 17 };
const doorInfo = { x: pixel * 18, y: pixel * 14 };
const wallInfo = [
    { num: 5, x: pixel * 4, y: pixel * 13 },
    { num: 1, x: pixel * 8, y: pixel * 11 },
    { num: 10, x: pixel * 10, y: pixel * 10 },
    { num: 1, x: pixel * 16, y: pixel * 8 },
    { num: 1, x: pixel * 15, y: pixel * 7 },
    { num: 1, x: pixel * 14, y: pixel * 6 },
    { num: 1, x: pixel * 13, y: pixel * 5 },
];
const starInfo = [
    { x: pixel * 5, y: pixel * 12, exist: true },
    { x: pixel * 8, y: pixel * 10, exist: true },
    { x: pixel * 19, y: pixel * 9, exist: true },
    { x: pixel * 13, y: pixel * 4, exist: true },
    { x: pixel * 20, y: pixel * 15, exist: true }
];

//scene
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
scene.addChild(doorClose);

const doorOpenTexture = PIXI.Texture.from('../image/door_open.png');
const doorOpen = new PIXI.Sprite(doorOpenTexture);
doorOpen.position.set(doorInfo.x, doorInfo.y);
scene.addChild(doorOpen);
doorOpen.visible = false;


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
    star.scale.set(0.05, 0.05);
    star.position.set(info.x, info.y);
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
app.stage.addChild(chara);

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