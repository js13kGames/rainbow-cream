import { Character, CharacterColor, Cone, ConeWithStep1, ConeWithStep2, ConeWithStep3 } from "../../sprites/tile-sprites";
import { ColorType, getDarkColorByType, getLightColorByType } from "../../enum/color-type";
import { EmployeeState } from "../../enum/employee-state";
import { GameVars, toBoardPixelSize } from "../../game-variables";
import { clamp, randomNumb } from "../../utilities/general-utilities";
import { genSmallBox } from "../../utilities/box-generator";
import { drawSprite } from "../../utilities/draw-utilities";
import { drawPixelTextInCanvas } from "../../utilities/text";

export class IceCreamWorker {
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
        this.hasCone = false;
        this.iceCreamColors = [];

        this.workerColor = CharacterColor[randomNumb(CharacterColor.length)];

        this.state = EmployeeState.IDLE;
        this.targetIceCreamMachineIndex = 0;
        this.balconyIndex = 0;
        this.customer = null;
    }

    moveToBoardPos(boardX, boardY) {
        this.nextCenterX = (boardX * GameVars.tileSize) + (GameVars.tileSize / 2);
        this.nextCenterY = (boardY * GameVars.tileSize) + (GameVars.tileSize / 2);
    }

    cleanOrder() {
        this.hasCone = false;
        this.iceCreamColors = [];
        this.state = EmployeeState.IDLE;
        this.targetIceCreamMachineIndex = 0;
        this.balconyIndex = 0;
        this.customer = null;
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
        const staffSpeed = GameVars.game.management.getStaffSpeed();
        if (this.delayTimer >= staffSpeed) {
            this.delayTimer -= staffSpeed;
            switch (this.state) {
                case EmployeeState.IDLE: this.onIdle(); break;
                case EmployeeState.TO_CONE_MACHINE: this.checkArrival(); break;
                case EmployeeState.TO_ICE_CREAM_MACHINE: this.checkArrival(); break;
                case EmployeeState.TO_BALCONY: this.checkArrival(); break;
                case EmployeeState.TO_BIN: this.checkArrival(); break;
            }
        }
    }

    onIdle() {
        let bestBalconyIndex = -1;
        let bestCustomer = null;
        let bestPatience = 101;
        for (let i = 0; i < this.board.balconies.length; i++) {
            const customer = this.board.balconies[i].customer;
            if (!customer || this.isAlreadyBeingServed(customer)) continue;
            if (customer.patienceLevel < bestPatience) {
                bestPatience = customer.patienceLevel;
                bestBalconyIndex = i;
                bestCustomer = customer;
            }
        }
        if (bestBalconyIndex !== -1) {
            this.balconyIndex = bestBalconyIndex;
            this.customer = bestCustomer;
            this.state = EmployeeState.TO_CONE_MACHINE;

            const coneMachine = this.board.coneMachines[0];
            this.moveToBoardPos(coneMachine.boardX, coneMachine.boardY + 1);
        }
    }

    isAlreadyBeingServed(customer) {
        for (let i = 0; i < this.board.iceCreamWorkers.length; i++) {
            const worker = this.board.iceCreamWorkers[i];
            if (worker == this) continue;
            if (worker.customer && worker.customer === customer) {
                return true;
            }
        }
        return false;
    }

    checkArrival() {
        if (!this.isMoving()) {
            switch (this.state) {
                case EmployeeState.TO_CONE_MACHINE: this.onReachConeMachine(); break;
                case EmployeeState.TO_ICE_CREAM_MACHINE: this.onReachIceCreamMachine(); break;
                case EmployeeState.TO_BALCONY: this.onReachBalcony(); break;
                case EmployeeState.TO_BIN: this.cleanOrder(); break;
            }
        }
    }

    onReachConeMachine() {
        if (!this.hasCone) {
            const coneMachine = this.board.coneMachines[0];
            if (coneMachine.flourAmount >= coneMachine.consumption) {
                this.hasCone = true;
                coneMachine.flourAmount = clamp(coneMachine.flourAmount - coneMachine.consumption, 0, 100);
                this.setTargetIceCreamMachine(0);
            }
        }
    }

    setTargetIceCreamMachine(index) {
        const iceCreamMachine = this.board.iceCreamMachines[this.customer.flavoursColors[index]];
        this.targetIceCreamMachineIndex = index;
        this.moveToBoardPos(iceCreamMachine.boardX, iceCreamMachine.boardY + 1);
        this.state = EmployeeState.TO_ICE_CREAM_MACHINE;
    }

    onReachIceCreamMachine() {
        const customer = this.customer;
        const targetColor = customer.flavoursColors[this.targetIceCreamMachineIndex];
        const iceCreamMachine = this.board.iceCreamMachines[targetColor];

        if (iceCreamMachine.iceCreamAmount >= iceCreamMachine.consumption && this.iceCreamColors.length < 3) {
            this.iceCreamColors.push(targetColor);
            iceCreamMachine.iceCreamAmount = clamp(iceCreamMachine.iceCreamAmount - iceCreamMachine.consumption, 0, 100);

            this.targetIceCreamMachineIndex++;
            if (this.targetIceCreamMachineIndex < customer.flavoursColors.length) {
                this.setTargetIceCreamMachine(this.targetIceCreamMachineIndex);
            } else {
                const balcony = this.board.balconies[this.balconyIndex];
                this.moveToBoardPos(balcony.boardX, balcony.boardY - 1);
                this.state = EmployeeState.TO_BALCONY;
            }
        }
    }

    onReachBalcony() {
        const balcony = this.board.balconies[this.balconyIndex];
        const customer = this.customer;
        if (balcony.customer != customer || !balcony.checkIfOrderIsCorrect(this)) {
            const bin = this.board.bin;
            this.moveToBoardPos(bin.boardX - 1, bin.boardY);
            this.state = EmployeeState.TO_BIN;
        } else {
            balcony.processDelivery(this);
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
        drawPixelTextInCanvas("i", this.ctx, toBoardPixelSize(1),
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
