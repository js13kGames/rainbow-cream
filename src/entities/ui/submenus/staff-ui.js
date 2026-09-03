import { GameVars, toBoardPixelSize, toPixelSize } from "../../../game-variables";
import { genSmallBox } from "../../../utilities/box-generator";
import { createElem, setElemSize } from "../../../utilities/elem-utilities";
import { drawPixelTextInCanvas } from "../../../utilities/text";
import { IceCreamWorker } from "../../workers/icecream-worker";
import { PlusMinusUI } from "./plus-minus-ui";

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
                const iceCreamMakerCost = this.game.management.iceCreamWorkerCost(numberOfIceCreamWorker);
                if (numberOfIceCreamWorker < this.game.board.balconies.length && this.game.playerMoney > iceCreamMakerCost) {
                    this.game.pay(iceCreamMakerCost);
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
        this.hide();
    }

    show() {
        this.staffDiv.classList.remove("hidden");
    }

    hide() {
        this.staffDiv.classList.add("hidden");
    }

    resize() {
        setElemSize(this.staffCanv, toPixelSize(80), toPixelSize(43));
        this.staffCanv.style.translate = this.xPos + 'px ' + this.yPos + 'px';

        setElemSize(this.closeCanv, toPixelSize(10), toPixelSize(10));
        this.closeCanv.style.translate = this.xPos + 'px ' + this.yPos + 'px';
    }

    draw(parentX, parentY) {
        this.xPos = parentX;
        this.yPos = parentY + toPixelSize(3);

        this.resize();

        genSmallBox(this.staffCtx, 0, 0, 79, 42, toPixelSize(1), "#3e3846", "#1b1116");
        drawPixelTextInCanvas("staff", this.staffCtx, toPixelSize(1), 40, 8, "#00bcd4", 1);

        genSmallBox(this.closeCtx, 0, 0, 9, 9, toPixelSize(1), "#9bf2fa", "#1b1116");
        drawPixelTextInCanvas("x", this.closeCtx, toPixelSize(1), 5, 5, "#00bcd4");

        this.hireIceCreamWorkerUI.draw(this.xPos, this.yPos + toPixelSize(14),
            this.game.board.iceCreamWorkers.length, 0, this.game.board.balconies.length, true);
    }
}
