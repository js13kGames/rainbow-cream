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

    createInteractionBallon() {
        if (!this.interactionBallon && this.customer) {
            this.interactionBallon = createElem(this.gameDiv, "canvas", null, null, toBoardPixelSize(56), toBoardPixelSize(12), GameVars.isMobile, null, () => {
                const player = GameVars.game.board.player;
                player.moveToBoardPos(this.boardX, this.boardY - 1);
                if (this.checkIfOrderIsCorrect(player)) {
                    GameVars.game.collectIceCreamPayment(this.customer.patienceLevel);

                    const customerIndex = GameVars.game.board.customers.indexOf(this.customer);
                    GameVars.game.board.customers.splice(customerIndex, 1);

                    this.customer = null;

                    player.cleanOrder();

                    this.destroyInteractionBallon();

                    if (GameVars.game.isTutorial) GameVars.game.isTutorial = false;

                    // give money to player
                    // if happy gives extra money
                } else {
                    // error wrong order etc
                }
            });

            this.updateInteractiveBallonPos();
            const ctx = this.interactionBallon.getContext("2d");

            genSmallBox(ctx, 0, 0, 53, 9, toBoardPixelSize(1), "#000000", "#ffffff");
            drawPixelTextInCanvas("complete $" + GameVars.game.getIceCreamCost(this.customer.patienceLevel), ctx, toBoardPixelSize(1), 27, 5, "#000000", 1);
            genSmallBox(ctx, 52, 8, 3, 3, toBoardPixelSize(1), "#000000", "#ffffff");
        }
    }

    checkIfOrderIsCorrect(player) {
        for (let i = 0; i < player.iceCreamColors.length; i++) {
            if (player.iceCreamColors[i] != this.customer.flavoursColors[i]) return false;
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
            (this.collisionObj.y - toBoardPixelSize(19)) + 'px');
    }

    update() {
        this.customer = GameVars.game.board.customers.find(customer => customer.boardX == this.boardX && customer.boardY == this.boardY + 1);
        if (this.customer) {
            this.setIceScreamColors(this.customer.flavoursAmount, this.customer.flavoursColors);
            if (GameVars.game.isTutorial && !GameVars.game.board.player.hasCone) {
                GameVars.game.board.coneMachines[0].createInteractionBallon();
            }
            const newIceCreamCost = GameVars.game.getIceCreamCost(this.customer.patienceLevel);
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
            case 2: return this.createThreeColorsIceCream();
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

    createThreeColorsIceCream() {
        return {
            "lc1": "#00bcd4", "dc1": "#10495e",
            "lc2": "#ffff57", "dc2": "#cd9722",
            "lc3": "#a80000", "dc3": "#641f14",
        };
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

        if (this.customer) {
            drawSprite(this.ctx, ConeWithStep3,
                toBoardPixelSize(1),
                (this.boardX * GameVars.tileSize) + 5,
                ((this.boardY - 1) * GameVars.tileSize) + 6,
                this.iceCreamColors
            );
        }
    }
}