import { TileType } from "../../enum/tile-type";
import { GameVars, toBoardPixelSize } from "../../game-variables";
import { Bin } from "../../sprites/tile-sprites";
import { genSmallBox } from "../../utilities/box-generator";
import { drawFloor, drawSprite } from "../../utilities/draw-utilities";
import { createElem } from "../../utilities/elem-utilities";
import { drawPixelTextInCanvas } from "../../utilities/text";
import { Rectangle } from "../rectangle";
import { Tile } from "./tile";

export class BinTile extends Tile {
    createInteractionBallon() {
        this.orderClick = false;
        if (!GameVars.game.pause) GameVars.game.board.player.moveToBoardPos(this.boardX - 1, this.boardY);
        if (!this.interactionBallon) {
            GameVars.sound.clickSound();
            this.interactionBallon = createElem(this.gameDiv, "canvas", null, null, toBoardPixelSize(56), toBoardPixelSize(12), null, () => {
                this.orderClick = true;
                if (!GameVars.game.pause) {
                    GameVars.sound.clickSound();
                    GameVars.game.board.player.cleanOrder();
                    this.destroyInteractionBallon();
                }
            }, () => setTimeout(() => this.orderClick = false, 50));
            this.updateInteractiveBallonPos();
            this.interactionBallonCtx = this.interactionBallon.getContext("2d");
        }
    }

    destroyInteractionBallon() {
        if (this.interactionBallon) {
            this.gameDiv.removeChild(this.interactionBallon);
            this.interactionBallon = null;
        }
    }

    updateInteractiveBallonPos() {
        this.interactionBallon && (this.interactionBallon.style.translate = (this.collisionObj.x - toBoardPixelSize(52)) + 'px ' +
            (this.collisionObj.y - toBoardPixelSize(12)) + 'px');
    }

    drawBack() {
        drawFloor(this.ctx,
            this.boardX, this.boardY,
            this.collisionObj.width, this.collisionObj.height,
            "#474747", "#515151", "#38252e", "#1b1116"
        );
        drawSprite(this.ctx, Bin,
            toBoardPixelSize(1),
            (this.boardX * GameVars.tileSize) + 4,
            (this.boardY * GameVars.tileSize) + 1
        );
        this.drawInteractionBallon();
    }

    drawInteractionBallon() {
        if (this.interactionBallon) {
            this.interactionBallonCtx.clearRect(0, 0, this.interactionBallon.width, this.interactionBallon.height);
            genSmallBox(this.interactionBallonCtx, 0, 0, 53, 9, toBoardPixelSize(1), "#000000", this.orderClick ? "#00bcd4" : "#ffffff");
            drawPixelTextInCanvas("dispose waste", this.interactionBallonCtx, toBoardPixelSize(1), 27, 5, "#000000", 1);
            genSmallBox(this.interactionBallonCtx, 52, 8, 3, 3, toBoardPixelSize(1), "#000000", "#ffffff");
        }
    }
}