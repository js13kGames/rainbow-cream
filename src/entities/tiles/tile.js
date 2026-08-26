import { TileType } from "../../enum/tile-type";
import { GameVars, toBoardPixelSize } from "../../game-variables";
import { Rectangle } from "../rectangle";
import { SelectionArrow } from "../selection-arrow";

export class Tile {
    constructor(boardX, boardY, ctx) {
        this.boardX = boardX;
        this.boardY = boardY;

        this.character = null;
        this.selectionArrow = new SelectionArrow();

        this.isHighlight = false;
        this.isSelected = false;

        this.ctx = ctx;

        this.collisionObj = this.createCollisionBox();
    }

    createCollisionBox() {
        return new Rectangle(
            toBoardPixelSize(this.boardX * GameVars.tileSize),
            toBoardPixelSize(this.boardY * GameVars.tileSize),
            toBoardPixelSize(GameVars.tileSize),
            toBoardPixelSize(GameVars.tileSize)
        );
    }

    click(x, y) {
        this.isSelected = !!this.character && this.character.isPlayer && this.collisionObj.isInsideRect(x, y);
        return this.isSelected;
    }

    canMoveTo(x, y) {
        return this.isSelected && this.collisionObj.isInsideRect(x, y);
    }

    select(direction) {
        this.isSelected = true;
        this.directionArrow.direction = direction;
    }

    updateZoom() {
        this.collisionObj = this.createCollisionBox();
    }

    update(x, y) {
        this.isHighlight = this.collisionObj.isInsideRect(x, y);
    }

    updatePos(x, y) {
        this.collisionObj.updatePos(x, y);
    }

    drawBack() {
    }

    drawMiddle(isEnemyTurn) {
        if (this.isHighlight) this.drawHighlight("#ffff57");
    }

    drawHighlight(color) {
        this.ctx.fillStyle = color + "66";
        this.ctx.fillRect(
            toBoardPixelSize(this.boardX * GameVars.tileSize),
            toBoardPixelSize(this.boardY * GameVars.tileSize),
            this.collisionObj.width, this.collisionObj.height);
    }
}