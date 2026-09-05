import { TileType } from "../../enum/tile-type";
import { GameVars, toBoardPixelSize, toPixelSize } from "../../game-variables";
import { Cashier } from "../../sprites/tile-sprites";
import { genSmallBox } from "../../utilities/box-generator";
import { drawBalcony, drawSprite } from "../../utilities/draw-utilities";
import { createElem } from "../../utilities/elem-utilities";
import { drawPixelTextInCanvas } from "../../utilities/text";
import { Rectangle } from "../rectangle";
import { Tile } from "./tile";

export class CashierMachine extends Tile {
    constructor(boardX, boardY, ctx) {
        super(boardX, boardY, ctx);
        this.customer = null;
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
        this.orderClick = false;
        if (!GameVars.game.pause) GameVars.game.board.player.moveToBoardPos(this.boardX, this.boardY - 1);
        if (!this.interactionBallon) {
            GameVars.sound.clickSound();
            this.interactionBallon = createElem(this.gameDiv, "canvas", null, null, toBoardPixelSize(44), toBoardPixelSize(12), null, () => {
                this.orderClick = true;
                if (!GameVars.game.pause) {
                    if (this.hasClient()) {
                        GameVars.sound.clickSound();
                        this.moveClient();
                        this.destroyInteractionBallon();
                    }
                }
            }, () => setTimeout(() => this.orderClick = false, 50));
            this.updateInteractiveBallonPos();
            this.interactionBallonCtx = this.interactionBallon.getContext("2d");
        }
    }

    hasClient() {
        this.availableBalcony = GameVars.game.board.balconies.find(b => !b.customer);
        this.customer = GameVars.game.board.customers.find(customer => customer.boardX == this.boardX && customer.boardY == this.boardY + 1);
        return this.availableBalcony && this.customer;
    }

    moveClient() {
        this.customer.moveToBoardPos(this.availableBalcony.boardX, this.boardY + 1);
        this.customer.increasePatience();
        this.customer = null;
    }

    destroyInteractionBallon() {
        if (this.interactionBallon) {
            this.gameDiv.removeChild(this.interactionBallon);
            this.interactionBallon = null;
        }
    }

    updateInteractiveBallonPos() {
        this.interactionBallon && (this.interactionBallon.style.translate = (this.collisionObj.x - toBoardPixelSize(42)) + 'px ' +
            (this.collisionObj.y + toBoardPixelSize(8) - toBoardPixelSize(14)) + 'px');
    }

    drawBack() {
        drawBalcony(this.ctx,
            this.boardX, this.boardY, toBoardPixelSize(16), toBoardPixelSize(16),
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
        this.drawInteractionBallon();
    }

    drawInteractionBallon() {
        if (this.interactionBallon) {
            this.interactionBallonCtx.clearRect(0, 0, this.interactionBallon.width, this.interactionBallon.height);
            genSmallBox(this.interactionBallonCtx, 0, 0, 41, 9, toBoardPixelSize(1), "#000000", this.orderClick ? "#ffffff66" : "#ffffff");
            drawPixelTextInCanvas("take order", this.interactionBallonCtx, toBoardPixelSize(1), 21, 5, "#000000", 1);
            genSmallBox(this.interactionBallonCtx, 40, 8, 3, 3, toBoardPixelSize(1), "#000000", "#ffffff");
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