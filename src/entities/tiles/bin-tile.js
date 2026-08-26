import { TileType } from "../../enum/tile-type";
import { GameVars, toBoardPixelSize } from "../../game-variables";
import { Bin } from "../../sprites/tile-sprites";
import { genSmallBox } from "../../utilities/box-generator";
import { drawFloor, drawSprite } from "../../utilities/draw-utilities";
import { createElem } from "../../utilities/elem-utilities";
import { drawPixelTextInCanvas } from "../../utilities/text";
import { Rectangle } from "../rectangle";
import { SelectionArrow } from "../selection-arrow";
import { Tile } from "./tile";

export class BinTile extends Tile {
    // constructor(boardX, boardY, ctx) {
    //     super(boardX, boardY, ctx);
    //     this.createInteractionBallon();
    // }

    createInteractionBallon() {
        if (!this.interactionBallon) {
            this.interactionBallon = createElem(this.gameDiv, "canvas", null, null, toBoardPixelSize(56), toBoardPixelSize(12), GameVars.isMobile, null, () => {
                console.log("dispose waste");
            });

            this.updateInteractiveBallonPos();
            const ctx = this.interactionBallon.getContext("2d");

            genSmallBox(ctx, 0, 0, 53, 9, toBoardPixelSize(1), "#000000", "#ffffff");
            drawPixelTextInCanvas("dispose waste", ctx, toBoardPixelSize(1), 27, 5, "#000000", 1);
            genSmallBox(ctx, 52, 8, 3, 3, toBoardPixelSize(1), "#000000", "#ffffff");
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
    }
}