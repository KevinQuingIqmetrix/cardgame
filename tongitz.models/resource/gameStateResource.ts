/*
gamestate
----status of game viewed by one player
*/
import {cardResource,playedCardResource} from "./cardResource"

export interface gameStateResource{
    gameId: number;
    playerId: number

    turn: number;
    turnPhase: turnPhaseEnum;
    playerTurn: string;
    myTurn: boolean;
    
    deck: number;
    lastDiscard: playedCardResource ;

    status: myStatusResource;
    enemyStatus: enemyStatusResource;

    error: string[];
}

export interface houseResource {
    id: number;
    cards: playedCardResource[];
}
interface playerStatusResource {
    name: string;
    discards: cardResource[];
    houses: houseResource[];
}
export interface myStatusResource extends playerStatusResource{
    hand: cardResource[];
}
export interface enemyStatusResource extends playerStatusResource{
    hand: number;
}
export enum turnPhaseEnum{
    drawOrChow=1,
    play
}
