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
    lastDiscard: cardResource ;

    status: myStatusResource;
    enemyStatus: enemyStatusResource;

    error: string[];
}

interface houseResource {
    id: number;
    cards: playedCardResource[];
}
interface playerStatusResource {
    name: string;
    discards: cardResource[];
    houses: houseResource[];
}
interface myStatusResource extends playerStatusResource{
    hand: cardResource[];
}
interface enemyStatusResource extends playerStatusResource{
    hand: number;
}
enum turnPhaseEnum{
    drawOrChow=1,
    play
}
