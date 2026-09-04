import { GameVars, toBoardPixelSize, toPixelSize } from "./game-variables";
import { createElem, setElemSize } from "./utilities/elem-utilities";
import { Game } from "./game";
import { genSmallBox } from "./utilities/box-generator";
import { drawPixelTextInCanvas } from "./utilities/text";
import { drawSprite, createPixelLine, drawBalcony, drawBalconyOnPos, drawWallOnPos } from "./utilities/draw-utilities";
import { Sound } from "./sound/sound";
import { SpeakerSprite, AudioSprite } from "./sprites/sound-sprites";
import { Character, CharacterColor, ConeWithStep3, Unicorn } from "./sprites/tile-sprites";
import { ColorType, getDarkColorByType, getLightColorByType } from "./enum/color-type";
import { randomNumb } from "./utilities/general-utilities";

let mainDiv;

let mainMenuDiv;
let mainMenuCanv;
let mainMenuBtn;

let gameDiv;

let gameOverDiv;
let gameOverCanv;
let isShowingFinishMenu;
let timeoutID;

let soundBtnCanv;
let lastSoundState;

let game;

let secondsPassed;
let oldTimeStamp = 0;

const init = () => {
    GameVars.updatePixelSize(window.innerWidth, window.innerHeight);

    createMainMenu();

    game = new Game();

    addEventListeners();
    window.requestAnimationFrame(() => gameLoop());
}

const addEventListeners = () => {
    document.onclick = (e) => initAudio();
    document.ontouchstart = (e) => initAudio();

    window.addEventListener("resize", () => {
        GameVars.updatePixelSize(window.innerWidth, window.innerHeight);
        game.resize();
        drawMenus();
        drawSoundBtn(true);
    });
}

const initAudio = () => {
    if (!GameVars.sound) {
        GameVars.sound = new Sound();
        GameVars.sound.initSound();
    }
}

const createMainMenu = () => {
    mainDiv = document.getElementById("main");

    gameDiv = createElem(mainDiv, "div", "game");

    mainMenuDiv = createElem(mainDiv, "div", "main-menu");
    mainMenuCanv = createElem(mainMenuDiv, "canvas");

    mainMenuBtn = createElem(mainMenuDiv, "canvas", null, null, null, null, null, startGame);

    soundBtnCanv = createElem(mainDiv, "canvas", null, null, null, null, null, null, toogleSound);

    gameOverDiv = createElem(mainDiv, "div", null, ["hidden"]);
    gameOverCanv = createElem(gameOverDiv, "canvas");

    drawMenus();
    drawSoundBtn(true);
}

const startGame = () => {
    initAudio();
    GameVars.sound.clickSound();
    mainMenuDiv.classList.add("hidden");

    const gameBoardDiv = createElem(gameDiv, "div", "board-div")
    gameBoardDiv.onmousemove = (e) => game.mov(e.pageX, e.pageY);
    gameBoardDiv.onmousedown = (e) => game.click(e.clientX, e.clientY);
    gameBoardDiv.ontouchstart = (e) => game.click(e.touches[0].clientX, e.touches[0].clientY);

    game.init(gameBoardDiv);
}

const toogleSound = () => {
    initAudio();
    GameVars.sound?.muteMusic();
}

const drawMenus = () => {
    drawMainMenu();
    drawGameOverMenu();
    createMainBtnStartBtn();
}

const drawMainMenu = () => {
    setElemSize(mainMenuCanv, GameVars.gameW, GameVars.gameH);
    const mainMenuCtx = mainMenuCanv.getContext("2d");

    const floorPosY = Math.round(GameVars.gameH / 2) - toPixelSize(7 * 3);
    const halfW = Math.round(GameVars.gameW / 2);
    const halfH = Math.round(GameVars.gameH / 2);

    mainMenuCtx.fillStyle = "#395a36";
    mainMenuCtx.fillRect(0, 0, GameVars.gameW, floorPosY);
    mainMenuCtx.fillStyle = "#474747";
    mainMenuCtx.fillRect(0, floorPosY, GameVars.gameW, GameVars.gameH - floorPosY);

    const gridBaseX = halfW - toPixelSize(24) + toPixelSize(3);
    const gridBaseY = halfH - toPixelSize(69) + toPixelSize(3);

    for (let y = -10; y <= 10; y++) {
        const yPos = gridBaseY + toPixelSize(y * 48);
        mainMenuCtx.fillStyle = yPos > floorPosY ? "#515151" : "#41663d";

        for (let x = -10; x <= 10; x++) {
            mainMenuCtx.fillRect(
                gridBaseX + toPixelSize(x * 48),
                yPos,
                toPixelSize(42),
                toPixelSize(42)
            );
        }
    }

    const wallColY = Math.round(GameVars.gameHgAsPixels / 2) - 117;
    const wallRowY = Math.round(GameVars.gameHgAsPixels / 2) - 69;
    const balconyY = Math.round(GameVars.gameHgAsPixels / 2) - 21;
    const centerXTiles = Math.round(GameVars.gameWdAsPixels / 2) - 24;

    for (let x = -2; x <= 2; x++) {
        const xPos = centerXTiles + (x * 48);
        drawWallOnPos(mainMenuCtx, 3, xPos, wallColY, toPixelSize(48), toPixelSize(48), "#cd9722", "#e0ba50");
        drawWallOnPos(mainMenuCtx, 3, xPos, wallRowY, toPixelSize(48), toPixelSize(48), "#641f14", "#865433");
        drawBalconyOnPos(mainMenuCtx, 3, xPos, balconyY, toPixelSize(48), toPixelSize(48));
    }

    const unicornCenterX = Math.round(GameVars.gameW / 2 / toPixelSize(3));
    const unicornCenterY = Math.round(GameVars.gameH / 2 / toPixelSize(3)) - 3;

    drawSprite(mainMenuCtx, Unicorn, toPixelSize(3), unicornCenterX - 24, unicornCenterY - 20, { "lc": getLightColorByType(ColorType.BLUE), "dc": getDarkColorByType(ColorType.BLUE) });
    drawSprite(mainMenuCtx, Unicorn, toPixelSize(3), unicornCenterX - 8, unicornCenterY - 20, { "lc": getLightColorByType(ColorType.YELLOW), "dc": getDarkColorByType(ColorType.YELLOW) });
    drawSprite(mainMenuCtx, Unicorn, toPixelSize(3), unicornCenterX + 8, unicornCenterY - 20, { "lc": getLightColorByType(ColorType.RED), "dc": getDarkColorByType(ColorType.RED) });

    const charPosX = Math.round(GameVars.gameW / 2 / toPixelSize(4)) + 3;
    const charPosY = Math.round(GameVars.gameH / 2 / toPixelSize(4)) + 4;

    genSmallBox(mainMenuCtx, charPosX - 11, charPosY + 9, 11, 7, toBoardPixelSize(4), "#00000066", "#00000066");
    drawSprite(mainMenuCtx, Character, toPixelSize(4), charPosX - 10, charPosY - 8, { "cc": CharacterColor[randomNumb(CharacterColor.length)] });
    drawSprite(mainMenuCtx, ConeWithStep3, toPixelSize(4), charPosX - 4, charPosY - 3, {
        "lc1": getLightColorByType(ColorType.BLUE), "dc1": getDarkColorByType(ColorType.BLUE),
        "lc2": getLightColorByType(ColorType.YELLOW), "dc2": getDarkColorByType(ColorType.YELLOW),
        "lc3": getLightColorByType(ColorType.RED), "dc3": getDarkColorByType(ColorType.RED)
    });

    const bannerCenterX = Math.round(GameVars.gameW / 2 / toPixelSize(3));
    genSmallBox(mainMenuCtx, -1, -1, GameVars.gameWdAsPixels + 2, 16, toPixelSize(2), "#9bf2fa", "#1b1116");
    drawPixelTextInCanvas("rain", mainMenuCtx, toPixelSize(3), bannerCenterX - 17, 5, getLightColorByType(ColorType.BLUE), 1);
    drawPixelTextInCanvas("bow c", mainMenuCtx, toPixelSize(3), bannerCenterX, 5, getLightColorByType(ColorType.YELLOW), 1);
    drawPixelTextInCanvas("ream", mainMenuCtx, toPixelSize(3), bannerCenterX + 19, 5, getLightColorByType(ColorType.RED), 1);

    genSmallBox(mainMenuCtx, -1, GameVars.gameHgAsPixels - 16, GameVars.gameWdAsPixels + 1, 16, toPixelSize(1), "#9bf2fa", "#1b1116");
    drawPixelTextInCanvas("js13kgames 2026 - igor estevao", mainMenuCtx, toPixelSize(1), GameVars.gameWdAsPixels / 2, GameVars.gameHgAsPixels - 8, "#00bcd4", 1);
}

const createMainBtnStartBtn = () => {
    setElemSize(mainMenuBtn, toPixelSize(112), toPixelSize(32));
    mainMenuBtn.style.translate = ((GameVars.gameW / 2) - (mainMenuBtn.width / 2)) + 'px ' + ((GameVars.gameH / 4) * 3) + 'px';

    const mainMenuBtnCtx = mainMenuBtn.getContext("2d");
    genSmallBox(mainMenuBtnCtx, 0, 0, 110, 30, toPixelSize(1), "#9bf2fa", "#1b1116");
    drawPixelTextInCanvas("start game", mainMenuBtnCtx, toPixelSize(1), 56, 16, "#9bf2fa", 2);
}

const drawGameOverMenu = () => {
    setElemSize(gameOverCanv, GameVars.gameW, GameVars.gameH);
    const gameOverCtx = gameOverCanv.getContext("2d");
    gameOverCtx.clearRect(0, 0, gameOverCanv.width, gameOverCanv.height);
    gameOverCtx.fillStyle = "#452228dd";
    gameOverCtx.fillRect(0, 0, gameOverCanv.width, gameOverCanv.height);
    drawPixelTextInCanvas("game over", gameOverCtx, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) - 10, "#9bf2fa", 3);

    if (game) {
        if (game.playerMoney == 0) {
            drawPixelTextInCanvas("run out of funds $0 ", gameOverCtx, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) + 10, "#9bf2fa", 1);
        } else if (game.reputation == 0) {
            drawPixelTextInCanvas("run out of reputation", gameOverCtx, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) + 10, "#9bf2fa", 1);
        }
    }
}

const drawSoundBtn = (force) => {
    let isSoundOn = GameVars.sound && GameVars.sound.isSoundOn;
    if (force || lastSoundState !== isSoundOn) {
        lastSoundState = isSoundOn;
        const speakerBtnCtx = soundBtnCanv.getContext("2d");

        setElemSize(soundBtnCanv, toPixelSize(18), toPixelSize(12));
        soundBtnCanv.style.translate = toPixelSize(8) + 'px ' + (GameVars.gameH - soundBtnCanv.height - toPixelSize(8)) + 'px';

        speakerBtnCtx.clearRect(0, 0, soundBtnCanv.width, soundBtnCanv.height);
        genSmallBox(speakerBtnCtx, 0, 0, 17, 11, toPixelSize(1), "#9bf2fa", "#1b1116");
        drawSprite(speakerBtnCtx, SpeakerSprite, toPixelSize(1), 3, 3);
        isSoundOn && drawSprite(speakerBtnCtx, AudioSprite, toPixelSize(1), 9, 1);
    }
}

const gameLoop = (timeStamp) => {
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    GameVars.deltaTime = Math.min(secondsPassed, 0.1);

    if (GameVars.deltaTime && !game.isGameOver) {
        game.update();
        game.draw();
        handleGameOverScreen();
    }
    drawSoundBtn();
    window.requestAnimationFrame(gameLoop);
}

const handleGameOverScreen = () => {
    if (game.isGameOver && !isShowingFinishMenu) {
        isShowingFinishMenu = true;
        gameOverDiv.classList.remove("hidden");
        drawGameOverMenu();
        timeoutID = setTimeout(() => {
            isShowingFinishMenu = false;
            mainMenuDiv.classList.remove("hidden");
            gameOverDiv.classList.add("hidden");
            gameDiv.innerHTML = "";
            clearTimeout(timeoutID);
        }, 3000)
    }
}

init();