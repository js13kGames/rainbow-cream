import { TileType } from "../../enum/tile-type";
import { GameVars, toBoardPixelSize } from "../../game-variables";
import { drawFloor } from "../../utilities/draw-utilities";
import { Rectangle } from "../rectangle";
import { SelectionArrow } from "../selection-arrow";
import { Tile } from "./tile";

export class Wall extends Tile {
    drawBack() {
        this.drawWall(this.boardX, this.boardY - 1,
            this.collisionObj.width, this.collisionObj.height,
            "#cd9722", "#e0ba50");
        this.drawWall(this.boardX, this.boardY,
            this.collisionObj.width, this.collisionObj.height,
            "#641f14", "#865433");
    }

    drawWall(boardX, boardY, width, height, frontColor, backColor) {
        this.ctx.fillStyle = backColor;
        this.ctx.fillRect(
            toBoardPixelSize(boardX * GameVars.tileSize),
            toBoardPixelSize(boardY * GameVars.tileSize),
            width, height);

        this.ctx.fillStyle = frontColor;
        this.ctx.fillRect(
            toBoardPixelSize(boardX * GameVars.tileSize),
            toBoardPixelSize((boardY * GameVars.tileSize) + 1),
            toBoardPixelSize(7), toBoardPixelSize(6));
        this.ctx.fillRect(
            toBoardPixelSize((boardX * GameVars.tileSize) + 9),
            toBoardPixelSize((boardY * GameVars.tileSize) + 1),
            toBoardPixelSize(7), toBoardPixelSize(6));
        this.ctx.fillRect(
            toBoardPixelSize(boardX * GameVars.tileSize),
            toBoardPixelSize((boardY * GameVars.tileSize) + 9),
            toBoardPixelSize(14), toBoardPixelSize(6));
    }
}