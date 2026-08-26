import { Balcony } from "../entities/tiles/balcony";
import { BinTile } from "../entities/tiles/bin-tile";
import { CashierMachine } from "../entities/tiles/cashier-machine";
import { ConeMachine } from "../entities/tiles/cone-machine";
import { Floor } from "../entities/tiles/floor";
import { Grass } from "../entities/tiles/grass";
import { IceCreamMachine } from "../entities/tiles/icecream-machine";
import { Wall } from "../entities/tiles/wall";
import { TileType } from "../enum/tile-type";

export const generateTile = (boardX, boardY, tileType, ctx) => {
    switch (tileType) {
        case TileType.GRASS: return new Grass(boardX, boardY, ctx);
        case TileType.FLOOR: return new Floor(boardX, boardY, ctx);
        case TileType.WALL: return new Wall(boardX, boardY, ctx);
        case TileType.BIN: return new BinTile(boardX, boardY, ctx);
        case TileType.CONE_MACHINE: return new ConeMachine(boardX, boardY, ctx);
        case TileType.ICE_CREAM_MACHINE: return new IceCreamMachine(boardX, boardY, ctx);
        case TileType.CASHIER: return new CashierMachine(boardX, boardY, ctx);
        case TileType.BALCONY: return new Balcony(boardX, boardY, ctx);
    }
};