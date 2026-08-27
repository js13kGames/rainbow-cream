import { ColorType, getDarkColorByType, getLightColorByType } from "../enum/color-type";
import { GameVars, toBoardPixelSize } from "../game-variables";
import { Character, Cone, ConeWithStep1, ConeWithStep2, ConeWithStep3 } from "../sprites/tile-sprites";
import { genSmallBox } from "../utilities/box-generator";
import { drawSprite } from "../utilities/draw-utilities";
import { randomNumb } from "../utilities/general-utilities";
import { drawPixelTextInCanvas } from "../utilities/text";

export class Player {
    constructor(boardX, boardY, ctx) {
        this.boardX = boardX;
        this.boardY = boardY;
        this.ctx = ctx;
        this.hasCone = false;
        this.iceCreamColors = [];
    }

    moveToBoardPos(boardX, boardY) {
        this.boardX = boardX;
        this.boardY = boardY;
    }

    collectCone() {
        this.hasCone = true;
    }

    collectIceCream(color) {
        if (this.hasCone && this.iceCreamColors.length < 3) {
            this.iceCreamColors.push(color);
        }
    }

    cleanOrder() {
        this.hasCone = false;
        this.iceCreamColors = [];
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
        drawPixelTextInCanvas("P", this.ctx, toBoardPixelSize(1),
            (this.boardX * GameVars.tileSize) + 8,
            (this.boardY * GameVars.tileSize) - 8,
            "#9bf2fa"
        );

        if (this.hasCone) {
            genSmallBox(this.ctx,
                (this.boardX * GameVars.tileSize) + 12,
                (this.boardY * GameVars.tileSize) - 14,
                3, 3,
                toBoardPixelSize(1), "#000000", "#cbe5ff");
            genSmallBox(this.ctx,
                (this.boardX * GameVars.tileSize) + 14,
                (this.boardY * GameVars.tileSize) - 28,
                12, 15,
                toBoardPixelSize(1), "#000000", "#cbe5ff");

            if (this.iceCreamColors.length == 0) {
                drawSprite(this.ctx, Cone, toBoardPixelSize(1),
                    (this.boardX * GameVars.tileSize) + 17,
                    (this.boardY * GameVars.tileSize) - 26,
                );
            } else if (this.iceCreamColors.length == 1) {
                drawSprite(this.ctx, ConeWithStep1, toBoardPixelSize(1),
                    (this.boardX * GameVars.tileSize) + 17,
                    (this.boardY * GameVars.tileSize) - 26,
                    {
                        "lc1": getLightColorByType(this.iceCreamColors[0]),
                        "dc1": getDarkColorByType(this.iceCreamColors[0])
                    }
                );
            } else if (this.iceCreamColors.length == 2) {
                drawSprite(this.ctx, ConeWithStep2, toBoardPixelSize(1),
                    (this.boardX * GameVars.tileSize) + 17,
                    (this.boardY * GameVars.tileSize) - 26,
                    {
                        "lc1": getLightColorByType(this.iceCreamColors[0]),
                        "dc1": getDarkColorByType(this.iceCreamColors[0]),
                        "lc2": getLightColorByType(this.iceCreamColors[1]),
                        "dc2": this.iceCreamColors[0] == this.iceCreamColors[1] ?
                            getLightColorByType(this.iceCreamColors[1]) : getDarkColorByType(this.iceCreamColors[1]),
                    }
                );
            } else if (this.iceCreamColors.length == 3) {
                drawSprite(this.ctx, ConeWithStep3, toBoardPixelSize(1),
                    (this.boardX * GameVars.tileSize) + 17,
                    (this.boardY * GameVars.tileSize) - 26,
                    {
                        "lc1": getLightColorByType(this.iceCreamColors[0]),
                        "dc1": getDarkColorByType(this.iceCreamColors[0]),
                        "lc2": getLightColorByType(this.iceCreamColors[1]),
                        "dc2": this.iceCreamColors[0] == this.iceCreamColors[1] ?
                            getLightColorByType(this.iceCreamColors[1]) : getDarkColorByType(this.iceCreamColors[1]),
                        "lc3": getLightColorByType(this.iceCreamColors[2]),
                        "dc3": this.iceCreamColors[1] == this.iceCreamColors[2] ?
                            getLightColorByType(this.iceCreamColors[2]) : getDarkColorByType(this.iceCreamColors[2]),
                    }
                );
            }
        }
    }
}