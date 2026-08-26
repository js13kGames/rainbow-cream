import { TileType } from "../../enum/tile-type";
import { GameVars, toBoardPixelSize } from "../../game-variables";
import { Bin } from "../../sprites/tile-sprites";
import { drawFloor, drawSprite } from "../../utilities/draw-utilities";
import { Rectangle } from "../rectangle";
import { SelectionArrow } from "../selection-arrow";
import { Tile } from "./tile";

export class BinTile extends Tile {
    drawBack() {
        drawFloor(this.ctx,
            this.boardX, this.boardY,
            this.collisionObj.width, this.collisionObj.height,
            "#474747", "#515151", "#38252e", "#1b1116"
        );
        drawSprite(this.ctx, Bin,
            toBoardPixelSize(1),
            (this.boardX * GameVars.tileSize) + 4,
            (this.boardY * GameVars.tileSize)
        );
    }
}