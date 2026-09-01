import { Point } from "./entities/point";

const tileSize = 16;

const gameBoardSize = 16;

const updatePixelSize = (width, height) => {
    GameVars.lastGameW = GameVars.gameW;
    GameVars.lastGameH = GameVars.gameH;

    GameVars.gameW = width;
    GameVars.gameH = height;

    GameVars.pixelSize = pixelCal(2, 4);
    GameVars.boardPixelSize = GameVars.pixelSize;

    GameVars.gameWdAsPixels = width / GameVars.pixelSize;
    GameVars.gameHgAsPixels = height / GameVars.pixelSize;
}

const pixelCal = (min, max) => {
    let hgPixelSize = Math.round((GameVars.gameH - 270) * ((max - min) / (1100 - 270)) + min);
    let wdPixelSize = Math.round((GameVars.gameW - 480) * ((max - min) / (1000 - 480)) + min);
    let pixelSize = hgPixelSize < wdPixelSize ? hgPixelSize : wdPixelSize;
    return pixelSize >= 1 ? pixelSize : 1;
};

let isMobile;

let sound;
let game;
let deltaTime;

let playerMoney;

let lastGameW;
let lastGameH;

let gameW;
let gameH;

let pixelSize;
let boardPixelSize;

let gameWdAsPixels;
let gameHgAsPixels;

export const GameVars = {
    isMobile,

    sound,
    game,
    deltaTime,

    playerMoney,

    lastGameW,
    lastGameH,

    gameW,
    gameH,

    pixelSize,
    boardPixelSize,
    gameWdAsPixels,
    gameHgAsPixels,

    tileSize,

    gameBoardSize,

    updatePixelSize,
}

export const toPixelSize = (value) => {
    return value * GameVars.pixelSize;
}

export const removePixelSize = (value) => {
    return value / GameVars.pixelSize;
}

export const toBoardPixelSize = (value) => {
    return value * GameVars.boardPixelSize;
}

export const removeBoardPixelSize = (value) => {
    return value / GameVars.boardPixelSize;
}