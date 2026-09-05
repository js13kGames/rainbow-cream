import { Character, CharacterColor, Cone, ConeWithStep1, ConeWithStep2, ConeWithStep3 } from "../../sprites/tile-sprites";
import { ColorType, getDarkColorByType, getLightColorByType } from "../../enum/color-type";
import { EmployeeState } from "../../enum/employee-state";
import { GameVars, toBoardPixelSize } from "../../game-variables";
import { clamp, randomNumb } from "../../utilities/general-utilities";
import { genSmallBox } from "../../utilities/box-generator";
import { drawSprite } from "../../utilities/draw-utilities";
import { drawPixelTextInCanvas } from "../../utilities/text";

export class CashierWorker {
    constructor() {
        this.board = GameVars.game.board;
        this.boardX = this.board.player.boardX;
        this.boardY = this.board.player.boardY;

        this.centerX = (this.boardX * GameVars.tileSize) + (GameVars.tileSize / 2);
        this.centerY = (this.boardY * GameVars.tileSize) + (GameVars.tileSize / 2);

        this.nextCenterX = this.centerX;
        this.nextCenterY = this.centerY;

        this.moveSoundTimer = 0;
        this.jumpingTimer = 0;
        this.jumpingExtra = 0;
        this.isGoingUp = true;
        this.delayTimer = 0;

        this.ctx = this.board.boardCtx;
        this.workerColor = CharacterColor[randomNumb(CharacterColor.length)];

        this.state = EmployeeState.TO_CASHIER;
        this.cashier = GameVars.game.board.cashiers[0];
        this.moveToBoardPos(this.cashier.boardX, this.cashier.boardY - 1);
    }

    moveToBoardPos(boardX, boardY) {
        this.nextCenterX = (boardX * GameVars.tileSize) + (GameVars.tileSize / 2);
        this.nextCenterY = (boardY * GameVars.tileSize) + (GameVars.tileSize / 2);
    }

    isMoving() {
        return this.centerX != this.nextCenterX || this.centerY != this.nextCenterY;
    }

    update() {
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

            this.jumpingExtra += this.isGoingUp ? 1 : -1;
            this.yPos = this.centerY + this.jumpingExtra;
        } else {
            this.jumpingExtra = 0;
            this.yPos = this.centerY;
        }

        this.delayTimer += GameVars.deltaTime;
        const staffSpeed = GameVars.game.management.getStaffSpeed() + 2;
        if (this.delayTimer >= staffSpeed) {
            this.delayTimer -= staffSpeed;
            !this.isMoving() && this.cashier.hasClient() && this.cashier.moveClient();
        }
    }

    draw() {
        genSmallBox(this.ctx,
            this.centerX - 6,
            this.yPos - 3,
            11, 7,
            toBoardPixelSize(1), "#00000066", "#00000066");
        drawSprite(this.ctx, Character,
            toBoardPixelSize(1),
            this.centerX - 5,
            this.yPos - 19,
            { "cc": this.workerColor }
        );
        drawPixelTextInCanvas("c", this.ctx, toBoardPixelSize(1),
            this.centerX,
            this.yPos - 15,
            "#9bf2fa"
        );

        if (this.hasCone) {
            genSmallBox(this.ctx,
                this.centerX + 5,
                this.yPos - 14,
                3, 3,
                toBoardPixelSize(1), "#000000", "#cbe5ff");
            genSmallBox(this.ctx,
                this.centerX + 7,
                this.yPos - 28,
                12, 15,
                toBoardPixelSize(1), "#000000", "#cbe5ff");

            if (this.iceCreamColors.length == 0) {
                drawSprite(this.ctx, Cone, toBoardPixelSize(1),
                    this.centerX + 10,
                    this.yPos - 26,
                );
            } else if (this.iceCreamColors.length == 1) {
                drawSprite(this.ctx, ConeWithStep1, toBoardPixelSize(1),
                    this.centerX + 10,
                    this.yPos - 26,
                    {
                        "lc1": getLightColorByType(this.iceCreamColors[0]),
                        "dc1": getDarkColorByType(this.iceCreamColors[0])
                    }
                );
            } else if (this.iceCreamColors.length == 2) {
                drawSprite(this.ctx, ConeWithStep2, toBoardPixelSize(1),
                    this.centerX + 10,
                    this.yPos - 26,
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
                    this.centerX + 10,
                    this.yPos - 26,
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
