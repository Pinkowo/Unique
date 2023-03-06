export const tutorial = (step, tutorialGroup, stage, onClick) => {
    let msg;
    switch (step) {
        case 1:
            msg = "Drag the object and put it on the board.";
            tutorialMask(tutorialGroup, stage, [46, 48, 30], [100, 30, 80], [95, 40], [130, 50], msg, onClick);
            break;
        case 2:
            msg = "Click the object.";
            tutorialMask(tutorialGroup, stage, [46, 200, 30], [100, 160, 60], [95, 190], [130, 180], msg, onClick);
            break;
        case 3:
            msg = "Click the board or keep pressing and move cursor to draw lots of objects.";
            tutorialMask(tutorialGroup, stage, [320, 240, 200], [520, 300, 130], [515, 330], [550, 325], msg, onClick);
            break;
        case 4:
            msg = "Click toolbox again to return the object.";
            tutorialMask(tutorialGroup, stage, [46, 200, 30], [100, 160, 80], [95, 190], [130, 180], msg, onClick);
            break;
        case 5:
            msg = "Click the cursor icon to switch to delete mode.";
            tutorialMask(tutorialGroup, stage, [46, 415, 30], [100, 350, 100], [95, 400], [125, 370], msg, onClick);
            break;
        case 6:
            msg = "Click the cross icon to switch to draw mode.";
            tutorialMask(tutorialGroup, stage, [46, 415, 30], [100, 350, 100], [95, 400], [125, 370], msg, onClick);
            break;
        case 7:
            msg = "Congratulations! You are ready to create your own game! Remember to SAVE the game before publishing it.";
            tutorialMask7(tutorialGroup, stage, msg, onClick);
            break;
    }
}
const tutorialMask7 =
    (tutorialGroup, stage, msg, onClick) => {
        const mask = new PIXI.Graphics();
        mask.beginFill(0x000000);
        mask.drawRect(0, 0, 736, 480);
        mask.endFill();
        mask.alpha = 0.5;
        mask.zIndex = 101;
        tutorialGroup.addChild(mask);

        let rectangle = new PIXI.Graphics();
        rectangle.beginFill(0xFFFFFF);
        rectangle.drawRoundedRect(200, 150, 350, 150, 10);
        rectangle.endFill();
        rectangle.alpha = 0.8;
        rectangle.zIndex = 102;
        tutorialGroup.addChild(rectangle);

        let style = new PIXI.TextStyle({
            fontFamily: "Cubic",
            fontSize: 18,
            fontWeight: 700,
            fill: "#343434",
            wordWrap: true,
            wordWrapWidth: 250
        });
        let message = new PIXI.Text(msg, style);
        message.position.set(255, 180);
        message.zIndex = 103;
        tutorialGroup.addChild(message);
        stage.addChild(tutorialGroup);

        function handleClick() {
            onClick(tutorialGroup);
        }

        skipButton(handleClick, tutorialGroup, 'Finish', -120, 260);
    }


const tutorialMask =
    (tutorialGroup, stage, circle, rect, trian, text, msg, onClick) => {
        const mask = new PIXI.Graphics();
        mask.beginFill(0x000000);
        mask.drawRect(0, 0, 736, 480);
        mask.beginHole();
        mask.drawCircle(circle[0], circle[1], circle[2]);
        mask.endHole();
        mask.endFill();
        mask.alpha = 0.5;
        mask.zIndex = 101;
        tutorialGroup.addChild(mask);

        let rectangle = new PIXI.Graphics();
        rectangle.beginFill(0xFFFFFF);
        rectangle.drawRoundedRect(rect[0], rect[1], 200, rect[2], 10);
        rectangle.endFill();
        rectangle.alpha = 0.8;
        rectangle.zIndex = 102;
        tutorialGroup.addChild(rectangle);

        let triangle = new PIXI.Graphics();
        triangle.beginFill(0xFFFFFF);
        triangle.drawPolygon([
            -5, 10,
            5, 5,
            5, 15
        ]);
        triangle.endFill();
        triangle.position.set(trian[0], trian[1]);
        triangle.alpha = 0.8;
        triangle.zIndex = 102;
        tutorialGroup.addChild(triangle);

        let style = new PIXI.TextStyle({
            fontFamily: "Cubic",
            fontSize: 16,
            fontWeight: 700,
            fill: "#343434",
            wordWrap: true,
            wordWrapWidth: 150
        });
        let message = new PIXI.Text(msg, style);
        message.position.set(text[0], text[1]);
        message.zIndex = 103;
        tutorialGroup.addChild(message);
        stage.addChild(tutorialGroup);

        function handleClick() {
            onClick(tutorialGroup);
        }

        skipButton(handleClick, tutorialGroup, 'Skip >');
    }

const skipButton = (onClick, tutorialGroup, text, posX = 0, posY = 0) => {
    const button = new PIXI.Container();
    let buttonBg = new PIXI.Graphics();
    buttonBg.beginFill(0xFFFFFF);
    buttonBg.drawRoundedRect(600, 50, 80, 40, 20);
    buttonBg.endFill();
    button.addChild(buttonBg);

    let style = new PIXI.TextStyle({
        fontFamily: "Cubic",
        fontSize: 16,
        fontWeight: 700,
        fill: "#343434",
        wordWrap: true,
        wordWrapWidth: 150
    });
    let buttonText = new PIXI.Text(text, style);
    buttonText.position.set(620, 60);
    button.addChild(buttonText);

    button.interactive = true;
    button.cursor = 'pointer';
    button.zIndex = 102;
    button.on('click', onClick);
    button.position.set(posX, posY);

    tutorialGroup.addChild(button);
}

export const tutorialMaskClose = (tutorialGroup, stage) => {
    stage.removeChild(tutorialGroup);
}