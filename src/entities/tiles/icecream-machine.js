import { ColorType, getDarkColorByType, getLightColorByType, getRangeColor } from "../../enum/color-type";
import { TileType } from "../../enum/tile-type";
import { GameVars, toBoardPixelSize, toPixelSize } from "../../game-variables";
import { Unicorn } from "../../sprites/tile-sprites";
import { genSmallBox } from "../../utilities/box-generator";
import { drawBalcony, drawSprite } from "../../utilities/draw-utilities";
import { createElem } from "../../utilities/elem-utilities";
import { clamp } from "../../utilities/general-utilities";
import { drawPixelTextInCanvas } from "../../utilities/text";
import { Rectangle } from "../rectangle";
import { SelectionArrow } from "../selection-arrow";
import { Tile } from "./tile";

export class IceCreamMachine extends Tile {
    constructor(boardX, boardY, ctx) {
        super(boardX, boardY, ctx);
        this.feedAmount = 100;
        this.iceCreamAmount = 100;
        this.productionTimer = 0;
    }

    setCreamColor(color) {
        this.iceCreamColor = color;
    }

    createInteractionBallon() {
        if (!this.takeIcecream) {
            this.feedGrain = createElem(this.gameDiv, "canvas", null, null, toBoardPixelSize(61), toBoardPixelSize(10), GameVars.isMobile, null, () => {
                const player = GameVars.game.board.player;
                player.moveToBoardPos(this.boardX, this.boardY + 1);
                GameVars.game.pay(this.grainPrice());
                this.feedAmount = 100;
            });
            const feedGrainCtx = this.feedGrain.getContext("2d");
            genSmallBox(feedGrainCtx, 0, 0, 60, 9, toBoardPixelSize(1), "#000000", "#ffffff");
            drawPixelTextInCanvas("feed grain $-" + this.grainPrice(), feedGrainCtx, toBoardPixelSize(1), 30, 5, "#000000", 1);

            this.takeIcecream = createElem(this.gameDiv, "canvas", null, null, toBoardPixelSize(56), toBoardPixelSize(12), GameVars.isMobile, null, () => {
                const player = GameVars.game.board.player;
                player.moveToBoardPos(this.boardX, this.boardY + 1);
                if (player.hasCone && this.iceCreamAmount > 10) {
                    this.iceCreamAmount = clamp(this.iceCreamAmount - 10, 0, 100);
                    player.collectIceCream(this.iceCreamColor);
                    if (GameVars.game.isTutorial) {
                        this.destroyInteractionBallon();
                        if (player.iceCreamColors.length == 1) this.activateTutorialIceCreamMachine(ColorType.YELLOW);
                        else if (player.iceCreamColors.length == 2) this.activateTutorialIceCreamMachine(ColorType.RED);
                        else if (player.iceCreamColors.length == 3) {
                            GameVars.game.board.balconies.find(b => b.customer)?.createInteractionBallon();
                        }
                    }
                }
            });

            this.updateInteractiveBallonPos();
            const takeIcecreamCtx = this.takeIcecream.getContext("2d");

            genSmallBox(takeIcecreamCtx, 0, 0, 53, 9, toBoardPixelSize(1), "#000000", "#ffffff");
            drawPixelTextInCanvas("take icecream", takeIcecreamCtx, toBoardPixelSize(1), 27, 5, "#000000", 1);
            genSmallBox(takeIcecreamCtx, 52, 8, 3, 3, toBoardPixelSize(1), "#000000", "#ffffff");
        }
    }

    grainPrice() {
        const grainPerc = (100 - this.feedAmount) / 100
        return GameVars.game.grainCost * grainPerc;
    }

    activateTutorialIceCreamMachine(color) {
        GameVars.game.board.iceCreamMachine[color].createInteractionBallon();
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

    update() {
        if (this.productionTimer >= 1) {
            this.productionTimer -= 1;
            this.produceIceCream();
        } else {
            this.productionTimer += GameVars.deltaTime;
        }
    }

    produceIceCream() {
        if (this.iceCreamAmount < 100 && this.feedAmount > 0) {
            this.feedAmount = clamp(this.feedAmount - 2, 0, 100);
            this.iceCreamAmount = clamp(this.iceCreamAmount + 1, 0, 100);
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
                "lc": getLightColorByType(this.iceCreamColor),
                "dc": getDarkColorByType(this.iceCreamColor),
            }
        );

        genSmallBox(this.ctx,
            (this.boardX * GameVars.tileSize) + 1,
            (this.boardY * GameVars.tileSize) - 23,
            13, 3,
            toBoardPixelSize(1), "#000000", "#1b1116");

        this.ctx.fillStyle = getRangeColor(this.feedAmount);
        this.ctx.fillRect(
            toBoardPixelSize((this.boardX * GameVars.tileSize) + 2),
            toBoardPixelSize((this.boardY * GameVars.tileSize) - 22),
            toBoardPixelSize((12 * this.feedAmount) / 100), toBoardPixelSize(2)
        );

        genSmallBox(this.ctx,
            (this.boardX * GameVars.tileSize) + 1,
            (this.boardY * GameVars.tileSize) - 20,
            13, 3,
            toBoardPixelSize(1), "#000000", "#1b1116");

        this.ctx.fillStyle = getLightColorByType(this.iceCreamColor);
        this.ctx.fillRect(
            toBoardPixelSize((this.boardX * GameVars.tileSize) + 2),
            toBoardPixelSize((this.boardY * GameVars.tileSize) - 19),
            toBoardPixelSize((12 * this.iceCreamAmount) / 100), toBoardPixelSize(2)
        );
    }
}