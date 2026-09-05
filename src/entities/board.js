import { ColorType, getDarkColorByType, getLightColorByType } from "../enum/color-type";
import { TileType } from "../enum/tile-type";
import { GameVars, removeBoardPixelSize, toBoardPixelSize, toPixelSize } from "../game-variables";
import { Bin, Cashier, Character, Cone, ConeMachine, ConeWithStep1, ConeWithStep2, ConeWithStep3, Unicorn } from "../sprites/tile-sprites";
import { createPixelLine, drawSprite } from "../utilities/draw-utilities";
import { createElem, setElemSize } from "../utilities/elem-utilities";
import { randomNumbOnRange } from "../utilities/general-utilities";
import { generateTile } from "../utilities/tile-factory";
import { Customer } from "./customer";
import { Player } from "./player";
import { Grass } from "./tiles/grass";

export class Board {
    constructor(gameDiv) {
        this.gameDiv = gameDiv;
        this.levelWalls = [];
        this.x = 0;
        this.y = 0;
        this.customerSpawnTimer = 0;
        this.customerNextSpawn = 2;
        this.reputationSpawnMultiplier = 1;

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
        this.customers = [new Customer(6, 10, this.boardCtx)];
        this.customers[0].flavoursColors = [ColorType.BLUE, ColorType.YELLOW, ColorType.RED];

        this.iceCreamWorkers = [];
        this.cashierWorkers = [];
        this.supplyWorkers = [];

        this.player = new Player(6, 8, this.boardCtx);

        this.resetBoardPos();
        this.dragElement(this);
    }

    createBackground() {
        this.backgroundCanvas = createElem(this.gameDiv, "canvas", "board-background", null,
            toBoardPixelSize(GameVars.gameWdAsPixels), toBoardPixelSize(GameVars.gameHgAsPixels), "#2f492c");
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
        this.cashiers = [];
        this.balconies = [];
        this.coneMachines = [];
        this.iceCreamMachines = {};
        this.bin = null;

        const startY = (this.boardTiles.length / 2) - 4;
        const startX = (this.boardTiles[0].length / 2) - 3;
        for (let y = startY; y < this.boardTiles.length; y++) {
            for (let x = startX; x <= startX + 5; x++) {
                if (y == startY || (y < startY + 6 && (x == startX || x == startX + 5))) {
                    this.boardTiles[y][x] = generateTile(x + 1, y + 1, TileType.WALL, this.boardCtx);
                } else if (y == startY + 1 && x == startX + 1) {
                    this.boardTiles[y][x] = generateTile(x + 1, y + 1, TileType.CONE_MACHINE, this.boardCtx);
                    this.coneMachines.push(this.boardTiles[y][x]);
                } else if (y == startY + 1 && x == startX + 2) {
                    this.boardTiles[y][x] = generateTile(x + 1, y + 1, TileType.ICE_CREAM_MACHINE, this.boardCtx);
                    this.boardTiles[y][x].setCreamColor(ColorType.BLUE);
                    this.iceCreamMachines[ColorType.BLUE] = this.boardTiles[y][x];
                } else if (y == startY + 1 && x == startX + 3) {
                    this.boardTiles[y][x] = generateTile(x + 1, y + 1, TileType.ICE_CREAM_MACHINE, this.boardCtx);
                    this.boardTiles[y][x].setCreamColor(ColorType.YELLOW);
                    this.iceCreamMachines[ColorType.YELLOW] = this.boardTiles[y][x];
                } else if (y == startY + 1 && x == startX + 4) {
                    this.boardTiles[y][x] = generateTile(x + 1, y + 1, TileType.ICE_CREAM_MACHINE, this.boardCtx);
                    this.boardTiles[y][x].setCreamColor(ColorType.RED);
                    this.iceCreamMachines[ColorType.RED] = this.boardTiles[y][x];
                } else if (y == startY + 3 && x == startX + 4) {
                    this.boardTiles[y][x] = generateTile(x + 1, y + 1, TileType.BIN, this.boardCtx);
                    this.bin = this.boardTiles[y][x];
                } else if (y == startY + 5 && x == startX + 1) {
                    this.boardTiles[y][x] = generateTile(x + 1, y + 1, TileType.CASHIER, this.boardCtx);
                    this.cashiers.push(this.boardTiles[y][x]);
                } else if (y == startY + 5 && x >= startX + 2 && x <= startX + 4) {
                    this.boardTiles[y][x] = generateTile(x + 1, y + 1, TileType.BALCONY, this.boardCtx);
                    this.balconies.push(this.boardTiles[y][x]);
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

    mov(x, y) {
        this.boardTiles.forEach(row => row.forEach(tile => tile.updateHighlight(x, y)));
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

    resize() {
        this.updateBoardPos(0, 0);
        setElemSize(this.backgroundCanvas, toBoardPixelSize(GameVars.gameWdAsPixels), toBoardPixelSize(GameVars.gameHgAsPixels));
        const ctx = this.backgroundCanvas.getContext("2d");
        const lines = [];
        for (let i = 0; i < GameVars.gameHgAsPixels / 12; i++) {
            createPixelLine(0, 16 * i + 2, GameVars.gameWdAsPixels, 16 * i + 2, "#21341f", toBoardPixelSize(1), lines);
        }
        lines.forEach(line => line.draw(ctx));
        this.drawGameBoardShadow();
        this.setGameBoardCanvas();
        this.boardTiles.forEach(tileRow => tileRow.forEach(tile => tile.updateZoom()));
        this.resetBoardPos();
    }

    retrieveNewDiff(value) {
        return value * toBoardPixelSize(1) / this.lastPixelSize;
    }

    update() {
        this.cashiers.forEach(c => c.update());
        this.balconies.forEach(b => b.update());
        for (let key in this.iceCreamMachines) {
            this.iceCreamMachines[key].update();
        }
        this.customers.forEach(c => c.update());

        if (!GameVars.game.isTutorial && GameVars.game.management.getMaxFlavours() > 0) {
            if (!this.customers.find(c => c.boardY == 14)) {
                const respawnRate = this.customerNextSpawn * this.getCustomerSpawnRatio();
                if (this.customerSpawnTimer >= respawnRate) {
                    this.customerSpawnTimer = 0;
                    this.customerNextSpawn = randomNumbOnRange(2, 6);
                    const customer = new Customer(6, 14, this.boardCtx);
                    this.customers.push(customer);
                } else {
                    this.customerSpawnTimer += GameVars.deltaTime;
                }
            }
        }
        this.customers.forEach(c => {
            if (c.boardX == 6 && c.boardY != 10 && !this.customers.find(c2 => c2.boardX == c.boardX && c2.boardY == c.boardY - 1)) {
                c.moveToBoardPos(6, c.boardY - 1);
            }
        });
        this.player.update();
        this.iceCreamWorkers.forEach(e => e.update());
        this.cashierWorkers.forEach(e => e.update());
        this.supplyWorkers.forEach(e => e.update());
    }

    getCustomerSpawnRatio() {
        return Math.max(0.2, 1 + this.reputationSpawnMultiplier * ((50 - GameVars.game.reputation) / 50));
    }

    draw() {
        this.boardCtx.clearRect(0, 0, this.boardCanvas.width, this.boardCanvas.height);
        for (let y = 0; y < this.boardTiles.length; y++) {
            for (let x = 0; x < this.boardTiles[0].length; x++) {
                this.boardTiles[y][x].drawBack();
                this.boardTiles[y][x].drawMiddle();
            }
            if (y == this.player.boardY - 1) this.player.draw();
            this.iceCreamWorkers.forEach(e => y == e.boardY - 1 && e.draw());
            this.cashierWorkers.forEach(c => y == c.boardY - 1 && c.draw());
            this.supplyWorkers.forEach(s => y == s.boardY - 1 && s.draw());
        }
        this.customers.forEach(c => c.draw());
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