import { ColorType, getLightColorByType, getRangeColor } from "../../enum/color-type.js";
import { GameVars, toPixelSize } from "../../game-variables";
import { genLargeBox, genSmallBox } from "../../utilities/box-generator";
import { createElem, setElemSize } from "../../utilities/elem-utilities";
import { clamp } from "../../utilities/general-utilities.js";
import { drawPixelTextInCanvas } from "../../utilities/text";
import { ManagementUI } from "./management-ui.js";

export class UI {
    constructor(game) {
        this.game = game;
        this.uiDiv = createElem(document.getElementById("game"), "div", "ui");
        this.managementUI = new ManagementUI(this.game, this.uiDiv);
        this.createPauseBtn();
        this.createFinances();
        this.createBoardControlBtns();
        this.resize();
    }

    createPauseBtn() {
        this.pauseCanv = createElem(this.uiDiv, "canvas");
        this.pauseCanvCtx = this.pauseCanv.getContext("2d");

        this.pauseBtnCanv = createElem(this.uiDiv, "canvas", null, null, null, null, null, () => {
            this.game.pause = !this.game.pause;
        });
        this.pauseBtnCtx = this.pauseBtnCanv.getContext("2d");
    }

    createFinances() {
        this.financesCanv = createElem(this.uiDiv, "canvas");
        this.financesCtx = this.financesCanv.getContext("2d");
    }

    createBoardControlBtns() {
        this.zoomDiv = createElem(this.uiDiv, "div");

        this.zoomCanv = createElem(this.zoomDiv, "canvas");
        this.zoomCtx = this.zoomCanv.getContext("2d");

        this.zoomPlus = createElem(this.zoomDiv, "canvas", null, null, null, null, null, () => {
            this.plusClick = true;
            GameVars.boardPixelSize++;
            this.game.updateZoom();
        }, () => setTimeout(() => this.plusClick = false, 50));
        this.zoomPlusCtx = this.zoomPlus.getContext("2d");

        this.zoomMinus = createElem(this.zoomDiv, "canvas", null, null, null, null, null, () => {
            this.minusClick = true;
            GameVars.boardPixelSize--;
            GameVars.boardPixelSize = GameVars.boardPixelSize < 1 ? 1 : GameVars.boardPixelSize;
            this.game.updateZoom();
        }, () => setTimeout(() => this.minusClick = false, 50));
        this.zoomMinusCtx = this.zoomMinus.getContext("2d");

        this.resetLevelBtn = createElem(this.uiDiv, "canvas", null, null, null, null, null, () => {
            this.resetClick = true;
            this.game.board.resetBoardPos();
        }, () => setTimeout(() => this.resetClick = false, 50));
        this.resetLevelBtnCtx = this.resetLevelBtn.getContext("2d");
    }

    reset() {
        this.uiDiv.remove();
    }

    resize() {
        setElemSize(this.financesCanv, toPixelSize(80), toPixelSize(80));
        this.financesCanv.style.translate = (GameVars.gameW - this.financesCanv.width - toPixelSize(8)) + 'px ' + (toPixelSize(8)) + 'px';

        setElemSize(this.pauseCanv, toPixelSize(60), toPixelSize(20));
        this.pauseCanv.style.translate = ((GameVars.gameW - this.pauseCanv.width) / 2) + 'px ' + (toPixelSize(8 + 20 + 4)) + 'px';

        setElemSize(this.pauseBtnCanv, toPixelSize(20), toPixelSize(20));
        this.pauseBtnCanv.style.translate = ((GameVars.gameW - this.pauseBtnCanv.width) / 2) + 'px ' + (toPixelSize(8)) + 'px';

        setElemSize(this.zoomCanv, toPixelSize(54), toPixelSize(51));
        const zoomPosX = GameVars.gameW - this.zoomCanv.width - toPixelSize(8);
        const zoomPosY = GameVars.gameH - this.zoomCanv.height - toPixelSize(8);
        this.zoomCanv.style.translate = zoomPosX + 'px ' + zoomPosY + 'px';

        setElemSize(this.zoomPlus, toPixelSize(18), toPixelSize(18));
        this.zoomPlus.style.translate = (zoomPosX + toPixelSize(10)) + 'px ' + (zoomPosY + toPixelSize(12)) + 'px';

        setElemSize(this.zoomMinus, toPixelSize(18), toPixelSize(18));
        this.zoomMinus.style.translate = (zoomPosX + toPixelSize(30)) + 'px ' + (zoomPosY + toPixelSize(12)) + 'px';

        setElemSize(this.resetLevelBtn, toPixelSize(46), toPixelSize(17));
        this.resetLevelBtn.style.translate = (zoomPosX + toPixelSize(4)) + 'px ' + (zoomPosY + toPixelSize(30)) + 'px';

        this.managementUI.resize();
    }

    draw() {
        this.drawPause();
        this.drawFinances();
        this.drawBoardControlBtns();
        this.managementUI.draw();
    }

    drawPause() {
        this.pauseCanvCtx.clearRect(0, 0, this.pauseCanv.width, this.pauseCanv.height);
        if (this.game.pause) {
            genSmallBox(this.pauseCanvCtx, 0, 0, 59, 19, toPixelSize(1), "#3e3846", "#1b1116");
            drawPixelTextInCanvas('pause', this.pauseCanvCtx, toPixelSize(1), 30, 10, "#00bcd4", 2);
        }

        this.pauseBtnCtx.clearRect(0, 0, this.pauseBtnCanv.width, this.pauseBtnCanv.height);
        genSmallBox(this.pauseBtnCtx, 0, 0, 19, 19, toPixelSize(1), "#9bf2fa", "#1b1116");
        drawPixelTextInCanvas(this.game.pause ? '{' : '}', this.pauseBtnCtx, toPixelSize(1), 10, 10, "#9bf2fa", 2);
    }

    drawFinances() {
        this.financesCtx.clearRect(0, 0, this.financesCanv.width, this.financesCanv.height);

        const board = this.game.board;
        const hasWorkers = board.iceCreamWorkers.length > 0 || board.cashierWorkers.length > 0 || board.supplyWorkers.length > 0;
        const amountOfFinances = 3 + (hasWorkers ? 1 : 0);
        genSmallBox(this.financesCtx, 0, 0, 79, 79, toPixelSize(1), "#3e3846", "#1b1116");
        genSmallBox(this.financesCtx, 0, 0, 79, 11, toPixelSize(1), "#3e3846", "#1b1116");
        drawPixelTextInCanvas("finances", this.financesCtx, toPixelSize(1), 40, 7, "#00bcd4", 1);

        drawPixelTextInCanvas("score", this.financesCtx, toPixelSize(1), 13, 16, "#00bcd4", 1);
        drawPixelTextInCanvas(GameVars.game.score, this.financesCtx, toPixelSize(1), 60, 16, "#00bcd4", 1);

        genSmallBox(this.financesCtx, 0, 20, 79, 16, toPixelSize(1), "#3e3846", "#1b1116");

        drawPixelTextInCanvas("reputation", this.financesCtx, toPixelSize(1), 22, 25, "#00bcd4", 1);
        drawPixelTextInCanvas(-GameVars.game.calculateBadReviewRatio(GameVars.game.management.iceCreamPrice), this.financesCtx, toPixelSize(1), 46, 25, "#00bcd4", 1);
        genSmallBox(this.financesCtx, 49, 22, 20, 5, toPixelSize(1), "#3e3846", "#1b1116");
        this.financesCtx.fillStyle = getRangeColor(this.game.reputation);
        this.financesCtx.fillRect(
            Math.round((49 * toPixelSize(1)) + toPixelSize(1)),
            Math.round((22 * toPixelSize(1)) + toPixelSize(1)),
            Math.round((clamp((20 * this.game.reputation) / 100, 0, 20) * toPixelSize(1)) - toPixelSize(1)),
            Math.round((5 * toPixelSize(1)) - toPixelSize(1))
        );
        drawPixelTextInCanvas(GameVars.game.calculateGoodReviewRatio(GameVars.game.management.iceCreamPrice), this.financesCtx, toPixelSize(1), 74, 25, "#00bcd4", 1);

        drawPixelTextInCanvas("icecream P.", this.financesCtx, toPixelSize(1), 23, 32, "#00bcd4", 1);
        drawPixelTextInCanvas("$" + GameVars.game.management.iceCreamPrice, this.financesCtx, toPixelSize(1), 59, 32, "#00bcd4", 1);

        drawPixelTextInCanvas("funds", this.financesCtx, toPixelSize(1), 13, 41, "#00bcd4", 1);
        drawPixelTextInCanvas("$" + GameVars.game.playerMoney, this.financesCtx, toPixelSize(1), 60, 41, GameVars.game.playerMoney < 100 ? getRangeColor(ColorType.RED) : "#00bcd4", 1);

        drawPixelTextInCanvas("rent", this.financesCtx, toPixelSize(1), 11, 49, "#00bcd4", 1);
        drawPixelTextInCanvas("$-" + GameVars.game.rentCost + "/s", this.financesCtx, toPixelSize(1), 61, 49, "#00bcd4", 1);

        drawPixelTextInCanvas("workers", this.financesCtx, toPixelSize(1), 18, 57, "#00bcd4", 1);
        drawPixelTextInCanvas("$-" + GameVars.game.management.getStaffPaymentCost() + "/s", this.financesCtx, toPixelSize(1), 61, 57, "#00bcd4", 1);

        drawPixelTextInCanvas("flour price", this.financesCtx, toPixelSize(1), 23, 65, "#00bcd4", 1);
        drawPixelTextInCanvas("$" + (GameVars.game.flourCost / 100).toFixed(2), this.financesCtx, toPixelSize(1), 60, 65, "#00bcd4", 1);

        drawPixelTextInCanvas("grain price", this.financesCtx, toPixelSize(1), 22, 73, "#00bcd4", 1);
        drawPixelTextInCanvas("$" + (GameVars.game.grainCost / 100).toFixed(2), this.financesCtx, toPixelSize(1), 60, 73, "#00bcd4", 1);
    }

    drawBoardControlBtns() {
        genSmallBox(this.zoomCtx, 0, 0, 53, 50, toPixelSize(1), "#3e3846", "#1b1116");
        genSmallBox(this.zoomCtx, 0, 10, 53, 17, toPixelSize(1), "#3e3846", "#1b1116");
        drawPixelTextInCanvas("zoom", this.zoomCtx, toPixelSize(1), 27, 6, "#00bcd4", 1);

        genSmallBox(this.zoomPlusCtx, 0, 0, 13, 13, toPixelSize(1), "#9bf2fa", this.plusClick ? "#ffffff66" : "#1b1116");
        drawPixelTextInCanvas("+", this.zoomPlusCtx, toPixelSize(1), 7, 7, "#9bf2fa", 3);

        genSmallBox(this.zoomMinusCtx, 0, 0, 13, 13, toPixelSize(1), "#9bf2fa", this.minusClick ? "#ffffff66" : "#1b1116");
        drawPixelTextInCanvas("-", this.zoomMinusCtx, toPixelSize(1), 7, 7, "#9bf2fa", 3);

        genSmallBox(this.resetLevelBtnCtx, 0, 0, 45, 16, toPixelSize(1), "#9bf2fa", this.resetClick ? "#ffffff66" : "#1b1116");
        drawPixelTextInCanvas("reset Board", this.resetLevelBtnCtx, toPixelSize(1), 23, 5, "#9bf2fa", 1);
        drawPixelTextInCanvas("position", this.resetLevelBtnCtx, toPixelSize(1), 23, 12, "#9bf2fa", 1);
    }
}
