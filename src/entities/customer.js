import { ColorType, getDarkColorByType, getLightColorByType, getRangeColor } from "../enum/color-type";
import { GameVars, toBoardPixelSize } from "../game-variables";
import { Character, CharacterColor } from "../sprites/tile-sprites";
import { genSmallBox } from "../utilities/box-generator";
import { drawSprite } from "../utilities/draw-utilities";
import { clamp, randomNumb, randomNumbOnRange } from "../utilities/general-utilities";

export class Customer {
    constructor(boardX, boardY, ctx) {
        this.boardX = boardX;
        this.boardY = boardY;

        this.centerX = (this.boardX * GameVars.tileSize) + (GameVars.tileSize / 2);
        this.centerY = (this.boardY * GameVars.tileSize) + (GameVars.tileSize / 2);

        this.nextCenterX = this.centerX;
        this.nextCenterY = this.centerY;

        this.moveSoundTimer = 0;
        this.jumpingTimer = 0;
        this.jumpingExtra = 0;
        this.isGoingUp = true;

        this.ctx = ctx;
        this.flavoursAmount = GameVars.game.isTutorial ? 2 : randomNumb(GameVars.game.management.getMaxFlavours());
        this.flavoursColors = this.createIceCreamColors();
        this.patienceLevel = 100;
        this.patienceReduction = randomNumbOnRange(1, 4);
        this.productionTimer = 0;

        this.customerColor = CharacterColor[randomNumb(CharacterColor.length)];

        this.isOrderCompleted = false;
    }

    increasePatience() {
        this.patienceLevel = clamp(this.patienceLevel + 33, 0, 100);
    }

    createIceCreamColors() {
        switch (this.flavoursAmount) {
            case 0: return this.createOneColorIceCream();
            case 1: return this.createTwoColorsIceCream();
            case 2: return this.createThreeColorsIceCream();
        }
    }

    createOneColorIceCream() {
        let randomColor = randomNumb(3);
        while (!GameVars.game.management.isActiveFlavour(randomColor)) randomColor = randomNumb(3);
        return [randomColor, randomColor, randomColor];
    }

    createTwoColorsIceCream() {
        let randomColor1 = randomNumb(3);
        while (!GameVars.game.management.isActiveFlavour(randomColor1)) randomColor1 = randomNumb(3);
        let randomColor2 = randomNumb(3);
        while (randomColor2 == randomColor1 || !GameVars.game.management.isActiveFlavour(randomColor2)) randomColor2 = randomNumb(3);
        return [randomColor1, randomColor2, randomColor2];
    }

    createThreeColorsIceCream() {
        let randomColor1 = randomNumb(3);
        while (!GameVars.game.management.isActiveFlavour(randomColor1)) randomColor1 = randomNumb(3);
        let randomColor2 = randomNumb(3);
        while (randomColor2 == randomColor1 || !GameVars.game.management.isActiveFlavour(randomColor2)) randomColor2 = randomNumb(3);
        let randomColor3 = randomNumb(3);
        while (randomColor3 == randomColor1 || randomColor3 == randomColor2) randomColor3 = randomNumb(3);
        return [randomColor1, randomColor2, randomColor3];
    }

    moveToBoardPos(boardX, boardY) {
        this.nextCenterX = (boardX * GameVars.tileSize) + (GameVars.tileSize / 2);
        this.nextCenterY = (boardY * GameVars.tileSize) + (GameVars.tileSize / 2);
    }

    update() {
        this.productionTimer += GameVars.deltaTime;
        if (this.productionTimer >= 1) {
            this.productionTimer -= 1;
            this.patienceLevel = clamp(this.patienceLevel - this.patienceReduction, 0, 100);
            if (this.patienceLevel == 0) {
                this.moveToBoardPos(10, 15);
            }
        }

        if (this.isMoving()) {
            this.jumpingTimer += GameVars.deltaTime;
            if (this.jumpingTimer >= 0.05) {
                this.jumpingTimer -= 0.05;
                this.isGoingUp = !this.isGoingUp;
            }

            this.moveSoundTimer += GameVars.deltaTime;
            if (this.moveSoundTimer >= 0.1) {
                this.moveSoundTimer -= 0.1;
                GameVars.sound.moveSound();
            }

            const xdiff = this.nextCenterX - this.centerX;
            const ydiff = this.nextCenterY - this.centerY;

            this.centerX += xdiff == 0 ? 0 : xdiff > 0 ? 1 : -1;
            this.centerY += ydiff == 0 ? 0 : ydiff > 0 ? 1 : -1;

            this.boardX = Math.round((this.centerX / GameVars.tileSize) - 0.5);
            this.boardY = Math.round((this.centerY / GameVars.tileSize) - 0.5);
        }

        if (this.boardX == 10 && this.boardY == 15) {
            const customerIndex = GameVars.game.board.customers.findIndex(c => c == this);
            if (customerIndex != -1) {
                if (GameVars.game.isTutorial) GameVars.game.isTutorial = false;
                GameVars.game.board.customers.splice(customerIndex, 1);
            }
        }
    }

    isMoving() {
        return this.centerX != this.nextCenterX || this.centerY != this.nextCenterY;
    }

    draw() {
        if (this.isMoving()) {
            this.jumpingExtra += this.isGoingUp ? 1 : -1;
        } else {
            this.jumpingExtra = 0;
        }
        const yPos = this.centerY + this.jumpingExtra;

        genSmallBox(this.ctx,
            this.centerX - 6,
            yPos - 3,
            11, 7,
            toBoardPixelSize(1), "#00000066", "#00000066");
        drawSprite(this.ctx, Character,
            toBoardPixelSize(1),
            this.centerX - 5,
            yPos - 19,
            { "cc": this.customerColor }
        );

        genSmallBox(this.ctx,
            this.centerX - 7,
            yPos - 24,
            13, 3,
            toBoardPixelSize(1), "#000000", "#1b1116");

        this.ctx.fillStyle = getRangeColor(this.patienceLevel);
        this.ctx.fillRect(
            toBoardPixelSize(this.centerX - 6),
            toBoardPixelSize(yPos - 23),
            toBoardPixelSize((12 * this.patienceLevel) / 100), toBoardPixelSize(2)
        );
    }
}