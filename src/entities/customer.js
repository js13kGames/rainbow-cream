import { ColorType, getDarkColorByType, getLightColorByType, getRangeColor } from "../enum/color-type";
import { GameVars, toBoardPixelSize } from "../game-variables";
import { Character } from "../sprites/tile-sprites";
import { genSmallBox } from "../utilities/box-generator";
import { drawSprite } from "../utilities/draw-utilities";
import { clamp, randomNumb } from "../utilities/general-utilities";

export class Customer {
    constructor(boardX, boardY, ctx) {
        this.boardX = boardX;
        this.boardY = boardY;
        this.ctx = ctx;
        this.flavoursAmount = GameVars.game.isTutorial ? 2 : randomNumb(3);
        this.flavoursColors = this.createIceCreamColors();
        this.patienceLevel = 100;
        this.productionTimer = 0;
    }

    createIceCreamColors() {
        switch (this.flavoursAmount) {
            case 0: return this.createOneColorIceCream();
            case 1: return this.createTwoColorsIceCream();
            case 2: return [ColorType.BLUE, ColorType.YELLOW, ColorType.RED];;
        }
    }

    createOneColorIceCream() {
        const randomColor = randomNumb(3);
        return [randomColor, randomColor, randomColor];
    }

    createTwoColorsIceCream() {
        const randomColor1 = randomNumb(3);
        let randomColor2 = randomNumb(3);
        while (randomColor2 == randomColor1) randomColor2 = randomNumb(3);
        return [randomColor1, randomColor2, randomColor2];
    }

    moveToBoardPos(boardX, boardY) {
        this.boardX = boardX;
        this.boardY = boardY;
    }

    update() {
        if (this.productionTimer >= 1) {
            this.productionTimer -= 1;
            this.patienceLevel = clamp(this.patienceLevel - 5, 0, 100);
            if (this.patienceLevel == 0) {
                const customerIndex = GameVars.game.board.customers.indexOf(this.customer);
                GameVars.game.board.customers.splice(customerIndex, 1);
            }
        } else {
            this.productionTimer += GameVars.deltaTime;
        }
    }

    draw() {
        genSmallBox(this.ctx,
            (this.boardX * GameVars.tileSize) + 2,
            (this.boardY * GameVars.tileSize) + 5,
            11, 7,
            toBoardPixelSize(1), "#00000066", "#00000066");
        drawSprite(this.ctx, Character,
            toBoardPixelSize(1),
            (this.boardX * GameVars.tileSize) + 3,
            (this.boardY * GameVars.tileSize) - 12
        );

        genSmallBox(this.ctx,
            (this.boardX * GameVars.tileSize) + 1,
            (this.boardY * GameVars.tileSize) - 16,
            13, 3,
            toBoardPixelSize(1), "#000000", "#1b1116");

        this.ctx.fillStyle = getRangeColor(this.patienceLevel);
        this.ctx.fillRect(
            toBoardPixelSize((this.boardX * GameVars.tileSize) + 2),
            toBoardPixelSize((this.boardY * GameVars.tileSize) - 15),
            toBoardPixelSize((12 * this.patienceLevel) / 100), toBoardPixelSize(2)
        );
    }
}