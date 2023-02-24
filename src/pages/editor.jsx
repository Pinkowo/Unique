import React from 'react';
import { SaveBtn, takeData } from '../components/gamedata.jsx';
import EditPanel from '../components/editPanel.jsx';


class EditorPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boundInfo: { w: 20, h: 15 },
            stars: [],
            walls: [],
            chara: {},
            door: {},
            items: [],
            starMinNum: 0
        };
        this.handlePlay = this.handlePlay.bind(this);
        this.handleStarChange = this.handleStarChange.bind(this);
        this.handleMapWChange = this.handleMapWChange.bind(this);
        this.handleMapHChange = this.handleMapHChange.bind(this);
    }
    componentDidMount() {
        if (this.props.user) {
            takeData('edit', this.props.user.uid)
                .then((res) => {
                    const pixel = 32;
                    const stage = { w: pixel * 23, h: pixel * 15 };
                    this.setState({ starMinNum: res.map.starMinNum });

                    this.setState({
                        boundInfo: { w: res.map.w, h: res.map.h }
                    }, () => {
                        //scene
                        const app = new PIXI.Application({
                            background: '#1099bb',
                            width: stage.w,
                            height: stage.h,
                        });
                        app.view.setAttribute('id', 'canvas');
                        const gameWindow = document.getElementById("editor-window");
                        gameWindow.appendChild(app.view);
                        PIXI.Container.defaultSortableChildren = true;
                        const scene = new PIXI.Container();
                        scene.pivot.set(-pixel * 3, 0);
                        scene.zIndex = 100;
                        app.stage.addChild(scene);

                        //bound
                        const bounds = new PIXI.Container();
                        const upBounds = new PIXI.ParticleContainer();
                        const downBounds = new PIXI.ParticleContainer();
                        const leftBounds = new PIXI.ParticleContainer();
                        const rightBounds = new PIXI.ParticleContainer();
                        const boundTexture = PIXI.Texture.from('../image/bound.jpg');
                        for (let i = 0; i < this.state.boundInfo.w; i++) {
                            let bound = new PIXI.Sprite(boundTexture);
                            bound.position.set(pixel * i, 0);
                            upBounds.addChild(bound);
                            bound = new PIXI.Sprite(boundTexture);
                            bound.position.set(pixel * i, (this.state.boundInfo.h - 1) * pixel);
                            downBounds.addChild(bound);
                        }
                        for (let i = 1; i < this.state.boundInfo.h - 1; i++) {
                            let bound = new PIXI.Sprite(boundTexture);
                            bound.position.set(0, pixel * i);
                            leftBounds.addChild(bound);
                            bound = new PIXI.Sprite(boundTexture);
                            bound.position.set((this.state.boundInfo.w - 1) * pixel, pixel * i);
                            rightBounds.addChild(bound);
                        }
                        bounds.addChild(upBounds);
                        bounds.addChild(downBounds);
                        bounds.addChild(leftBounds);
                        bounds.addChild(rightBounds);
                        bounds.position.set(pixel * 3, 0);
                        bounds.zIndex = -2;
                        app.stage.addChild(bounds);

                        //grid
                        const grid = new PIXI.Container();
                        for (let i = 0; i <= 15; i++) {
                            let line = new PIXI.Graphics();
                            line.lineStyle(1, 0xcccccc, 1);
                            line.moveTo(pixel * 3, pixel * i);
                            line.lineTo(stage.w, pixel * i);
                            grid.addChild(line);
                            line.moveTo(pixel * 3, pixel * i - 1);
                            line.lineTo(stage.w, pixel * i - 1);
                            grid.addChild(line);
                        }
                        for (let i = 0; i <= 20; i++) {
                            let line = new PIXI.Graphics();
                            line.lineStyle(1, 0xe5e5e5, 1);
                            line.moveTo(pixel * (i + 3), 0);
                            line.lineTo(pixel * (i + 3), stage.h);
                            grid.addChild(line);
                            line.moveTo(pixel * (i + 3) + 1, 0);
                            line.lineTo(pixel * (i + 3) + 1, stage.h);
                            grid.addChild(line);
                        }
                        grid.zIndex = -1;
                        app.stage.addChild(grid);

                        //arrow
                        const arrows = new PIXI.Container();
                        app.stage.addChild(arrows);
                        arrows.zIndex = 100;
                        const arrowTexture = PIXI.Texture.from('../image/arrow.png');

                        const arrowUp = new PIXI.Sprite(arrowTexture);
                        arrowUp.position.set(pixel * 13, pixel);
                        arrowUp.anchor.set(0.5);
                        arrowUp.rotation = 3.14;
                        arrowUp.interactive = true;
                        arrowUp.cursor = 'pointer';
                        arrowUp.visible = false;
                        arrows.addChild(arrowUp);

                        const arrowDown = new PIXI.Sprite(arrowTexture);
                        arrowDown.position.set(pixel * 13, stage.h - pixel);
                        arrowDown.anchor.set(0.5);
                        arrowDown.interactive = true;
                        arrowDown.cursor = 'pointer';
                        arrowDown.visible = false;
                        arrows.addChild(arrowDown);

                        const arrowLeft = new PIXI.Sprite(arrowTexture);
                        arrowLeft.position.set(pixel * 4, stage.h * 0.5);
                        arrowLeft.anchor.set(0.5);
                        arrowLeft.rotation = 1.57;
                        arrowLeft.interactive = true;
                        arrowLeft.cursor = 'pointer';
                        arrowLeft.visible = false;
                        arrows.addChild(arrowLeft);

                        const arrowRight = new PIXI.Sprite(arrowTexture);
                        arrowRight.position.set(pixel * 22, stage.h * 0.5);
                        arrowRight.anchor.set(0.5);
                        arrowRight.rotation = 4.71;
                        arrowRight.interactive = true;
                        arrowRight.cursor = 'pointer';
                        arrowRight.visible = false;
                        arrows.addChild(arrowRight);

                        if (this.state.boundInfo.w > 20) {
                            arrowRight.visible = true;
                        }
                        if (this.state.boundInfo.h > 15) {
                            arrowDown.visible = true;
                        }

                        //tool
                        const tool = new PIXI.Container();
                        tool.zIndex = 50;
                        app.stage.addChild(tool);

                        //tool box
                        let boxContainer = new PIXI.Graphics();
                        boxContainer.beginFill(0xfff7de);
                        boxContainer.drawRect(0, 0, pixel * 3, stage.h);
                        boxContainer.endFill();
                        tool.addChild(boxContainer);
                        let boxBorder = new PIXI.Graphics();
                        boxBorder.lineStyle(4, 0x000000, 1);
                        boxBorder.moveTo(pixel * 3 - 2, 0);
                        boxBorder.lineTo(pixel * 3 - 2, stage.h);
                        tool.addChild(boxBorder);

                        //chara
                        const charaTexture = PIXI.Texture.from('../image/cha_editor.png');
                        const chara = new PIXI.Sprite(charaTexture);
                        this.setState({
                            chara: chara
                        });
                        const charaTool = new PIXI.Sprite(charaTexture);
                        charaTool.scale.set(1.2);
                        charaTool.position.set(28, pixel);
                        charaTool.interactive = true;
                        charaTool.cursor = 'pointer';
                        tool.addChild(charaTool);

                        //door
                        const doorCloseTexture = PIXI.Texture.from('../image/door_close.png');
                        const door = new PIXI.Sprite(doorCloseTexture);
                        this.setState({
                            door: door
                        });
                        const doorTool = new PIXI.Sprite(doorCloseTexture);
                        doorTool.scale.set(0.8);
                        doorTool.position.set(21, pixel * 3);
                        doorTool.interactive = true;
                        doorTool.cursor = 'pointer';
                        tool.addChild(doorTool);

                        //wall
                        const walls = new PIXI.Container();
                        this.setState({
                            walls: walls
                        });
                        scene.addChild(walls);
                        let wall;
                        const wallTexture = PIXI.Texture.from('../image/wall.jpeg');
                        const wallTool = new PIXI.Sprite(wallTexture);
                        wallTool.scale.set(1.2);
                        wallTool.position.set(27, pixel * 6 - 10);
                        wallTool.interactive = true;
                        wallTool.cursor = 'pointer';
                        tool.addChild(wallTool);

                        //star
                        const stars = new PIXI.Container();
                        this.setState({
                            stars: stars
                        });
                        scene.addChild(stars);
                        let star;
                        const starTexture = PIXI.Texture.from('../image/star.png');
                        const starToolTexture = PIXI.Texture.from('../image/starTool.png');
                        const starTool = new PIXI.Sprite(starToolTexture);
                        starTool.scale.set(0.2);
                        starTool.position.set(20, pixel * 8 - 10);
                        starTool.interactive = true;
                        starTool.cursor = 'pointer';
                        tool.addChild(starTool);

                        //cursor
                        const cursorTexture = PIXI.Texture.from('../image/cursor.png');
                        const cursorTool = new PIXI.Sprite(cursorTexture);
                        cursorTool.scale.set(0.6);
                        cursorTool.position.set(36, pixel * 13 - 13);
                        cursorTool.interactive = true;
                        cursorTool.cursor = 'pointer';
                        tool.addChild(cursorTool);

                        //cross
                        const crossToolTexture = PIXI.Texture.from('../image/closeTool.png');
                        const crossTool = new PIXI.Sprite(crossToolTexture);
                        crossTool.scale.set(0.3);
                        crossTool.position.set(37, pixel * 13 - 10);
                        crossTool.interactive = true;
                        crossTool.cursor = 'pointer';
                        crossTool.visible = false;
                        tool.addChild(crossTool);

                        if (typeof res != 'undefined') {
                            if (res.chara.x > 0) {
                                chara.position.set(res.chara.x, res.chara.y);
                                scene.addChild(chara);
                                charaTool.alpha = 0.5;
                                charaTool.interactive = false;
                                addBuff(chara, 16);
                            }

                            if (res.door.x > 0) {
                                door.position.set(res.door.x, res.door.y);
                                scene.addChild(door);
                                doorTool.alpha = 0.5;
                                doorTool.interactive = false;
                                addBuff(door, 32);
                            }

                            if (res.stars.length != 0) {
                                res.stars.forEach(starInfo => {
                                    const star = new PIXI.Sprite(starTexture);
                                    star.position.set(starInfo.x, starInfo.y);
                                    stars.addChild(star);
                                    addBuff(star, 0);
                                });
                            }
                            if (res.walls.length != 0) {
                                res.walls.forEach(wallInfo => {
                                    for (let i = 0, wallNum = wallInfo.num; i < wallNum; i++) {
                                        wall = new PIXI.Sprite(wallTexture);
                                        wall.position.set(wallInfo.x + pixel * i, wallInfo.y);
                                        walls.addChild(wall);
                                        addBuff(wall, 16);
                                    }
                                });
                            }

                            function addBuff(obj, offset) {
                                if (obj.x > 0 && obj.y > 0) {
                                    obj.x += offset;
                                    obj.y += offset;
                                    obj.zIndex = 0;
                                    obj.parent.zIndex = 0;
                                    app.stage.sortChildren();
                                    onDragGenerate.call(obj, true);
                                }
                            }
                        }


                        //controller
                        let dragTarget = null;
                        let originPos = { x: 0, y: 0 };
                        let originParent = null;
                        const dragLayer = new PIXI.Container();
                        dragLayer.zIndex = 100;
                        dragLayer.x = pixel * 3;
                        app.stage.addChild(dragLayer);
                        let isDrawing = false;
                        let mode = 'draw';

                        app.stage.interactive = true;
                        app.stage.hitArea = app.screen;
                        app.stage.on('pointerup', onDragEnd);
                        app.stage.on('pointerupoutside', onDragEnd);
                        app.stage.on('click', onDrawEnd);
                        app.stage.on('pointerdown', onDrawLotsStart);
                        app.stage.on('pointerup', onDrawLotsEnd);
                        app.stage.on('pointerupoutside', onDrawLotsEnd);

                        charaTool.on('pointerdown', onDragDetect);
                        doorTool.on('pointerdown', onDragDetect);
                        wallTool.on('click', onDrawStart);
                        wallTool.on('pointerdown', onDragDetect);
                        starTool.on('click', onDrawStart);
                        starTool.on('pointerdown', onDragDetect);
                        cursorTool.on('click', onDeleteStart);
                        crossTool.on('click', onDeleteEnd);
                        arrowUp.on('click', onSceneMove);
                        arrowDown.on('click', onSceneMove);
                        arrowLeft.on('click', onSceneMove);
                        arrowRight.on('click', onSceneMove);
                        arrowUp.on('pointerdown', onSceneStart);
                        arrowDown.on('pointerdown', onSceneStart);
                        arrowLeft.on('pointerdown', onSceneStart);
                        arrowRight.on('pointerdown', onSceneStart);

                        //scene move
                        let moveX = 0;
                        let moveY = 0;

                        let world = this;
                        function onSceneMove() {
                            if (this === arrowUp) {
                                bounds.y += pixel;
                                scene.y += pixel;
                                moveY -= 1;
                                arrowDown.visible = true;
                                if (bounds.y === 0) {
                                    arrowUp.visible = false;
                                }
                            }
                            if (this === arrowDown) {
                                bounds.y -= pixel;
                                scene.y -= pixel;
                                moveY += 1;
                                arrowUp.visible = true;
                                if (pixel * (world.state.boundInfo.h - 15) + bounds.y === 0) {
                                    arrowDown.visible = false;
                                }
                            }
                            if (this === arrowLeft) {
                                bounds.x += pixel;
                                scene.x += pixel;
                                moveX -= 1;
                                arrowRight.visible = true;
                                if (bounds.x === pixel * 3) {
                                    arrowLeft.visible = false;
                                }
                            }
                            if (this === arrowRight) {
                                bounds.x -= pixel;
                                scene.x -= pixel;
                                moveX += 1;
                                arrowLeft.visible = true;
                                if (pixel * (world.state.boundInfo.w - 20) + bounds.x === pixel * 3) {
                                    arrowRight.visible = false;
                                }
                            }
                            tool.zIndex = 50;
                            app.stage.sortChildren();
                        }
                        function onSceneStart() {
                            const intervalId = setInterval(() => {
                                if (this.visible) {
                                    onSceneMove.call(this);
                                }
                            }, 100);
                            this.on('pointerup', onSceneEnd, intervalId);
                            this.on('pointerupoutside', onSceneEnd, intervalId);
                        }
                        function onSceneEnd() {
                            clearInterval(this);
                        }

                        //delete
                        function onDeleteMove() {
                            if (mode === 'delete') {
                                if (this === chara) {
                                    chara.position.set(0, 0);
                                    charaTool.interactive = true;
                                    charaTool.alpha = 1;
                                }
                                if (this === door) {
                                    door.position.set(0, 0);
                                    doorTool.interactive = true;
                                    doorTool.alpha = 1;
                                }
                                const parent = this.parent;
                                parent.removeChild(this);
                            }
                        }
                        function onDeleteStart() {
                            cursorTool.visible = false;
                            crossTool.visible = true;
                            app.renderer.events.cursorStyles.default = "url('../image/close.png'),auto";
                            app.renderer.events.cursorStyles.pointer = "url('../image/close.png'),auto";
                            mode = 'delete';
                        }
                        function onDeleteEnd() {
                            crossTool.visible = false;
                            cursorTool.visible = true;
                            app.renderer.events.cursorStyles.default = 'inherit';
                            app.renderer.events.cursorStyles.pointer = 'pointer';
                            mode = 'draw';
                        }

                        //drag
                        function onDragMove(event) {
                            if (dragTarget) {
                                dragTarget.parent.toLocal(event.global, null, dragTarget.position);
                            }
                        }
                        function onDragDetect() {
                            if (mode === 'draw') {
                                if (this === doorTool) {
                                    scene.addChild(door);
                                    doorTool.alpha = 0.5;
                                    doorTool.interactive = false;
                                    onDragGenerate.call(door);
                                }
                                if (this === charaTool) {
                                    scene.addChild(chara);
                                    charaTool.alpha = 0.5;
                                    charaTool.interactive = false;
                                    onDragGenerate.call(chara);
                                }
                                if (this === starTool) {
                                    const star = new PIXI.Sprite(starTexture);
                                    stars.addChild(star);
                                    onDragGenerate.call(star);
                                }
                                if (this === wallTool) {
                                    const wall = new PIXI.Sprite(wallTexture);
                                    walls.addChild(wall);
                                    onDragGenerate.call(wall);
                                }
                            }
                        }
                        function onDragGenerate(dbInit = false) {
                            if (!dbInit) {
                                this.position.set(-pixel);
                            }
                            this.anchor.set(0.5);
                            this.interactive = true;
                            this.cursor = 'pointer';
                            this.on('pointerdown', onDragStart);
                            this.on('click', onDeleteMove);
                            onDragStart.call(this);
                        }
                        function onDragStart() {
                            if (mode === 'draw') {
                                originPos.x = this.x;
                                originPos.y = this.y;
                                this.alpha = 0.5;
                                dragTarget = this;
                                originParent = dragTarget.parent;
                                dragTarget.zIndex = 100;
                                dragLayer.addChild(dragTarget);
                                app.stage.sortChildren();
                                app.stage.on('pointermove', onDragMove);
                            }
                        }
                        function onDragEnd() {
                            if (dragTarget) {
                                app.stage.off('pointermove', onDragMove);
                                dragTarget.zIndex = 0;
                                originParent.addChild(dragTarget);
                                dragTarget.alpha = 1;
                                if (dragTarget.height === pixel) {
                                    const x = Math.round(dragTarget.x / pixel + 0.5);
                                    const y = Math.round(dragTarget.y / pixel + 0.5);
                                    if (x - moveX > 0) {
                                        const canPlace = checkArea(x, y);
                                        if (canPlace) {
                                            dragTarget.x = x * pixel - 16;
                                            dragTarget.y = y * pixel - 16;
                                        } else {
                                            dragTarget.x = originPos.x;
                                            dragTarget.y = originPos.y;
                                            if (originPos.x < 0) {
                                                sendBackAndReset();
                                            }
                                        }
                                    } else {
                                        sendBackAndReset();
                                    }
                                }
                                if (dragTarget.height === pixel * 2) {
                                    const x = Math.round(dragTarget.x / pixel);
                                    const y = Math.round(dragTarget.y / pixel);
                                    scene.addChild(dragTarget);
                                    if (x - moveX >= 0) {
                                        const doorArea = [
                                            { x: x, y: y },
                                            { x: x + 1, y: y },
                                            { x: x, y: y + 1 },
                                            { x: x + 1, y: y + 1 }
                                        ];
                                        let canPlace = true;
                                        doorArea.forEach(door => {
                                            const res = checkArea(door.x, door.y, true);
                                            if (!res) canPlace = false;
                                        });
                                        if (canPlace) {
                                            dragTarget.x = x * pixel;
                                            dragTarget.y = y * pixel;
                                        } else {
                                            dragTarget.x = originPos.x;
                                            dragTarget.y = originPos.y;
                                            if (originPos.x < 0) {
                                                sendBackAndReset();
                                            }
                                        }
                                    } else {
                                        sendBackAndReset();
                                    }
                                }
                                dragTarget = null;
                            }
                        }

                        function sendBackAndReset() {
                            if (dragTarget === door) {
                                doorTool.interactive = true;
                                doorTool.alpha = 1;
                            }
                            if (dragTarget === chara) {
                                charaTool.interactive = true;
                                charaTool.alpha = 1;
                            }
                            const parent = dragTarget.parent;
                            parent.removeChild(dragTarget);
                        }

                        function checkArea(x, y, isDoor = false) {
                            let hasObjArea = [];
                            bounds.children.forEach(boundGroup => {
                                boundGroup.children.forEach(bound => {
                                    hasObjArea.push({
                                        x: bound.x / pixel + 1,
                                        y: bound.y / pixel + 1
                                    });
                                });
                            });
                            walls.children.forEach(wall => {
                                hasObjArea.push({
                                    x: wall.x / pixel + 0.5,
                                    y: wall.y / pixel + 0.5
                                });
                            });
                            stars.children.forEach(star => {
                                hasObjArea.push({
                                    x: star.x / pixel + 0.5,
                                    y: star.y / pixel + 0.5
                                });
                            });
                            if (typeof chara != "undefined") {
                                hasObjArea.push({
                                    x: chara.x / pixel + 0.5,
                                    y: chara.y / pixel + 0.5,
                                });
                            }
                            if (typeof door != "undefined" && !isDoor) {
                                hasObjArea.push(
                                    { x: door.x / pixel, y: door.y / pixel },
                                    { x: door.x / pixel + 1, y: door.y / pixel },
                                    { x: door.x / pixel, y: door.y / pixel + 1 },
                                    { x: door.x / pixel + 1, y: door.y / pixel + 1 }
                                );
                            }
                            for (const obj of hasObjArea) {
                                if (x == obj.x && y == obj.y)
                                    return false;
                            }
                            return true;
                        }

                        //click
                        let drawTarget = null;
                        let starCursor;
                        let wallCursor;
                        function onDrawMove(e) {
                            this.position.copyFrom({ x: e.global.x - 16, y: e.global.y - 16 });
                        }
                        function onDrawStart() {
                            if (mode === 'draw') {
                                if (this === starTool) {
                                    starCursor = new PIXI.Sprite(starTexture);
                                    drawTarget = starCursor;
                                }
                                if (this === wallTool) {
                                    wallCursor = new PIXI.Sprite(wallTexture);
                                    drawTarget = wallCursor;
                                }
                                this.alpha = 0.5;
                                drawTarget.zIndex = 100;
                                drawTarget.position.set(-pixel);
                                app.stage.addChild(drawTarget);
                                drawTarget.alpha = 0.8;
                                app.stage.on('pointermove', onDrawMove, drawTarget);
                            }
                        }
                        function onDrawEnd() {
                            if (drawTarget != null) {
                                if (!isDrawing) {
                                    isDrawing = true;
                                }
                                else if (isDrawing) {
                                    const x = Math.round(drawTarget.x / pixel - 3) + moveX;
                                    const y = Math.round(drawTarget.y / pixel) + moveY;
                                    if (x - moveX >= 0) {
                                        const canPlace = checkArea(x + 1, y + 1);
                                        if (canPlace) {
                                            if (drawTarget === starCursor) {
                                                star = new PIXI.Sprite(starTexture);
                                                star.x = (x + 0.5) * pixel;
                                                star.y = (y + 0.5) * pixel;
                                                stars.addChild(star);
                                                onDrawGenerate.call(star);
                                            }
                                            if (drawTarget === wallCursor) {
                                                const wall = new PIXI.Sprite(wallTexture);
                                                wall.x = (x + 0.5) * pixel;
                                                wall.y = (y + 0.5) * pixel;
                                                walls.addChild(wall);
                                                onDrawGenerate.call(wall);
                                            }
                                        }
                                    } else {
                                        starTool.alpha = 1;
                                        wallTool.alpha = 1;
                                        app.stage.removeChild(drawTarget);
                                        drawTarget = null;
                                        isDrawing = false;
                                        app.stage.off('pointermove', onDrawMove);
                                    }
                                }
                            }
                        }
                        function onDrawGenerate() {
                            this.anchor.set(0.5);
                            this.interactive = true;
                            this.cursor = 'pointer';
                            this.on('pointerdown', onDragStart);
                            this.on('click', onDeleteMove);
                        }


                        function onDrawLotsStart() {
                            if (isDrawing && mode === "draw") {
                                app.stage.on('pointermove', onDrawEnd);
                            }
                            if (mode === "delete") {
                                app.stage.on('pointermove', onDeleteLotsMove);
                            }
                        }
                        function onDrawLotsEnd() {
                            app.stage.off('pointermove', onDrawEnd);
                            app.stage.off('pointermove', onDeleteLotsMove);
                        }

                        function onDeleteLotsMove(cursor) {
                            const x = Math.round(cursor.global.x / pixel + 0.5) - 3 + moveX;
                            const y = Math.round(cursor.global.y / pixel + 0.5) + moveY;
                            if (x - moveX > 0) {
                                walls.children.forEach(wall => {
                                    const wallX = wall.x / pixel;
                                    const wallY = wall.y / pixel;
                                    if (wallX >= x - 1 && wallX < x &&
                                        wallY >= y - 1 && wallY < y) {
                                        walls.removeChild(wall);
                                    }
                                });
                                stars.children.forEach(star => {
                                    const starX = star.x / pixel;
                                    const starY = star.y / pixel;
                                    if (starX >= x - 1 && starX < x &&
                                        starY >= y - 1 && starY < y) {
                                        stars.removeChild(star);
                                    }
                                });
                                if (typeof chara != "undefined" &&
                                    chara.x >= x * pixel - pixel && chara.x < x * pixel &&
                                    chara.y >= y * pixel - pixel && chara.y < y * pixel) {
                                    chara.position.set(0, 0);
                                    scene.removeChild(chara);
                                    charaTool.interactive = true;
                                    charaTool.alpha = 1;
                                }
                                if (typeof door != "undefined" &&
                                    door.x >= x * pixel - pixel && door.x <= x * pixel &&
                                    door.y >= y * pixel - pixel && door.y <= y * pixel) {
                                    door.position.set(0, 0);
                                    scene.removeChild(door);
                                    doorTool.interactive = true;
                                    doorTool.alpha = 1;
                                }
                            }
                        }
                        this.setState(state => ({
                            items: state.items.concat(state.boundInfo, state.stars, state.walls, state.chara, state.door)
                        }));
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            location.href = "/";
        }
    }

    componentWillUnmount() {
        document.getElementById("editor-window").remove();
    }

    handlePlay() {
        console.log("test");
    }

    handleStarChange(e) {
        if (e.target.value < this.state.stars.children.length) {
            this.setState({ starMinNum: e.target.value });
        } else {
            this.setState({ starMinNum: this.state.stars.children.length });
        }
    }
    handleMapWChange(e) {
        this.setState({
            boundInfo: {
                w: e.target.value
            }
        });
    }
    handleMapHChange(e) {
        this.setState({
            boundInfo: {
                h: e.target.value
            }
        });
    }

    render() {
        return (
            <div className='container-edit'>
                <div className='container'>
                    <div id="editor-window">
                        <div id="save-hint" style={{ display: 'none' }}>Saved</div>
                    </div>
                    <div className='container-btn-group'>
                        <SaveBtn user={this.props.user} items={this.state.items} btn={"play"} play={this.handlePlay} />
                        <SaveBtn user={this.props.user} items={this.state.items} btn={"save"} play={this.handlePlay} />
                    </div>
                </div>
                <EditPanel
                    map={this.state.boundInfo}
                    // handleMapWChange={this.handleMapWChange}
                    // handleMapHChange={this.handleMapHChange}
                    star={this.state.starMinNum}
                    starNum={this.state.stars}
                    handleStarChange={this.handleStarChange}
                />
            </div>
        )
    }
}

export default EditorPage;