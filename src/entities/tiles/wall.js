import { TileType } from "../../enum/tile-type";
import { GameVars, toBoardPixelSize } from "../../game-variables";
import { drawFloor, drawWall } from "../../utilities/draw-utilities";
import { Rectangle } from "../rectangle";
import { SelectionArrow } from "../selection-arrow";
import { Tile } from "./tile";

export class Wall extends Tile {
    drawBack() {
        drawWall(this.ctx, this.boardX, this.boardY - 1,
            this.collisionObj.width, this.collisionObj.height,
            "#cd9722", "#e0ba50");
        drawWall(this.ctx, this.boardX, this.boardY,
            this.collisionObj.width, this.collisionObj.height,
            "#641f14", "#865433");
    }
}