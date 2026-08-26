import { TileType } from "../../enum/tile-type";
import { GameVars, toBoardPixelSize, toPixelSize } from "../../game-variables";
import { Cashier } from "../../sprites/tile-sprites";
import { genSmallBox } from "../../utilities/box-generator";
import { drawBalcony, drawSprite } from "../../utilities/draw-utilities";
import { Rectangle } from "../rectangle";
import { SelectionArrow } from "../selection-arrow";
import { Tile } from "./tile";

export class CashierMachine extends Tile {
    drawBack() {
        drawBalcony(this.ctx,
            this.boardX, this.boardY, this.collisionObj.width, this.collisionObj.height,
            "#999a9e", "#3e3846", "#686b7a"
        );
        drawSprite(this.ctx, Cashier,
            toBoardPixelSize(1),
            (this.boardX * GameVars.tileSize) + 1,
            ((this.boardY - 1) * GameVars.tileSize) + 8,
            {
                "lc1": "#00bcd4", "dc1": "#10495e",
                "lc2": "#ffff57", "dc2": "#cd9722",
                "lc3": "#a80000", "dc3": "#641f14",
            }
        );
    }
}