import { TileType } from "../../enum/tile-type";
import { GameVars, toBoardPixelSize, toPixelSize } from "../../game-variables";
import { Unicorn } from "../../sprites/tile-sprites";
import { genSmallBox } from "../../utilities/box-generator";
import { drawBalcony, drawSprite } from "../../utilities/draw-utilities";
import { Rectangle } from "../rectangle";
import { SelectionArrow } from "../selection-arrow";
import { Tile } from "./tile";

export class IceCreamMachine extends Tile {

    setCreamColor(lightColor, darkColor) {
        this.lightColor = lightColor;
        this.darkColor = darkColor;
    }

    drawBack() {
        drawBalcony(this.ctx,
            this.boardX, this.boardY, this.collisionObj.width, this.collisionObj.height,
            "#999a9e", "#3e3846", "#686b7a"
        );
        drawSprite(this.ctx, Unicorn,
            toBoardPixelSize(1),
            (this.boardX * GameVars.tileSize),
            ((this.boardY - 1) * GameVars.tileSize),
            {
                "lc": this.lightColor, "dc": this.darkColor,
            }
        );
    }
}