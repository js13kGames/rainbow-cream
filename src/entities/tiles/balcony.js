import { ColorType, getDarkColorByType, getLightColorByType } from "../../enum/color-type";
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
        const player = GameVars.game.board.player;
        if (!GameVars.game.pause) player.moveToBoardPos(this.boardX, this.boardY - 1);
        if (!this.interactionBallon && this.customer) {
            GameVars.sound.clickSound();
            this.interactionBallon = createElem(this.gameDiv, "canvas", null, null, toBoardPixelSize(56), toBoardPixelSize(19), null, () => {
                if (!GameVars.game.pause) {
                    if (this.checkIfOrderIsCorrect(player)) {
                        this.processDelivery(player);
                        if (GameVars.game.isTutorial) {
                            GameVars.game.isTutorial = false;
                        }
                    } else {
                        GameVars.sound.wrongSound();
                    }
                }
            });

            this.updateInteractiveBallonPos();
            const ctx = this.interactionBallon.getContext("2d");

            genSmallBox(ctx, 0, 0, 53, 16, toBoardPixelSize(1), "#000000", "#ffffff");
            const iceCreamPriceWithTip = GameVars.game.getIceCreamCost(this.customer);
            const iceCreamTip = iceCreamPriceWithTip - GameVars.game.management.iceCreamPrice;
            drawPixelTextInCanvas("complete $" + GameVars.game.getIceCreamCost(this.customer), ctx, toBoardPixelSize(1), 27, 5, "#000000", 1);
            drawPixelTextInCanvas("$" + GameVars.game.management.iceCreamPrice + " + " + "tip $" + iceCreamTip, ctx, toBoardPixelSize(1), 27, 12, "#000000", 1);
            genSmallBox(ctx, 52, 15, 3, 3, toBoardPixelSize(1), "#000000", "#ffffff");
        }
    }

    processDelivery(entity) {
        GameVars.sound.paySound();
        GameVars.game.collectIceCreamPayment(this.customer);

        this.customer.isOrderCompleted = true;
        this.customer.moveToBoardPos(10, 15);
        this.customer = null;

        entity.cleanOrder();

        this.destroyInteractionBallon();
    }

    checkIfOrderIsCorrect(entity) {
        if (entity.iceCreamColors.length < 3) return false;
        for (let i = 0; i < entity.iceCreamColors.length; i++) {
            if (entity.iceCreamColors[i] != this.customer.flavoursColors[i]) return false;
        }
        return true;
    }

    destroyInteractionBallon() {
        if (this.interactionBallon) {
            this.gameDiv.removeChild(this.interactionBallon);
            this.interactionBallon = null;
        }
    }

    updateInteractiveBallonPos() {
        this.interactionBallon && (this.interactionBallon.style.translate = (this.collisionObj.x - toBoardPixelSize(51)) + 'px ' +
            (this.collisionObj.y + toBoardPixelSize(16) - toBoardPixelSize(26)) + 'px');
    }

    update() {
        this.customer = GameVars.game.board.customers.find(customer => customer.boardX == this.boardX &&
            customer.boardY == this.boardY + 1 && !customer.isOrderCompleted);
        if (this.customer) {
            this.setIceScreamColors(this.customer.flavoursAmount, this.customer.flavoursColors);
            if (GameVars.game.isTutorial && !GameVars.game.board.player.hasCone) {
                GameVars.game.board.coneMachines[0].createInteractionBallon();
            }
            const newIceCreamCost = GameVars.game.getIceCreamCost(this.customer);
            if (this.interactionBallon && this.iceCreamCost != newIceCreamCost) {
                this.destroyInteractionBallon();
                this.createInteractionBallon();
            }
            this.iceCreamCost = newIceCreamCost;
        } else {
            this.destroyInteractionBallon();
        }
    }

    setIceScreamColors(flavoursAmount, iceCreamColors) {
        this.hasCone = true;
        this.iceCreamColors = this.createIceCreamColors(flavoursAmount, iceCreamColors);
    }

    createIceCreamColors(flavoursAmount, iceCreamColors) {
        switch (flavoursAmount) {
            case 0: return this.createOneColorIceCream(iceCreamColors);
            case 1: return this.createTwoColorsIceCream(iceCreamColors);
            case 2: return this.createThreeColorsIceCream(iceCreamColors);
        }
    }

    createOneColorIceCream(iceCreamColors) {
        return {
            "lc1": getLightColorByType(iceCreamColors[0]), "dc1": getDarkColorByType(iceCreamColors[0]),
            "lc2": getLightColorByType(iceCreamColors[1]), "dc2": getLightColorByType(iceCreamColors[1]),
            "lc3": getLightColorByType(iceCreamColors[2]), "dc3": getLightColorByType(iceCreamColors[2]),
        };
    }

    createTwoColorsIceCream(iceCreamColors) {
        return {
            "lc1": getLightColorByType(iceCreamColors[0]), "dc1": getDarkColorByType(iceCreamColors[0]),
            "lc2": getLightColorByType(iceCreamColors[1]), "dc2": getDarkColorByType(iceCreamColors[1]),
            "lc3": getLightColorByType(iceCreamColors[2]), "dc3": getLightColorByType(iceCreamColors[2]),
        };
    }

    createThreeColorsIceCream(iceCreamColors) {
        return {
            "lc1": getLightColorByType(iceCreamColors[0]), "dc1": getDarkColorByType(iceCreamColors[0]),
            "lc2": getLightColorByType(iceCreamColors[1]), "dc2": getDarkColorByType(iceCreamColors[1]),
            "lc3": getLightColorByType(iceCreamColors[2]), "dc3": getDarkColorByType(iceCreamColors[2]),
        };
    }

    drawBack() {
        drawBalcony(this.ctx,
            this.boardX, this.boardY, toBoardPixelSize(16), toBoardPixelSize(16),
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

        if (this.customer) {
            drawSprite(this.ctx, ConeWithStep3,
                toBoardPixelSize(1),
                (this.boardX * GameVars.tileSize) + 5,
                ((this.boardY - 1) * GameVars.tileSize) + 6,
                this.iceCreamColors
            );
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