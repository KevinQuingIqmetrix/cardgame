/*
gamestate
----status of game viewed by one player
*/
import {card,playedCard} from "./card"

export class gameState{
    /**
     *
     */
    constructor() {
        
    }
    id: number;

    turn: number;
    turnPhase:turnPhaseEnum;
    playerStatuses: playerStatus[];

    deck: card[];
    discards: playedCard[];
    houses: house[];

    error: string[];
}

export class house {
    id: number;
    cards: playedCard[];
    playerId: number;
}
export class playerStatus {
    id: number;
    name: string;
    hand: card[];
}
export enum turnPhaseEnum{
    drawOrChow=1,
    play
}