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

        this.rentCost = 2;
        this.rentDuration = 1;
        this.rentTimer = 0;

        this.flourCost = 100;
        this.grainCost = 100;

        this.iceCreamCost = 100;

        this.board = new Board(this.gameDiv);
        this.ui = new UI(this);

        this.board.cachiers[0].createInteractionBallon();

        this.isGameRunning = true;
    }

    collectIceCreamPayment(customerPatienceLevel) {
        this.playerMoney += this.getIceCreamCost(customerPatienceLevel);
    }

    getIceCreamCost(customerPatienceLevel) {
        const tipLevel = customerPatienceLevel < 33 ? 0 : customerPatienceLevel < 66 ? 1 : 2;
        return Math.round(this.iceCreamCost + (tipLevel * this.iceCreamCost / 4));
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
        if (this.isGameRunning) {
            this.board.update();
            if (this.rentTimer >= this.rentDuration) {
                this.rentTimer -= this.rentDuration;
                this.playerMoney = clamp(this.playerMoney - this.rentCost, 0, this.playerMoney);
                if (this.playerMoney == 0) {
                    // GAME OVER
                }
            } else {
                this.rentTimer += GameVars.deltaTime;
            }
        }
    }

    updateZoom() {
        this.board.updateZoom();
    }

    draw() {
        if (this.isGameRunning) {
            this.board?.draw();
            this.ui?.draw();
        }
    }

    resize() {
        if (this.isGameRunning) {
            this.board?.resize();
            this.ui?.resize();
        }
    }

    reset() {
        this.ui.reset();
    }
}