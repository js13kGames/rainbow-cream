import { ColorType } from "./enum/color-type";
import { StaffPriority } from "./enum/employee-state";
import { GameVars } from "./game-variables";

export class Management {
    constructor() {
        this.isMenuEditUnlockValue = 600;
        this.isMenuEditUnlocked = false;
        this.isBlueActive = true;
        this.isYellowActive = true;
        this.isRedActive = true;
        this.maxFlavourAmount = 3;
        this.oneFlavourPrice = 100;
        this.twoFlavoursPrice = 125;
        this.threeFlavoursPrice = 140;

        this.staffUnlockValue = 1000;
        this.isStaffUnlocked = false;
        this.staffSpeed = 1;
        this.staffSpeedLvl = 0;
        this.staffCost = 4;
        this.staffPayTimer = 0;
        this.staffPriority = StaffPriority.PATIENCE;

        this.baseIceCreamWorkerCost = 200;

        this.isOrderWorkerUnlocked = false;
        this.baseOrderWorkerCost = 200;

        this.isSupplyWorkerUnlocked = false;
        this.baseSupplyWorkerCost = 200;
    }

    unlockMenuEdit() {
        if (!this.isMenuEditUnlocked && GameVars.game.playerMoney >= this.isMenuEditUnlockValue) {
            GameVars.game.pay(this.isMenuEditUnlockValue);
            this.isMenuEditUnlocked = true;
        } else {
            GameVars.sound.wrongSound();
        }
    }

    unlockStaff() {
        if (!this.isStaffUnlocked && GameVars.game.playerMoney >= this.staffUnlockValue) {
            GameVars.game.pay(this.staffUnlockValue);
            this.isStaffUnlocked = true;
        } else {
            GameVars.sound.wrongSound();
        }
    }

    iceCreamWorkerCost(currentAmountOfWorkers) {
        return Math.round(this.baseIceCreamWorkerCost * (1 + (0.5 * currentAmountOfWorkers)));
    }

    getStaffSpeed() {
        return this.staffSpeed * (1 - (1 - 1 / (1 + this.staffSpeedLvl)));
    }

    getStaffPaymentCost() {
        return 4 * (GameVars.game.board.iceCreamWorkers.length + GameVars.game.board.orderWorkers.length + GameVars.game.board.supplyWorker.length);
    }

    getFlavoursCost(flavourAmount) {
        switch (flavourAmount) {
            case 0: return this.oneFlavourPrice;
            case 1: return this.twoFlavoursPrice;
            case 2: return this.threeFlavoursPrice;
        }
    }

    getMaxFlavours() {
        let maxByColors = this.isBlueActive ? 1 : 0;
        maxByColors += this.isYellowActive ? 1 : 0;
        maxByColors += this.isRedActive ? 1 : 0;
        return Math.min(maxByColors, this.maxFlavourAmount);
    }

    isActiveFlavour(color) {
        if (color == ColorType.BLUE && this.isBlueActive) return true;
        if (color == ColorType.YELLOW && this.isYellowActive) return true;
        if (color == ColorType.RED && this.isRedActive) return true;
        return false
    }

    update() {
        this.staffPayTimer += GameVars.deltaTime;
        if (this.staffPayTimer >= 1) {
            this.staffPayTimer -= 1;
            GameVars.game.pay(this.getStaffPaymentCost());
        }
    }
}