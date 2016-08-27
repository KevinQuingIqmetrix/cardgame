import {cardResource} from "tongitz.models/resource/cardResource";
export interface playedCardResource extends cardResource {
    turn: number;
    playerName: string;
}