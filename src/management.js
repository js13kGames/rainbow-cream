import { ColorType } from "./enum/color-type";
import { GameVars } from "./game-variables";

export class Management {
    constructor() {
        this.menuEditUnlockValue = 600;
        this.isMenuEditUnlocked = false;
        this.isBlueActive = true;
        this.isYellowActive = true;
        this.isRedActive = true;
        this.maxFlavourAmount = 3;
        this.iceCreamPrice = 100;
        this.iceCreamPriceRatio = 6;

        this.unicornHandlingUnlockedValue = 1000;
        this.isUnicornHandlingUnlocked = false;
        this.baseUnicornGrainConsumption = 2;
        this.baseUnicornIceCreamProduction = 1;
        this.blueUnicornProductionSpeedLvl = 0;
        this.yellowUnicornProductionSpeedLvl = 0;
        this.redUnicornProductionSpeedLvl = 0;
        this.baseUnicornProductionCost = 200;

        this.staffUnlockValue = 1400;
        this.isStaffUnlocked = false;
        this.staffCost = 4;
        this.staffPayTimer = 0;
        this.baseWorkerCost = 200;
        this.staffSpeed = 1;
        this.staffSpeedLvl = 0;
        this.baseSpeedUpgradeCost = 400;
    }

    unlockMenuEdit() {
        if (!this.isMenuEditUnlocked && GameVars.game.playerMoney >= this.menuEditUnlockValue) {
            GameVars.sound.clickSound();
            GameVars.game.pay(this.menuEditUnlockValue);
            this.isMenuEditUnlocked = true;
        } else {
            GameVars.sound.wrongSound();
        }
    }
    getMaxFlavours() {
        let maxByColors = this.isBlueActive ? 1 : 0;
        maxByColors += this.isYellowActive ? 1 : 0;
        maxByColors += this.isRedActive ? 1 : 0;
        return Math.min(maxByColors, this.maxFlavourAmount);
    }
    getMaxIceCreamPrice() {
        return Math.max(1, Math.round(GameVars.game.reputation * this.iceCreamPriceRatio));
    }
    clampIceCreamPrice() {
        const cap = this.getMaxIceCreamPrice();
        if (this.iceCreamPrice > cap) this.iceCreamPrice = cap;
    }
    isActiveFlavour(color) {
        if (color == ColorType.BLUE && this.isBlueActive) return true;
        if (color == ColorType.YELLOW && this.isYellowActive) return true;
        if (color == ColorType.RED && this.isRedActive) return true;
        return false
    }

    unlockUnicornHandling() {
        if (!this.isUnicornHandlingUnlocked && GameVars.game.playerMoney >= this.unicornHandlingUnlockedValue) {
            GameVars.sound.clickSound();
            GameVars.game.pay(this.unicornHandlingUnlockedValue);
            this.isUnicornHandlingUnlocked = true;
        } else {
            GameVars.sound.wrongSound();
        }
    }
    unicornProductionSpeedUpgradeCost(colorType) {
        return Math.round(this.baseUnicornProductionCost * (1 + (0.5 * this.getUnicornProductionSpeedLvlBasedOnColor(colorType))));
    }
    unicornGrainConsumption(colorType) {
        return this.baseUnicornGrainConsumption + (this.baseUnicornGrainConsumption * this.getUnicornProductionSpeedLvlBasedOnColor(colorType));
    }
    unicornIceCreamProduction(colorType) {
        return this.baseUnicornIceCreamProduction + (this.baseUnicornIceCreamProduction * this.getUnicornProductionSpeedLvlBasedOnColor(colorType));
    }
    getUnicornProductionSpeedLvlBasedOnColor(colorType) {
        switch (colorType) {
            case ColorType.BLUE: return this.blueUnicornProductionSpeedLvl;
            case ColorType.YELLOW: return this.yellowUnicornProductionSpeedLvl;
            case ColorType.RED: return this.redUnicornProductionSpeedLvl;
        }
    }

    unlockStaff() {
        if (!this.isStaffUnlocked && GameVars.game.playerMoney >= this.staffUnlockValue) {
            GameVars.sound.clickSound();
            GameVars.game.pay(this.staffUnlockValue);
            this.isStaffUnlocked = true;
        } else {
            GameVars.sound.wrongSound();
        }
    }
    iceCreamWorkerCost(currentAmountOfWorkers) {
        return Math.round(this.baseWorkerCost * (1 + (0.5 * currentAmountOfWorkers)));
    }
    cashierWorkerCost(currentAmountOfWorkers) {
        return Math.round(this.baseWorkerCost * (1 + (0.5 * currentAmountOfWorkers)));
    }
    supplyWorkerCost(currentAmountOfWorkers) {
        return Math.round(this.baseWorkerCost * (1 + (0.5 * currentAmountOfWorkers)));
    }
    speedUpgradeCost() {
        return Math.round(this.baseSpeedUpgradeCost * (1 + (0.5 * this.staffSpeedLvl)));
    }
    getStaffSpeed() {
        return this.staffSpeed * (1 - (1 - 1 / (1 + this.staffSpeedLvl)));
    }
    getStaffPaymentCost() {
        return 4 * (GameVars.game.board.iceCreamWorkers.length + GameVars.game.board.cashierWorkers.length + GameVars.game.board.supplyWorkers.length);
    }

    update() {
        this.staffPayTimer += GameVars.deltaTime;
        if (this.staffPayTimer >= 1) {
            this.staffPayTimer -= 1;
            GameVars.game.pay(this.getStaffPaymentCost());
        }
        this.clampIceCreamPrice();
    }
}