import { TileType } from "../../enum/tile-type";
import { GameVars, toBoardPixelSize, toPixelSize } from "../../game-variables";
import { ConesMachine } from "../../sprites/tile-sprites";
import { genSmallBox } from "../../utilities/box-generator";
import { drawBalcony, drawSprite } from "../../utilities/draw-utilities";
import { createElem } from "../../utilities/elem-utilities";
import { drawPixelTextInCanvas } from "../../utilities/text";
import { Rectangle } from "../rectangle";
import { SelectionArrow } from "../selection-arrow";
import { Tile } from "./tile";

export class ConeMachine extends Tile {
    // constructor(boardX, boardY, ctx) {
    //     super(boardX, boardY, ctx);
    //     this.createInteractionBallon();
    // }

    createInteractionBallon() {
        if (!this.takeCone) {
            this.buyFlour = createElem(this.gameDiv, "canvas", null, null, toBoardPixelSize(62), toBoardPixelSize(10), GameVars.isMobile, null, () => {
                console.log("buy flour");
            });
            const buyFlourCtx = this.buyFlour.getContext("2d");
            genSmallBox(buyFlourCtx, 0, 0, 60, 9, toBoardPixelSize(1), "#000000", "#ffffff");
            drawPixelTextInCanvas("buy flour $-69", buyFlourCtx, toBoardPixelSize(1), 31, 5, "#000000", 1);

            this.takeCone = createElem(this.gameDiv, "canvas", null, null, toBoardPixelSize(44), toBoardPixelSize(12), GameVars.isMobile, null, () => {
                console.log("take cone");
            });

            this.updateInteractiveBallonPos();
            const takeConeCtx = this.takeCone.getContext("2d");

            genSmallBox(takeConeCtx, 0, 0, 41, 9, toBoardPixelSize(1), "#000000", "#ffffff");
            drawPixelTextInCanvas("take cone", takeConeCtx, toBoardPixelSize(1), 21, 5, "#000000", 1);
            genSmallBox(takeConeCtx, 40, 8, 3, 3, toBoardPixelSize(1), "#000000", "#ffffff");
        }
    }

    destroyInteractionBallon() {
        if (this.takeCone) {
            this.gameDiv.removeChild(this.buyFlour);
            this.gameDiv.removeChild(this.takeCone);
            this.buyFlour = null;
            this.takeCone = null;
        }
    }

    updateInteractiveBallonPos() {
        if (this.takeCone) {
            this.buyFlour.style.translate = (this.collisionObj.x - toBoardPixelSize(61)) + 'px ' + (this.collisionObj.y - toBoardPixelSize(23)) + 'px';
            this.takeCone.style.translate = (this.collisionObj.x - toBoardPixelSize(42)) + 'px ' + (this.collisionObj.y - toBoardPixelSize(14)) + 'px';
        }
    }

    drawBack() {
        drawBalcony(this.ctx,
            this.boardX, this.boardY, this.collisionObj.width, this.collisionObj.height,
            "#999a9e", "#3e3846", "#686b7a"
        );
        drawSprite(this.ctx, ConesMachine,
            toBoardPixelSize(1),
            (this.boardX * GameVars.tileSize) + 1,
            ((this.boardY - 1) * GameVars.tileSize),
            {
                "lc1": "#00bcd4", "dc1": "#10495e",
                "lc2": "#ffff57", "dc2": "#cd9722",
                "lc3": "#a80000", "dc3": "#641f14",
            }
        );
    }
}