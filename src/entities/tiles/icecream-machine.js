import { TileType } from "../../enum/tile-type";
import { GameVars, toBoardPixelSize, toPixelSize } from "../../game-variables";
import { Unicorn } from "../../sprites/tile-sprites";
import { genSmallBox } from "../../utilities/box-generator";
import { drawBalcony, drawSprite } from "../../utilities/draw-utilities";
import { createElem } from "../../utilities/elem-utilities";
import { drawPixelTextInCanvas } from "../../utilities/text";
import { Rectangle } from "../rectangle";
import { SelectionArrow } from "../selection-arrow";
import { Tile } from "./tile";

export class IceCreamMachine extends Tile {
    // constructor(boardX, boardY, ctx) {
    //     super(boardX, boardY, ctx);
    //     this.createInteractionBallon();
    // }

    setCreamColor(lightColor, darkColor) {
        this.lightColor = lightColor;
        this.darkColor = darkColor;
    }

    createInteractionBallon() {
        if (!this.takeIcecream) {
            this.feedGrain = createElem(this.gameDiv, "canvas", null, null, toBoardPixelSize(61), toBoardPixelSize(10), GameVars.isMobile, null, () => {
                console.log("feed grain");
            });
            const feedGrainCtx = this.feedGrain.getContext("2d");
            genSmallBox(feedGrainCtx, 0, 0, 60, 9, toBoardPixelSize(1), "#000000", "#ffffff");
            drawPixelTextInCanvas("feed grain $-69", feedGrainCtx, toBoardPixelSize(1), 30, 5, "#000000", 1);

            this.takeIcecream = createElem(this.gameDiv, "canvas", null, null, toBoardPixelSize(56), toBoardPixelSize(12), GameVars.isMobile, null, () => {
                console.log("take icecream");
            });

            this.updateInteractiveBallonPos();
            const takeIcecreamCtx = this.takeIcecream.getContext("2d");

            genSmallBox(takeIcecreamCtx, 0, 0, 53, 9, toBoardPixelSize(1), "#000000", "#ffffff");
            drawPixelTextInCanvas("take icecream", takeIcecreamCtx, toBoardPixelSize(1), 27, 5, "#000000", 1);
            genSmallBox(takeIcecreamCtx, 52, 8, 3, 3, toBoardPixelSize(1), "#000000", "#ffffff");
        }
    }

    destroyInteractionBallon() {
        if (this.takeIcecream) {
            this.gameDiv.removeChild(this.feedGrain);
            this.gameDiv.removeChild(this.takeIcecream);
            this.feedGrain = null;
            this.takeIcecream = null;
        }
    }

    updateInteractiveBallonPos() {
        if (this.takeIcecream) {
            this.feedGrain.style.translate = (this.collisionObj.x - toBoardPixelSize(61)) + 'px ' + (this.collisionObj.y - toBoardPixelSize(25)) + 'px';
            this.takeIcecream.style.translate = (this.collisionObj.x - toBoardPixelSize(54)) + 'px ' + (this.collisionObj.y - toBoardPixelSize(16)) + 'px';
        }
    }

    drawBack() {
        drawBalcony(this.ctx,
            this.boardX, this.boardY, this.collisionObj.width, this.collisionObj.height,
            "#999a9e", "#3e3846", "#686b7a"
        );
        drawSprite(this.ctx, Unicorn,
            toBoardPixelSize(1),
            (this.boardX * GameVars.tileSize),
            ((this.boardY - 1) * GameVars.tileSize),
            {
                "lc": this.lightColor, "dc": this.darkColor,
            }
        );
    }
}