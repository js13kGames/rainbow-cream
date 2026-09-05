import { TileType } from "../../enum/tile-type";
import { GameVars, toBoardPixelSize } from "../../game-variables";
import { drawFloor } from "../../utilities/draw-utilities";
import { Rectangle } from "../rectangle";
import { Tile } from "./tile";

export class Floor extends Tile {
    drawBack() {
        drawFloor(this.ctx,
            this.boardX, this.boardY,
            this.collisionObj.width, this.collisionObj.height,
            "#474747", "#515151", "#38252e", "#1b1116"
        );
    }
}