import { Board } from "./entities/board";
import { UI } from "./entities/ui/ui";
import { GameVars } from "./game-variables";
import { Management } from "./management";
import { clamp, randomNumb, randomNumbOnRange } from "./utilities/general-utilities";

export class Game {
    init(gameBoardDiv) {
        this.gameBoardDiv = gameBoardDiv;
        GameVars.boardPixelSize = GameVars.pixelSize;

        GameVars.game = this;

        this.isTutorial = true;
        this.playerMoney = 500;
        this.reputation = 50;

        this.gameChangeDuration = 10;

        this.rentCost = 4;
        this.rentDuration = 1;
        this.rentTimer = 0;

        this.flourCost = 100;
        this.grainCost = 100;

        this.management = new Management();
        this.board = new Board(this.gameBoardDiv);
        this.ui = new UI(this);

        this.board.cachiers[0].createInteractionBallon();

        this.isGameRunning = true;
        this.isGameOver = false;
        this.pause = false;
    }

    collectIceCreamPayment(customer) {
        this.playerMoney += this.getIceCreamCost(customer);
    }

    getIceCreamCost(customer) {
        const tipLevel = customer.patienceLevel < 33 ? 0 : customer.patienceLevel < 66 ? 1 : 2;
        const iceCreamCost = this.management.getFlavoursCost(customer.flavoursAmount);
        return Math.round(iceCreamCost + (tipLevel * iceCreamCost / 4));
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
        if (this.isGameRunning && !this.pause) {
            this.board.update();
            this.management.update();
            this.rentTimer += GameVars.deltaTime;
            if (this.rentTimer >= this.rentDuration) {
                this.rentTimer -= this.rentDuration;
                this.playerMoney = clamp(this.playerMoney - this.rentCost, 0, this.playerMoney);
                if (this.playerMoney == 0) {
                    this.isGameRunning = false;
                    this.isGameOver = true;
                }
            }
            this.gameChangeDuration -= GameVars.deltaTime;
            if (this.gameChangeDuration <= 0) {
                this.gameChangeDuration = randomNumbOnRange(10, 20);
                this.rentCost = randomNumbOnRange(2, 6);
                this.flourCost = randomNumbOnRange(50, 150);
                this.grainCost = randomNumbOnRange(50, 150);
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