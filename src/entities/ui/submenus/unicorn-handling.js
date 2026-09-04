import { GameVars, toBoardPixelSize, toPixelSize } from "../../../game-variables";
import { genSmallBox } from "../../../utilities/box-generator";
import { createElem, setElemSize } from "../../../utilities/elem-utilities";
import { clamp } from "../../../utilities/general-utilities";
import { drawPixelTextInCanvas } from "../../../utilities/text";
import { IceCreamWorker } from "../../workers/icecream-worker";
import { CashierWorker } from "../../workers/cashier-worker";
import { PlusMinusUI } from "./plus-minus-ui";
import { SupplyWorker } from "../../workers/supply-worker";
import { ColorType } from "../../../enum/color-type";

export class UnicornHandlingUI {
    constructor(game, parentDiv) {
        this.game = game;

        this.unicornDiv = createElem(parentDiv, "div", "staff");

        this.unicornCanv = createElem(this.unicornDiv, "canvas");
        this.unicornCtx = this.unicornCanv.getContext("2d");

        this.closeCanv = createElem(this.unicornDiv, "canvas", null, null, null, null, null, () => this.hide());
        this.closeCtx = this.closeCanv.getContext("2d");

        this.blueProductionUI = new PlusMinusUI(game, this.unicornDiv, "blue production", " ",
            () => {
                const productionUpgradeCost = this.game.management.unicornProductionSpeedUpgradeCost(ColorType.BLUE);
                if (this.game.playerMoney >= productionUpgradeCost) {
                    this.game.pay(productionUpgradeCost);
                    this.game.management.blueUnicornProductionSpeedLvl++;
                } else {
                    GameVars.sound.wrongSound();
                }
            },
            () => {
                this.game.management.blueUnicornProductionSpeedLvl = clamp(this.game.management.blueUnicornProductionSpeedLvl - 1, 0, Number.MAX_SAFE_INTEGER);
            }
        );

        this.yellowProductionUI = new PlusMinusUI(game, this.unicornDiv, "yellow production", " ",
            () => {
                const productionUpgradeCost = this.game.management.unicornProductionSpeedUpgradeCost(ColorType.YELLOW);
                if (this.game.playerMoney >= productionUpgradeCost) {
                    this.game.pay(productionUpgradeCost);
                    this.game.management.yellowUnicornProductionSpeedLvl++;
                } else {
                    GameVars.sound.wrongSound();
                }
            },
            () => {
                this.game.management.yellowUnicornProductionSpeedLvl = clamp(this.game.management.yellowUnicornProductionSpeedLvl - 1, 0, Number.MAX_SAFE_INTEGER);
            }
        );

        this.redProductionUI = new PlusMinusUI(game, this.unicornDiv, "red production", " ",
            () => {
                const productionUpgradeCost = this.game.management.unicornProductionSpeedUpgradeCost(ColorType.RED);
                if (this.game.playerMoney >= productionUpgradeCost) {
                    this.game.pay(productionUpgradeCost);
                    this.game.management.redUnicornProductionSpeedLvl++;
                } else {
                    GameVars.sound.wrongSound();
                }
            },
            () => {
                this.game.management.redUnicornProductionSpeedLvl = clamp(this.game.management.redUnicornProductionSpeedLvl - 1, 0, Number.MAX_SAFE_INTEGER);
            }
        );

        this.hide();
    }

    show() {
        this.unicornDiv.classList.remove("hidden");
    }

    hide() {
        this.unicornDiv.classList.add("hidden");
    }

    resize() {
        setElemSize(this.unicornCanv, toPixelSize(80), toPixelSize(78));
        this.unicornCanv.style.translate = this.xPos + 'px ' + this.yPos + 'px';

        setElemSize(this.closeCanv, toPixelSize(10), toPixelSize(10));
        this.closeCanv.style.translate = this.xPos + 'px ' + this.yPos + 'px';
    }

    draw(parentX, parentY) {
        this.xPos = parentX;
        this.yPos = parentY + toPixelSize(3);

        this.resize();

        genSmallBox(this.unicornCtx, 0, 0, 79, 77, toPixelSize(1), "#3e3846", "#1b1116");
        drawPixelTextInCanvas("unicorn handling", this.unicornCtx, toPixelSize(1), 40, 8, "#00bcd4", 1);

        genSmallBox(this.closeCtx, 0, 0, 9, 9, toPixelSize(1), "#9bf2fa", "#1b1116");
        drawPixelTextInCanvas("x", this.closeCtx, toPixelSize(1), 5, 5, "#00bcd4");

        this.blueProductionUI.draw(this.xPos, this.yPos + toPixelSize(14),
            this.game.management.blueUnicornProductionSpeedLvl, 0, Number.MAX_SAFE_INTEGER,
            this.game.management.unicornProductionSpeedUpgradeCost(ColorType.BLUE));

        this.yellowProductionUI.draw(this.xPos, this.yPos + toPixelSize(35),
            this.game.management.yellowUnicornProductionSpeedLvl, 0, Number.MAX_SAFE_INTEGER,
            this.game.management.unicornProductionSpeedUpgradeCost(ColorType.YELLOW));

        this.redProductionUI.draw(this.xPos, this.yPos + toPixelSize(56),
            this.game.management.redUnicornProductionSpeedLvl, 0, Number.MAX_SAFE_INTEGER,
            this.game.management.unicornProductionSpeedUpgradeCost(ColorType.RED));
    }
}
