import { TileType } from "../../enum/tile-type";
import { GameVars, toBoardPixelSize } from "../../game-variables";
import { drawFloor } from "../../utilities/draw-utilities";
import { Rectangle } from "../rectangle";
import { Tile } from "./tile";

export class Grass extends Tile {
    drawBack() {
        drawFloor(this.ctx,
            this.boardX, this.boardY,
            this.collisionObj.width, this.collisionObj.height,
            "#395a36", "#41663d", "#2f1519", "#1b1116"
        );
    }
}