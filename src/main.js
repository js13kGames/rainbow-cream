import { GameVars, toPixelSize } from "./game-variables";
import { createElem } from "./utilities/elem-utilities";
import { Game } from "./game";
import { genSmallBox } from "./utilities/box-generator";
import { drawPixelTextInCanvas } from "./utilities/text";
import { drawSprite, createPixelLine } from "./utilities/draw-utilities";
import { Sound } from "./sound/sound";
import { SpeakerSprite, AudioSprite } from "./sprites/sound-sprites";

let mainDiv;

let gameDiv;
let gameBoardDiv;

let game;

let secondsPassed;
let oldTimeStamp = 0;

const init = () => {
    GameVars.updatePixelSize(window.innerWidth, window.innerHeight);

    mainDiv = document.getElementById("main");

    gameDiv = createElem(mainDiv, "div", "game");
    gameBoardDiv = createElem(gameDiv, "div", "board-div");

    game = new Game(gameBoardDiv);
    game.init();

    initHandlers();
    window.requestAnimationFrame(() => gameLoop());
}

const initHandlers = () => {
    gameBoardDiv.onmousemove = (e) => game.mov(e.pageX, e.pageY);
    gameBoardDiv.onmousedown = (e) => game.click(e.clientX, e.clientY);
    gameBoardDiv.ontouchstart = (e) => game.click(e.touches[0].clientX, e.touches[0].clientY);
}

const gameLoop = (timeStamp) => {
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    GameVars.deltaTime = Math.min(secondsPassed, 0.1);

    if (GameVars.deltaTime) {
        game.update();
        game.draw();
    }

    window.requestAnimationFrame(gameLoop);
}

init();