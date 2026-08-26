import { TileType } from "../../enum/tile-type";
import { GameVars, toBoardPixelSize, toPixelSize } from "../../game-variables";
import { ConeWithStep3 } from "../../sprites/tile-sprites";
import { genSmallBox } from "../../utilities/box-generator";
import { drawBalcony, drawSprite } from "../../utilities/draw-utilities";
import { createElem } from "../../utilities/elem-utilities";
import { drawPixelTextInCanvas } from "../../utilities/text";
import { Rectangle } from "../rectangle";
import { SelectionArrow } from "../selection-arrow";
import { Tile } from "./tile";

export class Balcony extends Tile {
    // constructor(boardX, boardY, ctx) {
    //     super(boardX, boardY, ctx);
    //     this.createInteractionBallon();
    // }

    createInteractionBallon() {
        if (!this.interactionBallon) {
            this.interactionBallon = createElem(this.gameDiv, "canvas", null, null, toBoardPixelSize(56), toBoardPixelSize(12), GameVars.isMobile, null, () => {
                console.log("complete $69");
            });

            this.updateInteractiveBallonPos();
            const ctx = this.interactionBallon.getContext("2d");

            genSmallBox(ctx, 0, 0, 53, 9, toBoardPixelSize(1), "#000000", "#ffffff");
            drawPixelTextInCanvas("complete $69", ctx, toBoardPixelSize(1), 27, 5, "#000000", 1);
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
        this.interactionBallon && (this.interactionBallon.style.translate = (this.collisionObj.x - toBoardPixelSize(51)) + 'px ' +
            (this.collisionObj.y - toBoardPixelSize(19)) + 'px');
    }

    drawBack() {
        drawBalcony(this.ctx,
            this.boardX, this.boardY, this.collisionObj.width, this.collisionObj.height,
            "#999a9e", "#3e3846", "#686b7a"
        );
        genSmallBox(this.ctx,
            (this.boardX * GameVars.tileSize) + 1,
            ((this.boardY - 1) * GameVars.tileSize) + 3,
            13, 15,
            toBoardPixelSize(1), "#38252e", "#cbe5ff");
        genSmallBox(this.ctx,
            (this.boardX * GameVars.tileSize) + 1,
            ((this.boardY - 1) * GameVars.tileSize) + 4,
            13, 15,
            toBoardPixelSize(1), "#1b1116");
        drawSprite(this.ctx, ConeWithStep3,
            toBoardPixelSize(1),
            (this.boardX * GameVars.tileSize) + 5,
            ((this.boardY - 1) * GameVars.tileSize) + 6,
            {
                "lc1": "#00bcd4", "dc1": "#10495e",
                "lc2": "#ffff57", "dc2": "#cd9722",
                "lc3": "#a80000", "dc3": "#641f14",
            }
        );
    }
}