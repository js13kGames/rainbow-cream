import { TileType } from "../enum/tile-type";
import { GameVars, removeBoardPixelSize, toBoardPixelSize, toPixelSize } from "../game-variables";
import { Bin, Cashier, Character, Cone, ConeMachine, ConeWithStep1, ConeWithStep2, ConeWithStep3, Unicorn } from "../sprites/tile-sprites";
import { createPixelLine, drawSprite } from "../utilities/draw-utilities";
import { createElem, setElemSize } from "../utilities/elem-utilities";
import { generateTile } from "../utilities/tile-factory";
import { Grass } from "./tiles/grass";

export class Board {
    constructor(gameDiv) {
        this.gameDiv = gameDiv;
        this.levelWalls = [];
        this.x = 0;
        this.y = 0;

        this.lastPixelSize = toBoardPixelSize(1);

        this.createBackground();

        this.boardShadowCanvas = createElem(this.gameDiv, "canvas", "board-shadow");
        this.boardShadowCtx = this.boardShadowCanvas.getContext("2d");
        this.drawGameBoardShadow();

        this.boardCanvas = createElem(this.gameDiv, "canvas", "board", [], null, null, GameVars.isMobile);
        this.boardCtx = this.boardCanvas.getContext("2d");
        this.setGameBoardCanvas();

        this.boardTiles = this.createGameBoardTiles();

        this.initBasicGameComponents();

        this.resetBoardPos();
        this.dragElement(this);

        this.selectedCharacter = null;
    }

    createBackground() {
        this.backgroundCanvas = createElem(this.gameDiv, "canvas", "board-background", null,
            toBoardPixelSize(GameVars.gameWdAsPixels), toBoardPixelSize(GameVars.gameHgAsPixels), GameVars.isMobile, "#2f492c");
        const lines = [];
        for (let i = 0; i < GameVars.gameHgAsPixels / 12; i++) {
            createPixelLine(0, 16 * i + 2, GameVars.gameWdAsPixels, 16 * i + 2, "#21341f", toBoardPixelSize(1), lines);
        }
        const ctx = this.backgroundCanvas.getContext("2d");
        lines.forEach(line => line.draw(ctx));
    }

    drawGameBoardShadow() {
        const width = toBoardPixelSize(GameVars.tileSize * (GameVars.gameBoardSize - 1));
        const height = toBoardPixelSize(GameVars.tileSize * (GameVars.gameBoardSize - 1));
        setElemSize(this.boardShadowCanvas, width, height);
        this.boardShadowCtx.fillStyle = "#00000070";
        this.boardShadowCtx.fillRect(0, 0, width, height);

    }

    setGameBoardCanvas() {
        setElemSize(this.boardCanvas,
            toBoardPixelSize(GameVars.tileSize * GameVars.gameBoardSize),
            toBoardPixelSize((GameVars.tileSize / 2) + (GameVars.tileSize * GameVars.gameBoardSize))
        );
    }

    createGameBoardTiles() {
        const boardTiles = [];
        for (let y = 0; y < GameVars.gameBoardSize - 2; y++) {
            boardTiles.push([]);
            for (let x = 0; x < GameVars.gameBoardSize - 2; x++) {
                boardTiles[y].push(generateTile(x + 1, y + 1, TileType.GRASS, this.boardCtx));
            }
        }
        return boardTiles;
    }

    initBasicGameComponents() {
        const startY = (this.boardTiles.length / 2) - 4;
        const startX = (this.boardTiles[0].length / 2) - 3;
        for (let y = startY; y < this.boardTiles.length; y++) {
            for (let x = startX; x <= startX + 5; x++) {
                if (y == startY || (y < startY + 6 && (x == startX || x == startX + 5))) {
                    this.boardTiles[y][x] = generateTile(x + 1, y + 1, TileType.WALL, this.boardCtx);
                } else if (y == startY + 1 && x == startX + 1) {
                    this.boardTiles[y][x] = generateTile(x + 1, y + 1, TileType.CONE_MACHINE, this.boardCtx);
                } else if (y == startY + 1 && x == startX + 2) {
                    this.boardTiles[y][x] = generateTile(x + 1, y + 1, TileType.ICE_CREAM_MACHINE, this.boardCtx);
                    this.boardTiles[y][x].setCreamColor("#00bcd4", "#10495e");
                } else if (y == startY + 1 && x == startX + 3) {
                    this.boardTiles[y][x] = generateTile(x + 1, y + 1, TileType.ICE_CREAM_MACHINE, this.boardCtx);
                    this.boardTiles[y][x].setCreamColor("#ffff57", "#cd9722");
                } else if (y == startY + 1 && x == startX + 4) {
                    this.boardTiles[y][x] = generateTile(x + 1, y + 1, TileType.ICE_CREAM_MACHINE, this.boardCtx);
                    this.boardTiles[y][x].setCreamColor("#a80000", "#641f14");
                } else if (y == startY + 3 && x == startX + 4) {
                    this.boardTiles[y][x] = generateTile(x + 1, y + 1, TileType.BIN, this.boardCtx);
                } else if (y == startY + 5 && x == startX + 1) {
                    this.boardTiles[y][x] = generateTile(x + 1, y + 1, TileType.CASHIER, this.boardCtx);
                } else if (y == startY + 5 && x >= startX + 2 && x <= startX + 4) {
                    this.boardTiles[y][x] = generateTile(x + 1, y + 1, TileType.BALCONY, this.boardCtx);
                } else {
                    this.boardTiles[y][x] = generateTile(x + 1, y + 1, TileType.FLOOR, this.boardCtx);
                }
            }
        }
    }

    resetBoardPos() {
        this.updateBoardPos((GameVars.gameW - this.boardCanvas.width) / 2, (GameVars.gameH - this.boardCanvas.height) / 2);
    }

    updateBoardPos(x, y) {
        this.boardTiles.forEach(row => row.forEach(tile => tile.updatePos(this.x ? x - this.x : x, this.y ? y - this.y : y)));
        this.x = x;
        this.y = y;
        this.boardCanvas.style.translate = x + 'px ' + y + 'px';
        this.boardShadowCanvas.style.translate = (x + toBoardPixelSize(GameVars.tileSize / 2)) + 'px ' + (y + toBoardPixelSize(GameVars.tileSize * 4 / 3)) + 'px';
    }

    click(x, y, isPaused) {
        this.boardTiles.forEach(row => row.forEach(tile => tile.click(x, y)));
    }

    update(x, y) {
        this.boardTiles.forEach(row => row.forEach(tile => tile.update(x, y)));
    }

    updateZoom() {
        const xDiff = this.x - (GameVars.gameW - this.boardCanvas.width) / 2;
        const yDiff = this.y - (GameVars.gameH - this.boardCanvas.height) / 2;
        this.updateBoardPos(0, 0);
        this.drawGameBoardShadow();
        this.setGameBoardCanvas();
        this.boardTiles.forEach(tileRow => tileRow.forEach(tile => tile.updateZoom()));
        this.resetBoardPos();
        this.updateBoardPos(this.x + this.retrieveNewDiff(xDiff), this.y + this.retrieveNewDiff(yDiff));
        this.lastPixelSize = toBoardPixelSize(1);
    }

    retrieveNewDiff(value) {
        return value * toBoardPixelSize(1) / this.lastPixelSize;
    }

    draw() {
        this.boardCtx.clearRect(0, 0, this.boardCanvas.width, this.boardCanvas.height);
        for (let y = 0; y < this.boardTiles.length; y++) {
            for (let x = 0; x < this.boardTiles[0].length; x++) {
                this.boardTiles[y][x].drawBack();
                this.boardTiles[y][x].drawMiddle();
            }
        }
    }

    dragElement(board) {
        let clientX = 0, clientY = 0;
        let newX = 0, newY = 0, startX = 0, startY = 0;

        board.boardCanvas.onmousedown = dragMouseDown;
        board.boardCanvas.ontouchstart = dragMouseDown;
        board.boardCanvas.onmouseout = closeDragElem;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            if (e.touches && e.touches.length > 0) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            } else {
                startX = e.clientX;
                startY = e.clientY;
            }

            board.boardCanvas.onmouseup = closeDragElem;
            board.boardCanvas.onmousemove = elemDrag;

            board.boardCanvas.ontouchend = closeDragElem;
            board.boardCanvas.ontouchmove = elemDrag;
        }

        function elemDrag(e) {
            e = e || window.event;
            e.preventDefault();
            if (e.touches && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            newX = startX - clientX;
            newY = startY - clientY;
            startX = clientX;
            startY = clientY;
            board.updateBoardPos(board.x - newX, board.y - newY);
        }

        function closeDragElem(e) {
            board.boardCanvas.onmouseup = null;
            board.boardCanvas.onmousemove = null;

            board.boardCanvas.ontouchend = null;
            board.boardCanvas.ontouchmove = null;
        }
    }
}