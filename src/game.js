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
        this.baseMultiplier = 1;
        this.baseChangeValue = 2;
        this.minReputationFloor = 5;
        this.maxReviewReward = 6;

        this.gameChangeDuration = 10;

        this.rentCost = 4;
        this.rentDuration = 1;
        this.rentTimer = 0;

        this.flourCost = 100;
        this.grainCost = 100;

        this.management = new Management();
        this.board = new Board(this.gameBoardDiv);
        this.ui = new UI(this);

        this.board.cashiers[0].createInteractionBallon();

        this.isGameRunning = true;
        this.isGameOver = false;
        this.pause = false;
    }

    collectIceCreamPayment(customer) {
        this.updateReputation(customer);
        this.playerMoney += this.getIceCreamCost(customer);
    }

    updateReputation(customer) {
        const tipLevel = this.getTipLevel(customer.patienceLevel);
        if (tipLevel == 0) {
            this.reputation -= this.calculateBadReviewRatio(this.management.iceCreamPrice);
        } else if (tipLevel == 2) {
            this.reputation += this.calculateGoodReviewRatio(this.management.iceCreamPrice);
        }
        this.reputation = clamp(this.reputation, 0, 100);
    }

    getIceCreamCost(customer) {
        const tipLevel = this.getTipLevel(customer.patienceLevel);
        const iceCreamCost = this.management.iceCreamPrice;
        return Math.round(iceCreamCost + (tipLevel * iceCreamCost / 4));
    }

    getTipLevel(patienceLevel) {
        return patienceLevel < 33 ? 0 : patienceLevel < 66 ? 1 : 2;
    }

    calculateBadReviewRatio(price) {
        const rep = Math.max(this.reputation, this.minReputationFloor);
        return Math.min(this.maxReviewReward, Math.max(1, Math.round(((price / rep) / (100 / 50)) * this.baseMultiplier) * this.baseChangeValue));
    }

    calculateGoodReviewRatio(price) {
        return Math.min(this.maxReviewReward, Math.max(1, Math.round(((this.reputation / price) / (50 / 100)) * this.baseMultiplier) * this.baseChangeValue));
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
                if (this.playerMoney == 0 || this.reputation == 0) {
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