import { GameVars, toPixelSize } from "../../game-variables";
import { genSmallBox } from "../../utilities/box-generator";
import { createElem } from "../../utilities/elem-utilities";
import { drawPixelTextInCanvas } from "../../utilities/text";

export class UI {
    constructor(game) {
        this.game = game;
        this.uiDiv = createElem(document.getElementById("game"), "div", "ui");

        // this.currentLevelUi();
        // this.createTimer();
        this.createZoomBtns();
        this.createResetBtn();
    }

    currentLevelUi() {
        const levelUi = createElem(this.uiDiv, "canvas", null, null, toPixelSize(52), toPixelSize(24), GameVars.isMobile, null, () => this.game.board.resetBoardPos());
        levelUi.style.translate = (toPixelSize(8)) + 'px ' + (toPixelSize(8)) + 'px';
        const levelUiCtx = levelUi.getContext("2d");
        genSmallBox(levelUiCtx, 0, 0, 51, 23, toPixelSize(1), "#3e3846", "#1b1116");
        drawPixelTextInCanvas("level", levelUiCtx, toPixelSize(1), 26, 6, "#00bcd4", 1);
        drawPixelTextInCanvas(this.game.levelIndex + 1, levelUiCtx, toPixelSize(1), 26, 16, "#00bcd4", 2);
    }

    createResetBtn() {
        this.resetLevelBtn = createElem(this.uiDiv, "canvas", null, null, toPixelSize(52), toPixelSize(24), GameVars.isMobile, null, () => {
            this.resetClick = true;
            this.game.board.resetBoardPos();
        }, () => setTimeout(() => this.resetClick = false, 50));
        this.resetLevelBtn.style.translate = (GameVars.gameW - this.resetLevelBtn.width - toPixelSize(8)) + 'px ' + (GameVars.gameH - this.resetLevelBtn.height - toPixelSize(8)) + 'px';
        this.resetLevelBtnCtx = this.resetLevelBtn.getContext("2d");
    }

    drawResetBtn() {
        genSmallBox(this.resetLevelBtnCtx, 0, 0, 51, 23, toPixelSize(1), "#9bf2fa", this.resetClick ? "#ffffff66" : "#1b1116");
        drawPixelTextInCanvas("RESET BOARD", this.resetLevelBtnCtx, toPixelSize(1), 26, 8, "#9bf2fa", 1);
        drawPixelTextInCanvas("POSITION", this.resetLevelBtnCtx, toPixelSize(1), 26, 16, "#9bf2fa", 1);
    }

    createTimer() {
        this.timer = createElem(this.uiDiv, "canvas", null, null, toPixelSize(80), toPixelSize(34));
        this.timer.style.translate = ((GameVars.gameW - this.timer.width) / 2) + 'px ' + (toPixelSize(8)) + 'px';
        this.timerCtx = this.timer.getContext("2d");
        this.drawTimer();
    }

    drawTimer() {
        genSmallBox(this.timerCtx, 0, 0, 78, 33, toPixelSize(1), "#3e3846", "#1b1116");
        drawPixelTextInCanvas("TIME", this.timerCtx, toPixelSize(1), 40, 8, "#00bcd4", 1);
    }

    createZoomBtns() {
        this.zoomDiv = createElem(this.uiDiv, "div");
        this.zoom = createElem(this.zoomDiv, "canvas", null, null, toPixelSize(26), toPixelSize(61));
        this.zoom.style.translate = (GameVars.gameW - this.zoom.width - toPixelSize(8)) + 'px ' + ((GameVars.gameH - this.zoom.height) / 2) + 'px';
        const zoomCtx = this.zoom.getContext("2d");
        genSmallBox(zoomCtx, 0, 0, 25, 60, toPixelSize(1), "#3e3846", "#1b1116");
        drawPixelTextInCanvas("ZOOM", zoomCtx, toPixelSize(1), 13, 8, "#00bcd4", 1);

        this.zoomPlus = createElem(this.zoomDiv, "canvas", null, null, toPixelSize(18), toPixelSize(18), GameVars.isMobile, null, () => {
            this.plusClick = true;
            GameVars.boardPixelSize++;
            this.game.updateZoom();
        }, () => setTimeout(() => this.plusClick = false, 50));
        this.zoomPlus.style.translate = (GameVars.gameW - this.zoom.width - toPixelSize(4)) + 'px ' + (((GameVars.gameH - this.zoom.height) / 2) + toPixelSize(15)) + 'px';
        this.zoomPlusCtx = this.zoomPlus.getContext("2d");

        this.zoomMinus = createElem(this.zoomDiv, "canvas", null, null, toPixelSize(18), toPixelSize(18), GameVars.isMobile, null, () => {
            this.minusClick = true;
            GameVars.boardPixelSize--;
            GameVars.boardPixelSize = GameVars.boardPixelSize < 1 ? 1 : GameVars.boardPixelSize;
            this.game.updateZoom();
        }, () => setTimeout(() => this.minusClick = false, 50));
        this.zoomMinus.style.translate = (GameVars.gameW - this.zoom.width - toPixelSize(4)) + 'px ' + (((GameVars.gameH - this.zoom.height) / 2) + toPixelSize(37)) + 'px';
        this.zoomMinusCtx = this.zoomMinus.getContext("2d");
    }

    drawZoomBtns() {
        genSmallBox(this.zoomPlusCtx, 0, 0, 17, 17, toPixelSize(1), "#9bf2fa", this.plusClick ? "#ffffff66" : "#1b1116");
        drawPixelTextInCanvas("+", this.zoomPlusCtx, toPixelSize(1), 9, 9, "#9bf2fa", 4);

        genSmallBox(this.zoomMinusCtx, 0, 0, 17, 17, toPixelSize(1), "#9bf2fa", this.minusClick ? "#ffffff66" : "#1b1116");
        drawPixelTextInCanvas("-", this.zoomMinusCtx, toPixelSize(1), 9, 9, "#9bf2fa", 4);
    }

    reset() {
        clearInterval(this.timerInterval);
        this.uiDiv.remove();
    }

    draw() {
        // this.drawTimer();
        this.drawResetBtn();
        this.drawZoomBtns();
    }
}