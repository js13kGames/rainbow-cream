import { Board } from "./entities/board";
import { UI } from "./entities/ui/ui";
import { GameVars } from "./game-variables";

export class Game {
    constructor(gameDiv) {
        this.gameDiv = gameDiv;
    }

    init() {
        GameVars.boardPixelSize = GameVars.pixelSize;
        this.gameDiv.innerHTML = "";
        this.board = new Board(this.gameDiv);
        this.ui = new UI(this);
    }

    click(x, y) {
        this.board.click(x, y);
    }

    mov(x, y) {
        this.board.update(x, y);
    }

    update() {
    }

    updateZoom() {
        this.board.updateZoom();
    }

    draw() {
        this.board?.draw();
        this.ui?.draw();
    }

    reset() {
        this.ui.reset();
    }
}