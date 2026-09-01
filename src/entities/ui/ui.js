import { GameVars, toPixelSize } from "../../game-variables";
import { genLargeBox, genSmallBox } from "../../utilities/box-generator";
import { createElem, setElemSize } from "../../utilities/elem-utilities";
import { drawPixelTextInCanvas } from "../../utilities/text";

export class UI {
    constructor(game) {
        this.game = game;
        this.uiDiv = createElem(document.getElementById("game"), "div", "ui");
        this.createFinances();
        this.createZoomBtns();
        this.createResetBtn();
    }

    createFinances() {
        this.timer = createElem(this.uiDiv, "canvas", null, null, toPixelSize(80), toPixelSize(43));
        this.timer.style.translate = (toPixelSize(8)) + 'px ' + (toPixelSize(8)) + 'px';
        this.financesCtx = this.timer.getContext("2d");
        this.drawFinances();
    }

    createZoomBtns() {
        this.zoomDiv = createElem(this.uiDiv, "div");
        this.zoom = createElem(this.zoomDiv, "canvas", null, null, toPixelSize(26), toPixelSize(61));
        this.zoom.style.translate = (GameVars.gameW - this.zoom.width - toPixelSize(8)) + 'px ' + ((GameVars.gameH - this.zoom.height) / 2) + 'px';
        const zoomCtx = this.zoom.getContext("2d");
        genSmallBox(zoomCtx, 0, 0, 25, 60, toPixelSize(1), "#3e3846", "#1b1116");
        drawPixelTextInCanvas("ZOOM", zoomCtx, toPixelSize(1), 13, 8, "#00bcd4", 1);

        this.zoomPlus = createElem(this.zoomDiv, "canvas", null, null, toPixelSize(18), toPixelSize(18), null, () => {
            this.plusClick = true;
            GameVars.boardPixelSize++;
            this.game.updateZoom();
        }, () => setTimeout(() => this.plusClick = false, 50));
        this.zoomPlus.style.translate = (GameVars.gameW - this.zoom.width - toPixelSize(4)) + 'px ' + (((GameVars.gameH - this.zoom.height) / 2) + toPixelSize(15)) + 'px';
        this.zoomPlusCtx = this.zoomPlus.getContext("2d");

        this.zoomMinus = createElem(this.zoomDiv, "canvas", null, null, toPixelSize(18), toPixelSize(18), null, () => {
            this.minusClick = true;
            GameVars.boardPixelSize--;
            GameVars.boardPixelSize = GameVars.boardPixelSize < 1 ? 1 : GameVars.boardPixelSize;
            this.game.updateZoom();
        }, () => setTimeout(() => this.minusClick = false, 50));
        this.zoomMinus.style.translate = (GameVars.gameW - this.zoom.width - toPixelSize(4)) + 'px ' + (((GameVars.gameH - this.zoom.height) / 2) + toPixelSize(37)) + 'px';
        this.zoomMinusCtx = this.zoomMinus.getContext("2d");
    }

    createResetBtn() {
        this.resetLevelBtn = createElem(this.uiDiv, "canvas", null, null, toPixelSize(52), toPixelSize(24), null, () => {
            this.resetClick = true;
            this.game.board.resetBoardPos();
        }, () => setTimeout(() => this.resetClick = false, 50));
        this.resetLevelBtn.style.translate = (GameVars.gameW - this.resetLevelBtn.width - toPixelSize(8)) + 'px ' + (GameVars.gameH - this.resetLevelBtn.height - toPixelSize(8)) + 'px';
        this.resetLevelBtnCtx = this.resetLevelBtn.getContext("2d");
    }

    reset() {
        clearInterval(this.timerInterval);
        this.uiDiv.remove();
    }

    resize() {
        setElemSize(this.timer, toPixelSize(80), toPixelSize(42));
        this.timer.style.translate = (toPixelSize(8)) + 'px ' + (toPixelSize(8)) + 'px';

        setElemSize(this.zoom, toPixelSize(26), toPixelSize(61));
        this.zoom.style.translate = (GameVars.gameW - this.zoom.width - toPixelSize(8)) + 'px ' + ((GameVars.gameH - this.zoom.height) / 2) + 'px';

        setElemSize(this.zoomPlus, toPixelSize(18), toPixelSize(18));
        this.zoomPlus.style.translate = (GameVars.gameW - this.zoom.width - toPixelSize(4)) + 'px ' + (((GameVars.gameH - this.zoom.height) / 2) + toPixelSize(15)) + 'px';

        setElemSize(this.zoomMinus, toPixelSize(18), toPixelSize(18));
        this.zoomMinus.style.translate = (GameVars.gameW - this.zoom.width - toPixelSize(4)) + 'px ' + (((GameVars.gameH - this.zoom.height) / 2) + toPixelSize(37)) + 'px';

        setElemSize(this.resetLevelBtn, toPixelSize(52), toPixelSize(24));
        this.resetLevelBtn.style.translate = (GameVars.gameW - this.resetLevelBtn.width - toPixelSize(8)) + 'px ' + (GameVars.gameH - this.resetLevelBtn.height - toPixelSize(8)) + 'px';
    }

    draw() {
        this.drawFinances();
        this.drawResetBtn();
        this.drawZoomBtns();
    }

    drawFinances() {
        genSmallBox(this.financesCtx, 1, 0, 77, 42, toPixelSize(1), "#3e3846", "#1b1116");
        genLargeBox(this.financesCtx, 0, 0, 79, 15, toPixelSize(1), "#3e3846", "#1b1116");
        drawPixelTextInCanvas("finances", this.financesCtx, toPixelSize(1), 40, 8, "#00bcd4", 1);

        drawPixelTextInCanvas("fonds", this.financesCtx, toPixelSize(1), 14, 21, "#00bcd4", 1);
        drawPixelTextInCanvas("$" + GameVars.game.playerMoney, this.financesCtx, toPixelSize(1), 52, 21, "#00bcd4", 1);

        drawPixelTextInCanvas("rent", this.financesCtx, toPixelSize(1), 12, 29, "#00bcd4", 1);
        drawPixelTextInCanvas("$-" + GameVars.game.rentCost + "/s", this.financesCtx, toPixelSize(1), 52, 29, "#00bcd4", 1);

        drawPixelTextInCanvas("income", this.financesCtx, toPixelSize(1), 16, 37, "#00bcd4", 1);
        drawPixelTextInCanvas("$" + GameVars.game.incomePerSecond + "/s", this.financesCtx, toPixelSize(1), 52, 37, "#00bcd4", 1);
    }

    drawResetBtn() {
        genSmallBox(this.resetLevelBtnCtx, 0, 0, 51, 23, toPixelSize(1), "#9bf2fa", this.resetClick ? "#ffffff66" : "#1b1116");
        drawPixelTextInCanvas("RESET BOARD", this.resetLevelBtnCtx, toPixelSize(1), 26, 8, "#9bf2fa", 1);
        drawPixelTextInCanvas("POSITION", this.resetLevelBtnCtx, toPixelSize(1), 26, 16, "#9bf2fa", 1);
    }

    drawZoomBtns() {
        genSmallBox(this.zoomPlusCtx, 0, 0, 17, 17, toPixelSize(1), "#9bf2fa", this.plusClick ? "#ffffff66" : "#1b1116");
        drawPixelTextInCanvas("+", this.zoomPlusCtx, toPixelSize(1), 9, 9, "#9bf2fa", 4);

        genSmallBox(this.zoomMinusCtx, 0, 0, 17, 17, toPixelSize(1), "#9bf2fa", this.minusClick ? "#ffffff66" : "#1b1116");
        drawPixelTextInCanvas("-", this.zoomMinusCtx, toPixelSize(1), 9, 9, "#9bf2fa", 4);
    }
}