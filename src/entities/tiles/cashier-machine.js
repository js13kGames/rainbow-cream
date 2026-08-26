import { TileType } from "../../enum/tile-type";
import { GameVars, toBoardPixelSize, toPixelSize } from "../../game-variables";
import { Cashier } from "../../sprites/tile-sprites";
import { genSmallBox } from "../../utilities/box-generator";
import { drawBalcony, drawSprite } from "../../utilities/draw-utilities";
import { createElem } from "../../utilities/elem-utilities";
import { drawPixelTextInCanvas } from "../../utilities/text";
import { Rectangle } from "../rectangle";
import { SelectionArrow } from "../selection-arrow";
import { Tile } from "./tile";

export class CashierMachine extends Tile {
    createInteractionBallon() {
        if (!this.interactionBallon) {
            this.interactionBallon = createElem(this.gameDiv, "canvas", null, null, toBoardPixelSize(44), toBoardPixelSize(12), GameVars.isMobile, null, () => {
                console.log("take order");
            });

            this.updateInteractiveBallonPos();
            const ctx = this.interactionBallon.getContext("2d");

            genSmallBox(ctx, 0, 0, 41, 9, toBoardPixelSize(1), "#000000", "#ffffff");
            drawPixelTextInCanvas("take order", ctx, toBoardPixelSize(1), 21, 5, "#000000", 1);
            genSmallBox(ctx, 40, 8, 3, 3, toBoardPixelSize(1), "#000000", "#ffffff");
        }
    }

    destroyInteractionBallon() {
        if (this.interactionBallon) {
            this.gameDiv.removeChild(this.interactionBallon);
            this.interactionBallon = null;
        }
    }

    updateInteractiveBallonPos() {
        this.interactionBallon && (this.interactionBallon.style.translate = (this.collisionObj.x - toBoardPixelSize(42)) + 'px ' +
            (this.collisionObj.y - toBoardPixelSize(14)) + 'px');
    }

    drawBack() {
        drawBalcony(this.ctx,
            this.boardX, this.boardY, this.collisionObj.width, this.collisionObj.height,
            "#999a9e", "#3e3846", "#686b7a"
        );
        drawSprite(this.ctx, Cashier,
            toBoardPixelSize(1),
            (this.boardX * GameVars.tileSize) + 1,
            ((this.boardY - 1) * GameVars.tileSize) + 8,
            {
                "lc1": "#00bcd4", "dc1": "#10495e",
                "lc2": "#ffff57", "dc2": "#cd9722",
                "lc3": "#a80000", "dc3": "#641f14",
            }
        );
    }
}