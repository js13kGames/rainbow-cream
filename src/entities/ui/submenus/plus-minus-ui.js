import { toPixelSize } from "../../../game-variables";
import { genSmallBox } from "../../../utilities/box-generator";
import { createElem, setElemSize } from "../../../utilities/elem-utilities";
import { drawPixelTextInCanvas } from "../../../utilities/text";

export class PlusMinusUI {
    constructor(game, parentDiv, title, splitChar, plusFn, minusFn) {
        this.game = game;
        this.title = title.split(splitChar);

        this.mainCanv = createElem(parentDiv, "canvas");
        this.mainCanvCtx = this.mainCanv.getContext("2d");

        this.minusBtn = createElem(parentDiv, "canvas", null, null, null, null, null, () => {
            this.minusClick = true;
            minusFn();
        }, () => setTimeout(() => this.minusClick = false, 50));
        this.minusCtx = this.minusBtn.getContext("2d");

        this.plusBtn = createElem(parentDiv, "canvas", null, null, null, null, null, () => {
            this.plusClick = true;
            plusFn();
        }, () => setTimeout(() => this.plusClick = false, 50));
        this.plusCtx = this.plusBtn.getContext("2d");
    }

    resize(x, y) {
        setElemSize(this.mainCanv, toPixelSize(80), toPixelSize(32));
        this.mainCanv.style.translate = x + 'px ' + y + 'px';

        setElemSize(this.minusBtn, toPixelSize(14), toPixelSize(14));
        this.minusBtn.style.translate = (x + toPixelSize(38)) + 'px ' + (y + toPixelSize(4)) + 'px';

        setElemSize(this.plusBtn, toPixelSize(14), toPixelSize(14));
        this.plusBtn.style.translate = (x + toPixelSize(53)) + 'px ' + (y + toPixelSize(4)) + 'px';
    }

    draw(x, y, currentValue, minValue, maxValue, cost) {
        this.resize(x, y);

        genSmallBox(this.mainCanvCtx, 0, 0, 79, 21, toPixelSize(1), "#3e384655", "#1b1116");
        drawPixelTextInCanvas(this.title[0], this.mainCanvCtx, toPixelSize(1), 20, cost ? 5 : 8, "#00bcd4", 1);
        drawPixelTextInCanvas(this.title[1], this.mainCanvCtx, toPixelSize(1), 20, cost ? 11 : 14, "#00bcd4", 1);
        if (cost) drawPixelTextInCanvas("($" + cost + ")", this.mainCanvCtx, toPixelSize(1), 19, 17, "#00bcd4", 1);

        const disableMinus = currentValue == minValue;
        genSmallBox(this.minusCtx, 0, 0, 13, 13, toPixelSize(1), "#9bf2fa" + (disableMinus ? "55" : ""), this.minusClick ? "#ffffff66" : "#1b1116");
        drawPixelTextInCanvas("-", this.minusCtx, toPixelSize(1), 7, 7, "#9bf2fa" + (disableMinus ? "55" : ""), 3);

        const disablePlus = currentValue == maxValue || (cost && this.game.playerMoney < cost);
        genSmallBox(this.plusCtx, 0, 0, 13, 13, toPixelSize(1), "#9bf2fa" + (disablePlus ? "55" : ""), this.plusClick ? "#ffffff66" : "#1b1116");
        drawPixelTextInCanvas("+", this.plusCtx, toPixelSize(1), 7, 7, "#9bf2fa" + (disablePlus ? "55" : ""), 3);

        drawPixelTextInCanvas(currentValue, this.mainCanvCtx, toPixelSize(1), 73, 11, "#00bcd4", 1);
    }
}
