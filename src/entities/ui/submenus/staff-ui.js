import { GameVars, toBoardPixelSize, toPixelSize } from "../../../game-variables";
import { genSmallBox } from "../../../utilities/box-generator";
import { createElem, setElemSize } from "../../../utilities/elem-utilities";
import { clamp } from "../../../utilities/general-utilities";
import { drawPixelTextInCanvas } from "../../../utilities/text";
import { IceCreamWorker } from "../../workers/icecream-worker";
import { CashierWorker } from "../../workers/cashier-worker";
import { PlusMinusUI } from "./plus-minus-ui";
import { SupplyWorker } from "../../workers/supply-worker";

export class StaffUI {
    constructor(game, parentDiv) {
        this.game = game;

        this.staffDiv = createElem(parentDiv, "div", "staff");

        this.staffCanv = createElem(this.staffDiv, "canvas");
        this.staffCtx = this.staffCanv.getContext("2d");

        this.closeCanv = createElem(this.staffDiv, "canvas", null, null, null, null, null, () => this.hide());
        this.closeCtx = this.closeCanv.getContext("2d");

        this.hireIceCreamWorkerUI = new PlusMinusUI(game, this.staffDiv, "icecream workers", " ",
            () => {
                const numberOfIceCreamWorker = this.game.board.iceCreamWorkers.length;
                const iceCreamWorkerCost = this.game.management.iceCreamWorkerCost(numberOfIceCreamWorker);
                if (numberOfIceCreamWorker < this.game.board.balconies.length && this.game.playerMoney >= iceCreamWorkerCost) {
                    this.game.pay(iceCreamWorkerCost);
                    this.game.board.iceCreamWorkers.push(new IceCreamWorker());
                } else {
                    GameVars.sound.wrongSound();
                }
            },
            () => {
                if (this.game.board.iceCreamWorkers.length > 0) {
                    this.game.board.iceCreamWorkers.pop();
                } else {
                    GameVars.sound.wrongSound();
                }
            }
        );

        this.hireCashierWorkerUI = new PlusMinusUI(game, this.staffDiv, "cashier workers", " ",
            () => {
                const numberOfCashierWorkers = this.game.board.cashierWorkers.length;
                const cashierWorkerCost = this.game.management.cashierWorkerCost(numberOfCashierWorkers);
                if (numberOfCashierWorkers < this.game.board.cashiers.length && this.game.playerMoney >= cashierWorkerCost) {
                    this.game.pay(cashierWorkerCost);
                    this.game.board.cashierWorkers.push(new CashierWorker());
                } else {
                    GameVars.sound.wrongSound();
                }
            },
            () => {
                if (this.game.board.cashierWorkers.length > 0) {
                    this.game.board.cashierWorkers.pop();
                } else {
                    GameVars.sound.wrongSound();
                }
            }
        );

        this.hireSupplyWorkerUI = new PlusMinusUI(game, this.staffDiv, "supply workers", " ",
            () => {
                const numberOfSupplyWorkers = this.game.board.supplyWorkers.length;
                const supplyWorkerCost = this.game.management.supplyWorkerCost(numberOfSupplyWorkers);
                if (numberOfSupplyWorkers < this.game.board.balconies.length && this.game.playerMoney >= supplyWorkerCost) {
                    this.game.pay(supplyWorkerCost);
                    this.game.board.supplyWorkers.push(new SupplyWorker());
                } else {
                    GameVars.sound.wrongSound();
                }
            },
            () => {
                if (this.game.board.supplyWorkers.length > 0) {
                    this.game.board.supplyWorkers.pop();
                } else {
                    GameVars.sound.wrongSound();
                }
            }
        );

        this.speedUpgradeUI = new PlusMinusUI(game, this.staffDiv, "speed upgrade", " ",
            () => {
                const speedUpgradeCost = this.game.management.speedUpgradeCost();
                if (this.game.playerMoney >= speedUpgradeCost) {
                    this.game.pay(speedUpgradeCost);
                    this.game.management.staffSpeedLvl++;
                } else {
                    GameVars.sound.wrongSound();
                }
            },
            () => {
                this.game.management.staffSpeedLvl = clamp(this.game.management.staffSpeedLvl - 1, 0, Number.MAX_SAFE_INTEGER);
            }
        );

        this.hide();
    }

    show() {
        this.staffDiv.classList.remove("hidden");
    }

    hide() {
        this.staffDiv.classList.add("hidden");
    }

    resize() {
        setElemSize(this.staffCanv, toPixelSize(80), toPixelSize(96));
        this.staffCanv.style.translate = this.xPos + 'px ' + this.yPos + 'px';

        setElemSize(this.closeCanv, toPixelSize(10), toPixelSize(10));
        this.closeCanv.style.translate = (this.xPos + this.staffCanv.width - this.closeCanv.width - toPixelSize(1)) + 'px ' + (this.yPos + toPixelSize(1)) + 'px';
    }

    draw(parentX, parentY) {
        this.xPos = parentX;
        this.yPos = parentY + toPixelSize(3);

        this.resize();

        genSmallBox(this.staffCtx, 0, 0, 79, 95, toPixelSize(1), "#3e3846", "#1b1116");
        drawPixelTextInCanvas("staff", this.staffCtx, toPixelSize(1), 40, 6, "#00bcd4", 1);

        genSmallBox(this.closeCtx, 0, 0, 9, 9, toPixelSize(1), "#9bf2fa", "#1b1116");
        drawPixelTextInCanvas("x", this.closeCtx, toPixelSize(1), 5, 5, "#00bcd4");

        this.hireIceCreamWorkerUI.draw(this.xPos, this.yPos + toPixelSize(11),
            this.game.board.iceCreamWorkers.length, 0, this.game.board.balconies.length,
            this.game.management.iceCreamWorkerCost(this.game.board.iceCreamWorkers.length));

        this.hireCashierWorkerUI.draw(this.xPos, this.yPos + toPixelSize(32),
            this.game.board.cashierWorkers.length, 0, this.game.board.cashiers.length,
            this.game.management.cashierWorkerCost(this.game.board.cashierWorkers.length));

        this.hireSupplyWorkerUI.draw(this.xPos, this.yPos + toPixelSize(53),
            this.game.board.supplyWorkers.length, 0, this.game.board.balconies.length,
            this.game.management.supplyWorkerCost(this.game.board.supplyWorkers.length));

        this.speedUpgradeUI.draw(this.xPos, this.yPos + toPixelSize(74),
            this.game.management.staffSpeedLvl, 0, Number.MAX_SAFE_INTEGER,
            this.game.management.speedUpgradeCost());
    }
}
