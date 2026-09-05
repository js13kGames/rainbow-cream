import { GameVars, toBoardPixelSize, toPixelSize } from "../../../game-variables";
import { genSmallBox } from "../../../utilities/box-generator";
import { createElem, setElemSize } from "../../../utilities/elem-utilities";
import { clamp } from "../../../utilities/general-utilities";
import { drawPixelTextInCanvas } from "../../../utilities/text";
import { IceCreamWorker } from "../../workers/icecream-worker";
import { PlusMinusUI } from "./plus-minus-ui";

export class MenuEditUI {
    constructor(game, parentDiv) {
        this.game = game;

        this.menuDiv = createElem(parentDiv, "div", "menu-edit");

        this.menuCanv = createElem(this.menuDiv, "canvas");
        this.menuCtx = this.menuCanv.getContext("2d");

        this.closeCanv = createElem(this.menuDiv, "canvas", null, null, null, null, null, () => this.hide());
        this.closeCtx = this.closeCanv.getContext("2d");

        this.blueActiveBtn = createElem(this.menuDiv, "canvas", null, null, null, null, null, () => {
            this.blueClick = true;
            this.game.management.isBlueActive = !this.game.management.isBlueActive;
        }, () => setTimeout(() => this.blueClick = false, 50));
        this.blueActiveCtx = this.blueActiveBtn.getContext("2d");

        this.yellowActiveBtn = createElem(this.menuDiv, "canvas", null, null, null, null, null, () => {
            this.yellowClick = true;
            this.game.management.isYellowActive = !this.game.management.isYellowActive;
        }, () => setTimeout(() => this.yellowClick = false, 50));
        this.yellowActiveCtx = this.yellowActiveBtn.getContext("2d");

        this.redActiveBtn = createElem(this.menuDiv, "canvas", null, null, null, null, null, () => {
            this.redClick = true;
            this.game.management.isRedActive = !this.game.management.isRedActive;
        }, () => setTimeout(() => this.redClick = false, 50));
        this.redActiveCtx = this.redActiveBtn.getContext("2d");

        this.numberOfFlavours = new PlusMinusUI(game, this.menuDiv, "max flavours", " ",
            () => {
                this.game.management.maxFlavourAmount = clamp(this.game.management.maxFlavourAmount + 1, 1, 3);
            },
            () => {
                this.game.management.maxFlavourAmount = clamp(this.game.management.maxFlavourAmount - 1, 1, 3);
            }
        );

        this.iceCreamPrice = new PlusMinusUI(game, this.menuDiv, "icecream|price", "|",
            () => {
                this.game.management.iceCreamPrice = Math.min(this.game.management.iceCreamPrice + 10, this.game.management.getMaxIceCreamPrice());
            },
            () => {
                this.game.management.iceCreamPrice = clamp(this.game.management.iceCreamPrice - 10, 1, Number.MAX_SAFE_INTEGER);
            }
        );

        this.hide();
    }

    show() {
        this.menuDiv.classList.remove("hidden");
    }

    hide() {
        this.menuDiv.classList.add("hidden");
    }

    resize() {
        setElemSize(this.menuCanv, toPixelSize(80), toPixelSize(78));
        this.menuCanv.style.translate = this.xPos + 'px ' + this.yPos + 'px';

        setElemSize(this.closeCanv, toPixelSize(10), toPixelSize(10));
        this.closeCanv.style.translate = (this.xPos + this.menuCanv.width - this.closeCanv.width - toPixelSize(1)) + 'px ' + (this.yPos + toPixelSize(1)) + 'px';

        setElemSize(this.blueActiveBtn, toPixelSize(22), toPixelSize(12));
        this.blueActiveBtn.style.translate = (this.xPos + toPixelSize(3)) + 'px ' + (this.yPos + toPixelSize(22)) + 'px';

        setElemSize(this.yellowActiveBtn, toPixelSize(32), toPixelSize(12));
        this.yellowActiveBtn.style.translate = (this.xPos + toPixelSize(3 + 23)) + 'px ' + (this.yPos + toPixelSize(22)) + 'px';

        setElemSize(this.redActiveBtn, toPixelSize(18), toPixelSize(12));
        this.redActiveBtn.style.translate = (this.xPos + toPixelSize(3 + 56)) + 'px ' + (this.yPos + toPixelSize(22)) + 'px';
    }

    draw(parentX, parentY) {
        this.xPos = parentX;
        this.yPos = parentY + toPixelSize(3);

        this.resize();

        genSmallBox(this.menuCtx, 0, 0, 79, 77, toPixelSize(1), "#3e3846", "#1b1116");
        drawPixelTextInCanvas("Menu", this.menuCtx, toPixelSize(1), 40, 6, "#00bcd4", 1);

        genSmallBox(this.closeCtx, 0, 0, 9, 9, toPixelSize(1), "#9bf2fa", "#1b1116");
        drawPixelTextInCanvas("x", this.closeCtx, toPixelSize(1), 5, 5, "#9bf2fa");

        genSmallBox(this.menuCtx, 0, 11, 79, 25, toPixelSize(1), "#3e384655", "#1b1116");
        drawPixelTextInCanvas("active flavours", this.menuCtx, toPixelSize(1), 39, 17, "#00bcd4");

        const isBlueActive = this.game.management.isBlueActive;
        genSmallBox(this.blueActiveCtx, 0, 0, 21, 11, toPixelSize(1), "#9bf2fa" + (isBlueActive ? "" : "55"), this.blueClick ? "#ffffff66" : "#1b1116");
        drawPixelTextInCanvas("blue", this.blueActiveCtx, toPixelSize(1), 11, 6, "#9bf2fa" + (isBlueActive ? "" : "55"));

        const isYellowActive = this.game.management.isYellowActive;
        genSmallBox(this.yellowActiveCtx, 0, 0, 31, 11, toPixelSize(1), "#9bf2fa" + (isYellowActive ? "" : "55"), this.yellowClick ? "#ffffff66" : "#1b1116");
        drawPixelTextInCanvas("yellow", this.yellowActiveCtx, toPixelSize(1), 16, 6, "#9bf2fa" + (isYellowActive ? "" : "55"));

        const isRedActive = this.game.management.isRedActive;
        genSmallBox(this.redActiveCtx, 0, 0, 17, 11, toPixelSize(1), "#9bf2fa" + (isRedActive ? "" : "55"), this.redClick ? "#ffffff66" : "#1b1116");
        drawPixelTextInCanvas("red", this.redActiveCtx, toPixelSize(1), 9, 6, "#9bf2fa" + (isRedActive ? "" : "55"));

        this.numberOfFlavours.draw(this.xPos, this.yPos + toPixelSize(36), this.game.management.maxFlavourAmount, 1, 3);
        this.iceCreamPrice.draw(this.xPos, this.yPos + toPixelSize(56), this.game.management.iceCreamPrice, 1, this.game.management.getMaxIceCreamPrice());
    }
}
