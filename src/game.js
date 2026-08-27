import { Board } from "./entities/board";
import { UI } from "./entities/ui/ui";
import { GameVars } from "./game-variables";
import { clamp } from "./utilities/general-utilities";

export class Game {
    constructor(gameDiv) {
        this.gameDiv = gameDiv;
    }

    init() {
        GameVars.boardPixelSize = GameVars.pixelSize;
        this.gameDiv.innerHTML = "";

        GameVars.game = this;

        this.isTutorial = true;
        this.playerMoney = 500;

        this.rentCost = 100;
        this.flourCost = 100;
        this.grainCost = 100;

        this.iceCreamCost = 100;

        this.board = new Board(this.gameDiv);
        this.ui = new UI(this);
    }

    collectIceCreamPayment(customerPatienceLevel) {
        this.playerMoney += this.getIceCreamCost(customerPatienceLevel);
    }

    getIceCreamCost(customerPatienceLevel) {
        const tipLevel = customerPatienceLevel < 33 ? 0 : customerPatienceLevel < 66 ? 1 : 2;
        return Math.ceil(this.iceCreamCost + (tipLevel * this.iceCreamCost / 4));
    }

    pay(amount) {
        this.playerMoney = clamp(this.playerMoney - amount, 0, this.playerMoney);
    }

    click(x, y) {
        this.board.click(x, y);
    }

    mov(x, y) {
        this.board.mov(x, y);
    }

    update() {
        this.board.update();
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