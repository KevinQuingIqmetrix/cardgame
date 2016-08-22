import {suiteResource} from "./suiteResource" 

export interface cardResource{
    id: number;
    suite: suiteResource;
    rank: number;
}
export interface playedCardResource extends cardResource {
    turn: number;
    playerName: string;
}