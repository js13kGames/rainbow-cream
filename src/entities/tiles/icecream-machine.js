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
import { Tile } from "./tile";

export class IceCreamMachine extends Tile {
    constructor(boardX, boardY, ctx) {
        super(boardX, boardY, ctx);
        this.consumption = 8;
        this.feedAmount = 100;
        this.iceCreamAmount = 100;
        this.productionTimer = 0;
    }

    createCollisionBox() {
        return new Rectangle(
            toBoardPixelSize(this.boardX * GameVars.tileSize),
            toBoardPixelSize((this.boardY - 1) * GameVars.tileSize),
            toBoardPixelSize(GameVars.tileSize),
            toBoardPixelSize(32)
        );
    }

    setCreamColor(color) {
        this.iceCreamColor = color;
    }

    createInteractionBallon() {
        this.feedGrainClick = false;
        this.takeIcecreamClick = false;
        const player = GameVars.game.board.player;
        if (!GameVars.game.pause) player.moveToBoardPos(this.boardX, this.boardY + 1);
        if (!this.takeIcecreamCanv) {
            GameVars.sound.clickSound();
            this.feedGrainCanv = createElem(this.gameDiv, "canvas", null, null, toBoardPixelSize(61), toBoardPixelSize(10), null, () => {
                this.feedGrainClick = true;
                if (!GameVars.game.pause) {
                    GameVars.sound.clickSound();
                    this.feedGrain();
                }
            }, () => setTimeout(() => this.feedGrainClick = false, 50));
            this.feedGrainCtx = this.feedGrainCanv.getContext("2d");

            this.takeIcecreamCanv = createElem(this.gameDiv, "canvas", null, null, toBoardPixelSize(56), toBoardPixelSize(12), null, () => {
                this.takeIcecreamClick = true;
                if (!GameVars.game.pause) {
                    if (player.hasCone && this.iceCreamAmount >= this.consumption && player.iceCreamColors.length < 3) {
                        GameVars.sound.clickSound();
                        this.iceCreamAmount = clamp(this.iceCreamAmount - this.consumption, 0, 100);
                        player.collectIceCream(this.iceCreamColor);
                        if (GameVars.game.isTutorial) {
                            this.destroyInteractionBallon();
                            if (player.iceCreamColors.length == 1) this.activateTutorialIceCreamMachine(ColorType.YELLOW);
                            else if (player.iceCreamColors.length == 2) this.activateTutorialIceCreamMachine(ColorType.RED);
                            else if (player.iceCreamColors.length == 3) {
                                GameVars.game.board.balconies.find(b => b.customer)?.createInteractionBallon();
                            }
                        }
                    } else {
                        GameVars.sound.wrongSound();
                    }
                }
            }, () => setTimeout(() => this.takeIcecreamClick = false, 50));
            this.updateInteractiveBallonPos();
            this.takeIcecreamCtx = this.takeIcecreamCanv.getContext("2d");
        }
    }

    feedGrain() {
        GameVars.game.pay(this.grainPrice());
        this.feedAmount = 100;
    }

    grainPrice() {
        const grainPerc = (100 - this.feedAmount) / 100
        return Math.round(GameVars.game.grainCost * grainPerc);
    }

    activateTutorialIceCreamMachine(color) {
        GameVars.game.board.iceCreamMachines[color].createInteractionBallon();
    }

    destroyInteractionBallon() {
        if (this.takeIcecreamCanv) {
            this.gameDiv.removeChild(this.feedGrainCanv);
            this.gameDiv.removeChild(this.takeIcecreamCanv);
            this.feedGrainCanv = null;
            this.takeIcecreamCanv = null;
        }
    }

    updateInteractiveBallonPos() {
        if (this.takeIcecreamCanv) {
            this.feedGrainCanv.style.translate = (this.collisionObj.x - toBoardPixelSize(61)) + 'px ' + (this.collisionObj.y + toBoardPixelSize(8) - toBoardPixelSize(25)) + 'px';
            this.takeIcecreamCanv.style.translate = (this.collisionObj.x - toBoardPixelSize(54)) + 'px ' + (this.collisionObj.y + toBoardPixelSize(8) - toBoardPixelSize(16)) + 'px';
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
            this.feedAmount = clamp(this.feedAmount - GameVars.game.management.unicornGrainConsumption(this.iceCreamColor), 0, 100);
            this.iceCreamAmount = clamp(this.iceCreamAmount + GameVars.game.management.unicornIceCreamProduction(this.iceCreamColor), 0, 100);
        }
    }

    drawBack() {
        drawBalcony(this.ctx,
            this.boardX, this.boardY, toBoardPixelSize(16), toBoardPixelSize(16),
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
        this.drawInteractionBallon();
    }

    drawInteractionBallon() {
        if (this.takeIcecreamCanv) {
            this.feedGrainCtx.clearRect(0, 0, this.feedGrainCanv.width, this.feedGrainCanv.height);
            genSmallBox(this.feedGrainCtx, 0, 0, 60, 9, toBoardPixelSize(1), "#000000", this.feedGrainClick ? "#ffffff66" : "#ffffff");
            drawPixelTextInCanvas("feed grain $-" + this.grainPrice(), this.feedGrainCtx, toBoardPixelSize(1), 30, 5, "#000000", 1);

            this.takeIcecreamCtx.clearRect(0, 0, this.takeIcecreamCanv.width, this.takeIcecreamCanv.height);
            genSmallBox(this.takeIcecreamCtx, 0, 0, 53, 9, toBoardPixelSize(1), "#000000", this.takeIcecreamClick ? "#ffffff66" : "#ffffff");
            drawPixelTextInCanvas("take icecream", this.takeIcecreamCtx, toBoardPixelSize(1), 27, 5, "#000000", 1);
            genSmallBox(this.takeIcecreamCtx, 52, 8, 3, 3, toBoardPixelSize(1), "#000000", "#ffffff");
        }
    }

    drawHighlight(color) {
        this.ctx.fillStyle = color + "66";
        this.ctx.fillRect(
            toBoardPixelSize(this.boardX * GameVars.tileSize),
            toBoardPixelSize(this.boardY * GameVars.tileSize),
            toBoardPixelSize(GameVars.tileSize),
            toBoardPixelSize(GameVars.tileSize)
        );
    }
}