import {cardResource} from "./cardResource";
export interface playedCardResource extends cardResource {
    turn: number;
    playerName: string;
}