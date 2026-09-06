import { ColorType, getRangeColor } from "../../enum/color-type";
import { TileType } from "../../enum/tile-type";
import { GameVars, toBoardPixelSize, toPixelSize } from "../../game-variables";
import { ConesMachine } from "../../sprites/tile-sprites";
import { genSmallBox } from "../../utilities/box-generator";
import { drawBalcony, drawSprite } from "../../utilities/draw-utilities";
import { createElem } from "../../utilities/elem-utilities";
import { clamp } from "../../utilities/general-utilities";
import { drawPixelTextInCanvas } from "../../utilities/text";
import { Rectangle } from "../rectangle";
import { Tile } from "./tile";

export class ConeMachine extends Tile {
    constructor(boardX, boardY, ctx) {
        super(boardX, boardY, ctx);
        this.consumption = 10;
        this.flourAmount = 100;
    }

    createCollisionBox() {
        return new Rectangle(
            toBoardPixelSize(this.boardX * GameVars.tileSize),
            toBoardPixelSize((this.boardY - 1) * GameVars.tileSize),
            toBoardPixelSize(GameVars.tileSize),
            toBoardPixelSize(32)
        );
    }

    createInteractionBallon() {
        this.buyFlourClick = false;
        this.takeConeClick = false;
        const player = GameVars.game.board.player;
        if (!GameVars.game.pause) player.moveToBoardPos(this.boardX, this.boardY + 1);
        if (!this.takeCone) {
            GameVars.sound.clickSound();
            this.buyFlour = createElem(this.gameDiv, "canvas", null, null, toBoardPixelSize(62), toBoardPixelSize(10), null, () => {
                this.buyFlourClick = true;
                if (!GameVars.game.pause) {
                    GameVars.sound.clickSound();
                    this.addFlour();
                }
            }, () => setTimeout(() => this.buyFlourClick = false, 50));
            this.buyFlourCtx = this.buyFlour.getContext("2d");

            this.takeCone = createElem(this.gameDiv, "canvas", null, null, toBoardPixelSize(44), toBoardPixelSize(12), null, () => {
                this.takeConeClick = true;
                if (!GameVars.game.pause) {
                    if (!player.hasCone && this.flourAmount >= this.consumption) {
                        GameVars.sound.clickSound();
                        this.flourAmount = clamp(this.flourAmount - this.consumption, 0, 100);
                        player.collectCone();
                        this.destroyInteractionBallon();
                        if (GameVars.game.isTutorial) {
                            GameVars.game.board.iceCreamMachines[ColorType.BLUE].createInteractionBallon();
                        }
                    } else {
                        GameVars.sound.wrongSound();
                    }
                }
            }, () => setTimeout(() => this.takeConeClick = false, 50));
            this.updateInteractiveBallonPos();
            this.takeConeCtx = this.takeCone.getContext("2d");
        }
    }

    addFlour() {
        GameVars.game.pay(this.flourPrice());
        this.flourAmount = 100;
    }

    flourPrice() {
        const flourPerc = (100 - this.flourAmount) / 100
        return Math.round(GameVars.game.flourCost * flourPerc);
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
            this.buyFlour.style.translate = (this.collisionObj.x - toBoardPixelSize(61)) + 'px ' + (this.collisionObj.y + toBoardPixelSize(8) - toBoardPixelSize(23)) + 'px';
            this.takeCone.style.translate = (this.collisionObj.x - toBoardPixelSize(42)) + 'px ' + (this.collisionObj.y + toBoardPixelSize(8) - toBoardPixelSize(14)) + 'px';
        }
    }

    drawBack() {
        drawBalcony(this.ctx,
            this.boardX, this.boardY, toBoardPixelSize(16), toBoardPixelSize(16),
            "#999a9e", "#3e3846", "#686b7a"
        );
        drawSprite(this.ctx, ConesMachine,
            toBoardPixelSize(1),
            (this.boardX * GameVars.tileSize) + 1,
            ((this.boardY - 1) * GameVars.tileSize)
        );

        genSmallBox(this.ctx,
            (this.boardX * GameVars.tileSize) + 1,
            (this.boardY * GameVars.tileSize) - 20,
            13, 3,
            toBoardPixelSize(1), "#000000", "#1b1116");

        this.ctx.fillStyle = getRangeColor(this.flourAmount);
        this.ctx.fillRect(
            toBoardPixelSize((this.boardX * GameVars.tileSize) + 2),
            toBoardPixelSize((this.boardY * GameVars.tileSize) - 19),
            toBoardPixelSize((12 * this.flourAmount) / 100), toBoardPixelSize(2)
        );
        this.drawInteractionBallon();
    }

    drawInteractionBallon() {
        if (this.takeCone) {
            this.buyFlourCtx.clearRect(0, 0, this.buyFlour.width, this.buyFlour.height);
            genSmallBox(this.buyFlourCtx, 0, 0, 60, 9, toBoardPixelSize(1), "#000000", this.buyFlourClick ? "#00bcd4" : "#ffffff");
            drawPixelTextInCanvas("add flour $-" + this.flourPrice(), this.buyFlourCtx, toBoardPixelSize(1), 31, 5, "#000000", 1);

            this.takeConeCtx.clearRect(0, 0, this.takeCone.width, this.takeCone.height);
            genSmallBox(this.takeConeCtx, 0, 0, 41, 9, toBoardPixelSize(1), "#000000", this.takeConeClick ? "#00bcd4" : "#ffffff");
            drawPixelTextInCanvas("take cone", this.takeConeCtx, toBoardPixelSize(1), 21, 5, "#000000", 1);
            genSmallBox(this.takeConeCtx, 40, 8, 3, 3, toBoardPixelSize(1), "#000000", "#ffffff");
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